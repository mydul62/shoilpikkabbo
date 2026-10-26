import { prisma } from "../../config/prisma";
import { InquiryStatus } from "@prisma/client";

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

  static async getAll() {
    return prisma.serviceInquiry.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateStatus(id: string, status: InquiryStatus, adminNotes?: string) {
    return prisma.serviceInquiry.update({
      where: { id },
      data: { status, adminNotes },
    });
  }
}
