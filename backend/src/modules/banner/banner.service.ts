import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/apiError";

export class BannerService {
  static async getAll(onlyActive: boolean = false) {
    return prisma.banner.findMany({
      where: onlyActive ? { isActive: true } : undefined,
      orderBy: { displayOrder: "asc" },
    });
  }

  static async create(data: {
    title: string;
    subtitle?: string;
    imageUrl: string;
    linkUrl: string;
    placement?: string;
    displayOrder?: number;
    isActive?: boolean;
  }) {
    return prisma.banner.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        imageUrl: data.imageUrl,
        linkUrl: data.linkUrl,
        placement: data.placement || "Homepage Hero",
        displayOrder: data.displayOrder ?? 0,
        isActive: data.isActive ?? true,
      },
    });
  }

  static async update(
    id: string,
    data: {
      title?: string;
      subtitle?: string;
      imageUrl?: string;
      linkUrl?: string;
      placement?: string;
      displayOrder?: number;
      isActive?: boolean;
    }
  ) {
    const existing = await prisma.banner.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(404, "Banner not found.");
    }
    return prisma.banner.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    const existing = await prisma.banner.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(404, "Banner not found.");
    }
    return prisma.banner.delete({ where: { id } });
  }
}
