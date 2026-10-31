import { prisma } from "../../config/prisma";
import { OrderStatus, PaymentStatus, VerificationStatus } from "@prisma/client";

export class AnalyticsService {
  static async getOverview() {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [
      totalOrders,
      pendingOrders,
      paidOrders,
      revenue24hOrders,
      orders24hCount,
      pendingPayments,
      totalProducts,
      lowStockProducts,
      registeredCustomersCount,
      guestCustomerPhones,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { orderStatus: OrderStatus.PENDING } }),
      prisma.order.findMany({
        where: { paymentStatus: PaymentStatus.PAID },
        select: { totalAmount: true },
      }),
      // Revenue in last 24 hours (paid orders placed or verified within 24h)
      prisma.order.findMany({
        where: {
          paymentStatus: PaymentStatus.PAID,
          OR: [
            { createdAt: { gte: twentyFourHoursAgo } },
            { updatedAt: { gte: twentyFourHoursAgo } },
          ],
        },
        select: { totalAmount: true },
      }),
      // Count of all orders placed in last 24h
      prisma.order.count({
        where: { createdAt: { gte: twentyFourHoursAgo } },
      }),
      prisma.payment.count({ where: { status: VerificationStatus.PENDING } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { stock: { lte: 20 }, isActive: true } }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.order.groupBy({
        by: ["customerPhone"],
        where: { userId: null },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          orderNumber: true,
          customerName: true,
          totalAmount: true,
          orderStatus: true,
          createdAt: true,
        },
      }),
    ]);

    const confirmedRevenue = paidOrders.reduce(
      (sum, o) => sum + Number(o.totalAmount),
      0
    );

    const revenue24h = revenue24hOrders.reduce(
      (sum, o) => sum + Number(o.totalAmount),
      0
    );

    return {
      totalOrders,
      pendingOrders,
      confirmedRevenue,
      revenue24h,
      orders24hCount,
      pendingPayments,
      totalProducts,
      lowStockProducts,
      totalCustomers: Math.max(registeredCustomersCount + guestCustomerPhones.length, 1),
      recentOrders,
    };
  }
}
