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

  static async delete(id: string, options: { force?: boolean; reassignTo?: string } = {}) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new ApiError(404, "Category not found.");
    }

    const productCount = category._count.products;

    if (productCount > 0) {
      // 1. Reassign to a specific chosen category
      if (options.reassignTo) {
        if (options.reassignTo === id) {
          throw new ApiError(400, "Cannot reassign products to the category being deleted.");
        }
        const targetCat = await prisma.category.findUnique({ where: { id: options.reassignTo } });
        if (!targetCat) {
          throw new ApiError(404, "Target category to reassign products does not exist.");
        }
        await prisma.$transaction([
          prisma.product.updateMany({
            where: { categoryId: id },
            data: { categoryId: options.reassignTo },
          }),
          prisma.category.delete({ where: { id } }),
        ]);
        return { reallocated: productCount, targetName: targetCat.name };
      }

      // 2. Force delete: safely reassign to an "Uncategorized" category so products and orders stay intact
      if (options.force) {
        let fallbackCat = await prisma.category.findFirst({
          where: { slug: "uncategorized" },
        });
        if (!fallbackCat) {
          fallbackCat = await prisma.category.create({
            data: {
              name: "Uncategorized / অন্যান্য",
              slug: "uncategorized",
              description: "Default fallback category for archived or uncategorized products.",
              imageUrl: "/images/client-mockup/cat-handicrafts.png",
              displayOrder: 999,
            },
          });
        }

        await prisma.$transaction([
          prisma.product.updateMany({
            where: { categoryId: id },
            data: { categoryId: fallbackCat.id },
          }),
          prisma.category.delete({ where: { id } }),
        ]);
        return { reallocated: productCount, targetName: fallbackCat.name };
      }

      throw new ApiError(
        400,
        `Cannot delete category "${category.name}" because it contains ${productCount} active product(s). Please choose another category to move the products to, or confirm force delete.`
      );
    }

    return prisma.category.delete({
      where: { id },
    });
  }

  static async batchDelete(ids: string[], options: { force?: boolean; reassignTo?: string } = {}) {
    if (!Array.isArray(ids) || ids.length === 0) {
      return { deletedCount: 0, reallocatedCount: 0 };
    }

    const cats = await prisma.category.findMany({
      where: { id: { in: ids } },
      include: { _count: { select: { products: true } } },
    });

    let reallocatedCount = 0;
    let fallbackCatId = options.reassignTo;
    const totalProducts = cats.reduce((sum, c) => sum + c._count.products, 0);

    if (totalProducts > 0) {
      if (!fallbackCatId) {
        let fallbackCat = await prisma.category.findFirst({
          where: { slug: "uncategorized", NOT: { id: { in: ids } } },
        });
        if (!fallbackCat) {
          fallbackCat = await prisma.category.create({
            data: {
              name: "Uncategorized / অন্যান্য",
              slug: "uncategorized",
              description: "Default fallback category for archived or uncategorized products.",
              imageUrl: "/images/client-mockup/cat-handicrafts.png",
              displayOrder: 999,
            },
          });
        }
        fallbackCatId = fallbackCat.id;
      }

      await prisma.product.updateMany({
        where: { categoryId: { in: ids } },
        data: { categoryId: fallbackCatId },
      });
      reallocatedCount = totalProducts;
    }

    const deleteResult = await prisma.category.deleteMany({
      where: { id: { in: ids } },
    });

    return {
      deletedCount: deleteResult.count,
      reallocatedCount,
    };
  }
}
