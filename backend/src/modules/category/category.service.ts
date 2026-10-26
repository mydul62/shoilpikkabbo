import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/apiError";

export class CategoryService {
  static async getAll() {
    return prisma.category.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  static async getBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true },
          include: { images: true },
        },
      },
    });
    if (!category) {
      throw new ApiError(404, "Category not found.");
    }
    return category;
  }

  static async create(data: {
    name: string;
    slug?: string;
    description?: string;
    imageUrl?: string;
    displayOrder?: number;
  }) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        imageUrl: data.imageUrl,
        displayOrder: data.displayOrder ?? 0,
      },
    });
  }

  static async update(id: string, data: Partial<{
    name: string;
    slug: string;
    description: string;
    displayOrder: number;
    isActive: boolean;
  }>) {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return prisma.category.delete({
      where: { id },
    });
  }
}
