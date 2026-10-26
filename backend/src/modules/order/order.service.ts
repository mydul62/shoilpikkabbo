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
    search?: string;
  }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 20);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) where.orderStatus = query.status;
    if (query.search) {
      where.OR = [
        { orderNumber: { contains: query.search, mode: "insensitive" } },
        { customerName: { contains: query.search, mode: "insensitive" } },
        { customerPhone: { contains: query.search } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { items: true, payments: true },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  static async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    note?: string
  ) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id: orderId },
        data: { orderStatus: status },
      });

      await tx.deliveryTrackingEvent.create({
        data: {
          orderId,
          status,
          description: note || `Order status updated to ${status}.`,
        },
      });

      return order;
    });
  }
}
