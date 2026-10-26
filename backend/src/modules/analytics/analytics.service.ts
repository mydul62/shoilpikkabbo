import { prisma } from "../../config/prisma";
import { OrderStatus, PaymentStatus, VerificationStatus } from "@prisma/client";

export class AnalyticsService {
  static async getOverview() {
    const [
      totalOrders,
      pendingOrders,
      paidOrders,
      pendingPayments,
      totalProducts,
      lowStockProducts,
      totalCustomers,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { orderStatus: OrderStatus.PENDING } }),
      prisma.order.findMany({
        where: { paymentStatus: PaymentStatus.PAID },
        select: { totalAmount: true },
      }),
      prisma.payment.count({ where: { status: VerificationStatus.PENDING } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { stock: { lte: 20 }, isActive: true } }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
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

    return {
      totalOrders,
      pendingOrders,
      confirmedRevenue,
      pendingPayments,
      totalProducts,
      lowStockProducts,
      totalCustomers,
      recentOrders,
    };
  }
}
