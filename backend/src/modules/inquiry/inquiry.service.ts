import { prisma } from "../../config/prisma";
import { InquiryStatus } from "@prisma/client";
import { ApiError } from "../../utils/apiError";

export class InquiryService {
  static async create(data: {
    serviceType: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    organization?: string;
    requirements: string;
  }) {
    return prisma.serviceInquiry.create({
      data: {
        serviceType: data.serviceType,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        organization: data.organization,
        requirements: data.requirements,
        status: InquiryStatus.NEW,
      },
    });
  }

  static async getAll(query: {
    status?: InquiryStatus;
    serviceType?: string;
    search?: string;
    dateRange?: string;
  } = {}) {
    const where: any = {};

    if (query.status && Object.values(InquiryStatus).includes(query.status)) {
      where.status = query.status;
    }

    if (query.serviceType && query.serviceType !== "ALL") {
      where.serviceType = { contains: query.serviceType, mode: "insensitive" };
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
        { customerName: { contains: q, mode: "insensitive" } },
        { customerPhone: { contains: q } },
        { customerEmail: { contains: q, mode: "insensitive" } },
        { organization: { contains: q, mode: "insensitive" } },
        { serviceType: { contains: q, mode: "insensitive" } },
        { requirements: { contains: q, mode: "insensitive" } },
      ];
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      inquiries,
      totalCount,
      newCount,
      inReviewCount,
      contactedCount,
      resolvedCount,
      todayCount,
    ] = await Promise.all([
      prisma.serviceInquiry.findMany({
        where,
        orderBy: { createdAt: "desc" },
      }),
      prisma.serviceInquiry.count(),
      prisma.serviceInquiry.count({ where: { status: InquiryStatus.NEW } }),
      prisma.serviceInquiry.count({ where: { status: InquiryStatus.IN_REVIEW } }),
      prisma.serviceInquiry.count({ where: { status: InquiryStatus.CONTACTED } }),
      prisma.serviceInquiry.count({ where: { status: InquiryStatus.RESOLVED } }),
      prisma.serviceInquiry.count({ where: { createdAt: { gte: todayStart } } }),
    ]);

    const stats = {
      total: totalCount,
      newCount,
      inReviewCount,
      contactedCount,
      resolvedCount,
      todayCount,
    };

    return {
      inquiries,
      stats,
    };
  }

  static async updateStatus(id: string, status: InquiryStatus, adminNotes?: string) {
    const inquiry = await prisma.serviceInquiry.findUnique({ where: { id } });
    if (!inquiry) {
      throw new ApiError(404, "Inquiry not found.");
    }

    return prisma.serviceInquiry.update({
      where: { id },
      data: {
        status,
        adminNotes: adminNotes !== undefined ? adminNotes : inquiry.adminNotes,
      },
    });
  }

  static async batchUpdateStatus(ids: string[], status: InquiryStatus, adminNotes?: string) {
    if (!ids || ids.length === 0) {
      throw new ApiError(400, "No inquiry IDs provided.");
    }

    const updateData: any = { status };
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }

    const result = await prisma.serviceInquiry.updateMany({
      where: { id: { in: ids } },
      data: updateData,
    });

    return {
      updatedCount: result.count,
      status,
    };
  }

  static async delete(id: string) {
    const inquiry = await prisma.serviceInquiry.findUnique({ where: { id } });
    if (!inquiry) {
      throw new ApiError(404, "Inquiry not found.");
    }

    await prisma.serviceInquiry.delete({ where: { id } });
    return { success: true, message: "Inquiry record deleted." };
  }

  static async batchDelete(ids: string[]) {
    if (!ids || ids.length === 0) {
      throw new ApiError(400, "No inquiry IDs provided.");
    }

    const result = await prisma.serviceInquiry.deleteMany({
      where: { id: { in: ids } },
    });

    return {
      deletedCount: result.count,
      message: `Successfully deleted ${result.count} inquiries.`,
    };
  }
}
