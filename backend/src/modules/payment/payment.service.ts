import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/apiError";
import { VerificationStatus, PaymentStatus, PaymentMethod } from "@prisma/client";

export class PaymentService {
  static async getAllPayments(query: {
    status?: VerificationStatus;
    method?: PaymentMethod;
    search?: string;
    dateRange?: string;
  }) {
    const where: any = {};

    if (query.status && Object.values(VerificationStatus).includes(query.status)) {
      where.status = query.status;
    }

    if (query.method && Object.values(PaymentMethod).includes(query.method)) {
      where.method = query.method;
    }

    if (query.dateRange) {
      const now = new Date();
      if (query.dateRange === "TODAY") {
        where.createdAt = { gte: new Date(now.setHours(0, 0, 0, 0)) };
      } else if (query.dateRange === "YESTERDAY") {
        const startYesterday = new Date(now);
        startYesterday.setDate(startYesterday.getDate() - 1);
        startYesterday.setHours(0, 0, 0, 0);
        const endYesterday = new Date(startYesterday);
        endYesterday.setHours(23, 59, 59, 999);
        where.createdAt = { gte: startYesterday, lte: endYesterday };
      } else if (query.dateRange === "LAST_7_DAYS") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        where.createdAt = { gte: sevenDaysAgo };
      } else if (query.dateRange === "THIS_MONTH") {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        where.createdAt = { gte: startOfMonth };
      }
    }

    if (query.search && query.search.trim()) {
      const q = query.search.trim();
      where.OR = [
        { transactionId: { contains: q, mode: "insensitive" } },
        { senderPhone: { contains: q } },
        { bankReference: { contains: q, mode: "insensitive" } },
        {
          order: {
            OR: [
              { orderNumber: { contains: q, mode: "insensitive" } },
              { customerName: { contains: q, mode: "insensitive" } },
              { customerPhone: { contains: q } },
            ],
          },
        },
      ];
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      payments,
      totalCount,
      pendingCount,
      verifiedCount,
      rejectedCount,
      verifiedAmountResult,
      pendingAmountResult,
      todayVerifiedResult,
    ] = await Promise.all([
      prisma.payment.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          order: {
            select: {
              id: true,
              orderNumber: true,
              customerName: true,
              customerPhone: true,
              customerEmail: true,
              paymentMethod: true,
              totalAmount: true,
              orderStatus: true,
              paymentStatus: true,
              shippingAddress: true,
              city: true,
              items: {
                select: {
                  id: true,
                  productName: true,
                  quantity: true,
                  unitPrice: true,
                  totalPrice: true,
                },
              },
            },
          },
        },
      }),
      prisma.payment.count(),
      prisma.payment.count({ where: { status: VerificationStatus.PENDING } }),
      prisma.payment.count({ where: { status: VerificationStatus.VERIFIED } }),
      prisma.payment.count({ where: { status: VerificationStatus.REJECTED } }),
      prisma.payment.aggregate({
        where: { status: VerificationStatus.VERIFIED },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { status: VerificationStatus.PENDING },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: {
          status: VerificationStatus.VERIFIED,
          verifiedAt: { gte: todayStart },
        },
        _sum: { amount: true },
      }),
    ]);

    const stats = {
      totalPayments: totalCount,
      pendingCount,
      verifiedCount,
      rejectedCount,
      verifiedAmount: Number(verifiedAmountResult._sum.amount || 0),
      pendingAmount: Number(pendingAmountResult._sum.amount || 0),
      todayVerifiedAmount: Number(todayVerifiedResult._sum.amount || 0),
    };

    return {
      payments,
      stats,
    };
  }

  static async verifyPayment(
    paymentId: string,
    decision: "VERIFIED" | "REJECTED",
    verifiedByUserId?: string,
    notes?: string
  ) {
    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { id: paymentId },
        include: { order: true },
      });

      if (!payment) {
        throw new ApiError(404, "Payment record not found.");
      }

      const updatedPayment = await tx.payment.update({
        where: { id: paymentId },
        data: {
          status:
            decision === "VERIFIED"
              ? VerificationStatus.VERIFIED
              : VerificationStatus.REJECTED,
          verifiedByUserId,
          verificationNotes: notes,
          verifiedAt: new Date(),
        },
        include: { order: true },
      });

      // Update order payment status
      if (decision === "VERIFIED") {
        await tx.order.update({
          where: { id: payment.orderId },
          data: { paymentStatus: PaymentStatus.PAID },
        });

        // Add tracking event to order
        await tx.deliveryTrackingEvent.create({
          data: {
            orderId: payment.orderId,
            status: payment.order.orderStatus,
            description: `Payment of ৳${payment.amount} (${payment.method}) verified & settled.`,
          },
        });
      } else {
        await tx.order.update({
          where: { id: payment.orderId },
          data: { paymentStatus: PaymentStatus.FAILED },
        });

        // Add tracking event to order
        await tx.deliveryTrackingEvent.create({
          data: {
            orderId: payment.orderId,
            status: payment.order.orderStatus,
            description: `Payment audit rejected: ${notes || "Verification failed."}`,
          },
        });
      }

      return updatedPayment;
    });
  }

  static async batchVerify(
    paymentIds: string[],
    decision: "VERIFIED" | "REJECTED",
    verifiedByUserId?: string,
    notes?: string
  ) {
    if (!paymentIds || paymentIds.length === 0) {
      throw new ApiError(400, "No payment IDs provided.");
    }

    return prisma.$transaction(async (tx) => {
      const payments = await tx.payment.findMany({
        where: { id: { in: paymentIds } },
        include: { order: true },
      });

      const updatedPayments = await tx.payment.updateMany({
        where: { id: { in: paymentIds } },
        data: {
          status:
            decision === "VERIFIED"
              ? VerificationStatus.VERIFIED
              : VerificationStatus.REJECTED,
          verifiedByUserId,
          verificationNotes: notes || `Batch verified as ${decision}.`,
          verifiedAt: new Date(),
        },
      });

      const orderIds = payments.map((p) => p.orderId);
      if (orderIds.length > 0) {
        await tx.order.updateMany({
          where: { id: { in: orderIds } },
          data: {
            paymentStatus:
              decision === "VERIFIED"
                ? PaymentStatus.PAID
                : PaymentStatus.FAILED,
          },
        });
      }

      return {
        updatedCount: updatedPayments.count,
        decision,
      };
    });
  }

  static async deletePayment(id: string) {
    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) {
      throw new ApiError(404, "Payment record not found.");
    }

    await prisma.payment.delete({ where: { id } });
    return { success: true, message: "Payment record deleted." };
  }

  static async batchDelete(ids: string[]) {
    if (!ids || ids.length === 0) {
      throw new ApiError(400, "No payment IDs provided.");
    }

    const deleteResult = await prisma.payment.deleteMany({
      where: { id: { in: ids } },
    });

    return {
      deletedCount: deleteResult.count,
      message: `Successfully deleted ${deleteResult.count} payment record(s).`,
    };
  }
}
