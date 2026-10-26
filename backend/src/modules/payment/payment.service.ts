import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/apiError";
import { VerificationStatus, PaymentStatus } from "@prisma/client";

export class PaymentService {
  static async getAllPayments(query: { status?: VerificationStatus }) {
    const where: any = {};
    if (query.status) where.status = query.status;

    return prisma.payment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        order: {
          select: {
            orderNumber: true,
            customerName: true,
            customerPhone: true,
            paymentMethod: true,
            totalAmount: true,
            orderStatus: true,
          },
        },
      },
    });
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
      });

      // Update order payment status
      if (decision === "VERIFIED") {
        await tx.order.update({
          where: { id: payment.orderId },
          data: { paymentStatus: PaymentStatus.PAID },
        });
      } else {
        await tx.order.update({
          where: { id: payment.orderId },
          data: { paymentStatus: PaymentStatus.FAILED },
        });
      }

      return updatedPayment;
    });
  }
}
