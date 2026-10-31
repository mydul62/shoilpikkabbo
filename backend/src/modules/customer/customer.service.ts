import { prisma } from "../../config/prisma";
import { Role } from "@prisma/client";

export class CustomerService {
  static async getAll() {
    // 1. Fetch registered users with role CUSTOMER
    const registeredCustomers = await prisma.user.findMany({
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
            orderNumber: true,
            totalAmount: true,
            orderStatus: true,
            paymentStatus: true,
            shippingAddress: true,
            city: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // 2. Fetch all orders (to capture guest orders placed with phone numbers)
    const allOrders = await prisma.order.findMany({
      select: {
        id: true,
        orderNumber: true,
        userId: true,
        customerName: true,
        customerPhone: true,
        customerEmail: true,
        shippingAddress: true,
        city: true,
        totalAmount: true,
        orderStatus: true,
        paymentStatus: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Map by phone number to unify registered users and guest orders
    const customerMap = new Map<string, any>();

    // Add registered customers first
    for (const c of registeredCustomers) {
      if (!c.phone) continue;
      const phoneKey = c.phone.trim();
      const orderCount = c.orders.length;
      const totalSpent = c.orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
      const latestOrder = c.orders[0];

      customerMap.set(phoneKey, {
        id: c.id,
        name: c.name,
        phone: c.phone,
        email: c.email || null,
        role: c.role,
        createdAt: c.createdAt,
        ordersCount: orderCount,
        totalSpent,
        shippingAddress: latestOrder ? `${latestOrder.shippingAddress}, ${latestOrder.city}` : null,
        lastOrderDate: latestOrder ? latestOrder.createdAt : c.createdAt,
        isRegistered: true,
      });
    }

    // Now process all orders to aggregate any guest orders or orders not yet linked
    for (const o of allOrders) {
      if (!o.customerPhone) continue;
      const phoneKey = o.customerPhone.trim();

      if (customerMap.has(phoneKey)) {
        const existing = customerMap.get(phoneKey);
        // If this order wasn't counted in user.orders (e.g. userId was null)
        if (!o.userId || o.userId !== existing.id) {
          existing.ordersCount += 1;
          existing.totalSpent += Number(o.totalAmount);
          if (!existing.shippingAddress && o.shippingAddress) {
            existing.shippingAddress = `${o.shippingAddress}, ${o.city}`;
          }
          if (!existing.email && o.customerEmail) {
            existing.email = o.customerEmail;
          }
          if (new Date(o.createdAt) > new Date(existing.lastOrderDate || 0)) {
            existing.lastOrderDate = o.createdAt;
          }
        }
      } else {
        // Customer who placed orders as guest
        customerMap.set(phoneKey, {
          id: `guest-${phoneKey}`,
          name: o.customerName || "Customer",
          phone: o.customerPhone,
          email: o.customerEmail || null,
          role: "CUSTOMER",
          createdAt: o.createdAt,
          ordersCount: 1,
          totalSpent: Number(o.totalAmount),
          shippingAddress: `${o.shippingAddress}, ${o.city}`,
          lastOrderDate: o.createdAt,
          isRegistered: false,
        });
      }
    }

    // Convert map to array and sort by most recent activity
    const customerList = Array.from(customerMap.values()).sort((a, b) => {
      const dateA = new Date(a.lastOrderDate || a.createdAt).getTime();
      const dateB = new Date(b.lastOrderDate || b.createdAt).getTime();
      return dateB - dateA;
    });

    return customerList;
  }
}
