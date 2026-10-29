import { prisma } from "../../config/prisma";
import { Role } from "@prisma/client";

export class CustomerService {
  static async getAll() {
    const customers = await prisma.user.findMany({
      where: { role: Role.CUSTOMER },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            totalAmount: true,
            orderStatus: true,
            paymentStatus: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return customers.map((c) => {
      const orderCount = c.orders.length;
      const totalSpent = c.orders
        .filter((o) => o.paymentStatus === "PAID")
        .reduce((sum, o) => sum + Number(o.totalAmount), 0);

      return {
        id: c.id,
        name: c.name,
        phone: c.phone,
        email: c.email,
        createdAt: c.createdAt,
        orderCount,
        totalSpent,
      };
    });
  }
}
