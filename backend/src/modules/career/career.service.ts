import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/apiError";
import { EmploymentType } from "@prisma/client";

export class CareerService {
  static async getListings(onlyActive: boolean = false) {
    return prisma.careerListing.findMany({
      where: onlyActive ? { isActive: true } : undefined,
      include: {
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getListingById(id: string) {
    const listing = await prisma.careerListing.findUnique({
      where: { id },
      include: {
        applications: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!listing) {
      throw new ApiError(404, "Career listing not found.");
    }
    return listing;
  }

  static async createListing(data: {
    title: string;
    department: string;
    location: string;
    employmentType?: EmploymentType;
    experience: string;
    description: string;
    requirements: string[];
    deadline: string | Date;
    isActive?: boolean;
  }) {
    return prisma.careerListing.create({
      data: {
        title: data.title,
        department: data.department,
        location: data.location,
        employmentType: data.employmentType || EmploymentType.FULL_TIME,
        experience: data.experience,
        description: data.description,
        requirements: data.requirements || [],
        deadline: new Date(data.deadline),
        isActive: data.isActive ?? true,
      },
    });
  }

  static async updateListing(
    id: string,
    data: {
      title?: string;
      department?: string;
      location?: string;
      employmentType?: EmploymentType;
      experience?: string;
      description?: string;
      requirements?: string[];
      deadline?: string | Date;
      isActive?: boolean;
    }
  ) {
    const existing = await prisma.careerListing.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(404, "Career listing not found.");
    }
    return prisma.careerListing.update({
      where: { id },
      data: {
        ...data,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
      },
    });
  }

  static async deleteListing(id: string) {
    const existing = await prisma.careerListing.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(404, "Career listing not found.");
    }
    return prisma.careerListing.delete({ where: { id } });
  }

  static async apply(
    careerListingId: string,
    data: {
      applicantName: string;
      applicantPhone: string;
      applicantEmail?: string;
      portfolioUrl?: string;
      coverNote?: string;
      resumeUrl?: string;
    }
  ) {
    const listing = await prisma.careerListing.findUnique({
      where: { id: careerListingId },
    });
    if (!listing || !listing.isActive) {
      throw new ApiError(400, "This career listing is no longer accepting applications.");
    }

    return prisma.careerApplication.create({
      data: {
        careerListingId,
        applicantName: data.applicantName,
        applicantPhone: data.applicantPhone,
        applicantEmail: data.applicantEmail,
        portfolioUrl: data.portfolioUrl,
        coverNote: data.coverNote,
        resumeUrl: data.resumeUrl,
      },
    });
  }

  static async getApplications() {
    return prisma.careerApplication.findMany({
      include: {
        careerListing: {
          select: { id: true, title: true, department: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
