import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/apiError";
import { OrderStatus, PaymentStatus, PaymentMethod, VerificationStatus } from "@prisma/client";

export class OrderService {
  static async createOrder(data: {
    userId?: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    shippingAddress: string;
    city: string;
    postalCode?: string;
    deliveryNotes?: string;
    paymentMethod: PaymentMethod;
    transactionId?: string;
    couponCode?: string;
    items: { productId: string; quantity: number }[];
  }) {
    if (!data.items || data.items.length === 0) {
      throw new ApiError(400, "Order must contain at least one item.");
    }

    // Atomic transaction for inventory safety & order consistency
    return prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const orderItemsToCreate: {
        productId: string;
        productName: string;
        unitPrice: number;
        quantity: number;
        totalPrice: number;
      }[] = [];

      for (const item of data.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new ApiError(404, `Product ${item.productId} not found.`);
        }

        if (product.stock < item.quantity) {
          throw new ApiError(
            400,
            `Insufficient stock for "${product.name}". Only ${product.stock} available.`
          );
        }

        const price = Number(product.salePrice ?? product.price);
        const itemTotal = price * item.quantity;
        subtotal += itemTotal;

        orderItemsToCreate.push({
          productId: product.id,
          productName: product.name,
          unitPrice: price,
          quantity: item.quantity,
          totalPrice: itemTotal,
        });

        // Decrement stock
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Coupon discount calculation
      let discountAmount = 0;
      if (data.couponCode) {
        const coupon = await tx.coupon.findUnique({
          where: { code: data.couponCode.trim().toUpperCase() },
        });
        if (coupon && coupon.isActive && new Date() <= coupon.endDate) {
          if (subtotal >= Number(coupon.minOrderAmount)) {
            discountAmount = Math.round(
              (subtotal * Number(coupon.discountValue)) / 100
            );
            await tx.coupon.update({
              where: { id: coupon.id },
              data: { usageCount: { increment: 1 } },
            });
          }
        }
      }

      // Delivery charge calculation
      const deliveryCharge =
        subtotal >= 3000
          ? 0
          : data.city.toLowerCase().includes("dhaka")
          ? 70
          : 130;

      const totalAmount = Math.max(0, subtotal - discountAmount + deliveryCharge);
      const orderNumber = `SK-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      // Create Order
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: data.userId,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerEmail: data.customerEmail,
          shippingAddress: data.shippingAddress,
          city: data.city,
          postalCode: data.postalCode,
          deliveryNotes: data.deliveryNotes,
          subtotal,
          deliveryCharge,
          discountAmount,
          totalAmount,
          couponCode: data.couponCode,
          orderStatus: OrderStatus.PENDING,
          paymentStatus:
            data.paymentMethod === PaymentMethod.CASH_ON_DELIVERY
              ? PaymentStatus.PENDING
              : PaymentStatus.PENDING,
          paymentMethod: data.paymentMethod,
          transactionId: data.transactionId,
          items: {
            create: orderItemsToCreate,
          },
          trackingEvents: {
            create: [
              {
                status: OrderStatus.PENDING,
                description: "Order placed by customer and logged into system.",
                location: data.city,
              },
            ],
          },
        },
        include: {
          items: true,
          trackingEvents: true,
        },
      });

      // Create manual payment audit record
      if (data.paymentMethod !== PaymentMethod.CASH_ON_DELIVERY) {
        await tx.payment.create({
          data: {
            orderId: order.id,
            method: data.paymentMethod,
            transactionId: data.transactionId,
            senderPhone: data.customerPhone,
            amount: totalAmount,
            status: VerificationStatus.PENDING,
          },
        });
      }

      return order;
    });
  }

  static async trackOrder(orderNumber: string, phone?: string) {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        trackingEvents: { orderBy: { timestamp: "asc" } },
        payments: true,
      },
    });

    if (!order) {
      throw new ApiError(404, "Order not found with provided reference.");
    }

    if (phone && !order.customerPhone.includes(phone.trim())) {
      throw new ApiError(403, "Phone verification failed for this order.");
    }

    return order;
  }

  static async getAllOrders(query: {
    page?: number;
    limit?: number;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    paymentMethod?: PaymentMethod;
    search?: string;
    dateRange?: string;
  }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 20);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status && Object.values(OrderStatus).includes(query.status)) {
      where.orderStatus = query.status;
    }
    if (query.paymentStatus && Object.values(PaymentStatus).includes(query.paymentStatus)) {
      where.paymentStatus = query.paymentStatus;
    }
    if (query.paymentMethod && Object.values(PaymentMethod).includes(query.paymentMethod)) {
      where.paymentMethod = query.paymentMethod;
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
        { orderNumber: { contains: q, mode: "insensitive" } },
        { customerName: { contains: q, mode: "insensitive" } },
        { customerPhone: { contains: q } },
        { customerEmail: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
        { transactionId: { contains: q, mode: "insensitive" } },
      ];
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      orders,
      total,
      pendingCount,
      processingCount,
      shippedCount,
      deliveredCount,
      cancelledCount,
      paidCount,
      revenueResult,
      todayOrdersCount,
      todayRevenueResult,
    ] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    orderBy: { isPrimary: "desc" },
                  },
                },
              },
            },
          },
          payments: true,
          trackingEvents: { orderBy: { timestamp: "desc" } },
        },
      }),
      prisma.order.count({ where }),
      prisma.order.count({ where: { orderStatus: OrderStatus.PENDING } }),
      prisma.order.count({ where: { orderStatus: OrderStatus.PROCESSING } }),
      prisma.order.count({ where: { orderStatus: OrderStatus.SHIPPED } }),
      prisma.order.count({ where: { orderStatus: OrderStatus.DELIVERED } }),
      prisma.order.count({ where: { orderStatus: OrderStatus.CANCELLED } }),
      prisma.order.count({ where: { paymentStatus: PaymentStatus.PAID } }),
      prisma.order.aggregate({
        where: { orderStatus: { not: OrderStatus.CANCELLED } },
        _sum: { totalAmount: true },
      }),
      prisma.order.count({
        where: { createdAt: { gte: todayStart } },
      }),
      prisma.order.aggregate({
        where: {
          createdAt: { gte: todayStart },
          orderStatus: { not: OrderStatus.CANCELLED },
        },
        _sum: { totalAmount: true },
      }),
    ]);

    const stats = {
      totalOrders: await prisma.order.count(),
      pendingOrders: pendingCount,
      processingOrders: processingCount,
      shippedOrders: shippedCount,
      deliveredOrders: deliveredCount,
      cancelledOrders: cancelledCount,
      paidOrders: paidCount,
      totalRevenue: Number(revenueResult._sum.totalAmount || 0),
      todayOrders: todayOrdersCount,
      todayRevenue: Number(todayRevenueResult._sum.totalAmount || 0),
    };

    return {
      orders,
      stats,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  static async getOrderById(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: { isPrimary: "desc" },
                },
              },
            },
          },
        },
        payments: true,
        trackingEvents: { orderBy: { timestamp: "desc" } },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
          },
        },
      },
    });

    if (!order) {
      throw new ApiError(404, `Order ${orderId} not found.`);
    }

    return order;
  }

  static async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    note?: string,
    location?: string
  ) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId } });
      if (!order) {
        throw new ApiError(404, `Order ${orderId} not found.`);
      }

      // If status changed to DELIVERED and paymentMethod is CASH_ON_DELIVERY, auto-mark payment as PAID
      const updateData: any = { orderStatus: status };
      if (
        status === OrderStatus.DELIVERED &&
        order.paymentMethod === PaymentMethod.CASH_ON_DELIVERY &&
        order.paymentStatus === PaymentStatus.PENDING
      ) {
        updateData.paymentStatus = PaymentStatus.PAID;
      }

      const updated = await tx.order.update({
        where: { id: orderId },
        data: updateData,
        include: {
          items: true,
          trackingEvents: { orderBy: { timestamp: "desc" } },
          payments: true,
        },
      });

      await tx.deliveryTrackingEvent.create({
        data: {
          orderId,
          status,
          description: note || `Order status updated to ${status}.`,
          location: location || updated.city,
        },
      });

      return updated;
    });
  }

  static async updatePaymentStatus(
    orderId: string,
    paymentStatus: PaymentStatus,
    notes?: string
  ) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId } });
      if (!order) {
        throw new ApiError(404, `Order ${orderId} not found.`);
      }

      const updated = await tx.order.update({
        where: { id: orderId },
        data: { paymentStatus },
        include: {
          items: true,
          trackingEvents: { orderBy: { timestamp: "desc" } },
          payments: true,
        },
      });

      // Synchronize manual payment audit records if marked as PAID or FAILED
      if (paymentStatus === PaymentStatus.PAID) {
        await tx.payment.updateMany({
          where: { orderId, status: VerificationStatus.PENDING },
          data: {
            status: VerificationStatus.VERIFIED,
            verifiedAt: new Date(),
            verificationNotes: notes || "Payment verified by administrator.",
          },
        });
      } else if (paymentStatus === PaymentStatus.FAILED) {
        await tx.payment.updateMany({
          where: { orderId, status: VerificationStatus.PENDING },
          data: {
            status: VerificationStatus.REJECTED,
            verifiedAt: new Date(),
            verificationNotes: notes || "Payment marked as failed by administrator.",
          },
        });
      }

      return updated;
    });
  }

  static async addTrackingEvent(
    orderId: string,
    data: {
      status: OrderStatus;
      description: string;
      location?: string;
    }
  ) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new ApiError(404, `Order ${orderId} not found.`);
    }

    const event = await prisma.deliveryTrackingEvent.create({
      data: {
        orderId,
        status: data.status,
        description: data.description,
        location: data.location || order.city,
      },
    });

    // Optionally update order status if different
    if (order.orderStatus !== data.status) {
      await prisma.order.update({
        where: { id: orderId },
        data: { orderStatus: data.status },
      });
    }

    return event;
  }

  static async batchUpdateStatus(
    orderIds: string[],
    status: OrderStatus,
    note?: string
  ) {
    if (!orderIds || orderIds.length === 0) {
      throw new ApiError(400, "No order IDs provided.");
    }

    return prisma.$transaction(async (tx) => {
      const updateResult = await tx.order.updateMany({
        where: { id: { in: orderIds } },
        data: { orderStatus: status },
      });

      // Create tracking events for each
      const trackingEvents = orderIds.map((id) => ({
        orderId: id,
        status,
        description: note || `Batch updated order status to ${status}.`,
      }));

      await tx.deliveryTrackingEvent.createMany({
        data: trackingEvents,
      });

      return {
        updatedCount: updateResult.count,
        status,
      };
    });
  }

  static async batchUpdatePaymentStatus(
    orderIds: string[],
    paymentStatus: PaymentStatus,
    notes?: string
  ) {
    if (!orderIds || orderIds.length === 0) {
      throw new ApiError(400, "No order IDs provided.");
    }

    return prisma.$transaction(async (tx) => {
      const updateResult = await tx.order.updateMany({
        where: { id: { in: orderIds } },
        data: { paymentStatus },
      });

      if (paymentStatus === PaymentStatus.PAID) {
        await tx.payment.updateMany({
          where: { orderId: { in: orderIds }, status: VerificationStatus.PENDING },
          data: {
            status: VerificationStatus.VERIFIED,
            verifiedAt: new Date(),
            verificationNotes: notes || "Batch verified by admin.",
          },
        });
      }

      return {
        updatedCount: updateResult.count,
        paymentStatus,
      };
    });
  }

  static async deleteOrder(orderId: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new ApiError(404, `Order ${orderId} not found.`);
    }

    await prisma.order.delete({
      where: { id: orderId },
    });

    return { success: true, message: `Order ${order.orderNumber} deleted successfully.` };
  }

  static async batchDeleteOrders(orderIds: string[]) {
    if (!orderIds || orderIds.length === 0) {
      throw new ApiError(400, "No order IDs provided.");
    }

    const deleteResult = await prisma.order.deleteMany({
      where: { id: { in: orderIds } },
    });

    return {
      deletedCount: deleteResult.count,
      message: `Successfully deleted ${deleteResult.count} orders.`,
    };
  }
}
