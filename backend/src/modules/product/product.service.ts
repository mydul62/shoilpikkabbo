import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/apiError";
import { Prisma } from "@prisma/client";

export class ProductService {
  static async getAll(query: {
    page?: number;
    limit?: number;
    categorySlug?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: "newest" | "price-asc" | "price-desc";
    inStockOnly?: boolean;
  }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 20);
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    if (query.categorySlug && query.categorySlug !== "all") {
      where.category = { slug: query.categorySlug };
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
        { sku: { contains: query.search, mode: "insensitive" } },
      ];
    }

    if (query.minPrice || query.maxPrice) {
      where.price = {};
      if (query.minPrice) where.price.gte = query.minPrice;
      if (query.maxPrice) where.price.lte = query.maxPrice;
    }

    if (query.inStockOnly) {
      where.stock = { gt: 0 };
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      query.sortBy === "price-asc"
        ? { price: "asc" }
        : query.sortBy === "price-desc"
        ? { price: "desc" }
        : { createdAt: "desc" };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { displayOrder: "asc" } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getBySlug(slugOrId: string) {
    let product = await prisma.product.findUnique({
      where: { slug: slugOrId },
      include: {
        category: true,
        images: { orderBy: { displayOrder: "asc" } },
      },
    });

    if (!product) {
      product = await prisma.product.findUnique({
        where: { id: slugOrId },
        include: {
          category: true,
          images: { orderBy: { displayOrder: "asc" } },
        },
      });
    }

    if (!product) {
      throw new ApiError(404, "Product not found.");
    }
    return product;
  }

  static async create(data: {
    categoryId: string;
    name: string;
    slug?: string;
    description: string;
    price: number;
    salePrice?: number;
    stock?: number;
    sku?: string;
    isFeatured?: boolean;
    imageUrl?: string;
    images?: string[];
    specifications?: Record<string, string>;
  }) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const allImages = data.images && data.images.length > 0 
      ? data.images 
      : data.imageUrl ? [data.imageUrl] : [];

    return prisma.product.create({
      data: {
        categoryId: data.categoryId,
        name: data.name,
        slug,
        description: data.description,
        price: data.price,
        salePrice: data.salePrice,
        stock: data.stock ?? 10,
        sku: data.sku,
        isFeatured: data.isFeatured ?? false,
        specifications: data.specifications,
        images: allImages.length > 0
          ? {
              create: allImages.map((url, index) => ({
                url,
                isPrimary: index === 0,
                displayOrder: index,
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        images: { orderBy: { displayOrder: "asc" } },
      },
    });
  }

  static async update(id: string, data: Partial<{
    name: string;
    description: string;
    price: number;
    salePrice: number;
    stock: number;
    sku: string;
    isFeatured: boolean;
    isActive: boolean;
    categoryId: string;
    specifications?: Record<string, any>;
    imageUrl?: string;
    images?: string[];
  }>) {
    const { imageUrl, images, ...rest } = data;

    await prisma.product.update({
      where: { id },
      data: rest,
    });

    if (images && Array.isArray(images) && images.length > 0) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      await prisma.productImage.createMany({
        data: images.map((url, index) => ({
          productId: id,
          url,
          isPrimary: index === 0,
          displayOrder: index,
        })),
      });
    } else if (imageUrl) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      await prisma.productImage.create({
        data: {
          productId: id,
          url: imageUrl,
          isPrimary: true,
          displayOrder: 0,
        },
      });
    }

    return prisma.product.findUnique({
      where: { id },
      include: { category: true, images: { orderBy: { displayOrder: "asc" } } },
    });
  }

  static async delete(id: string) {
    const orderItemCount = await prisma.orderItem.count({ where: { productId: id } });
    if (orderItemCount > 0) {
      return prisma.product.update({
        where: { id },
        data: { isActive: false },
      });
    }
    return prisma.product.delete({
      where: { id },
    });
  }

  static async batchDelete(ids: string[]) {
    if (!Array.isArray(ids) || ids.length === 0) {
      return { deletedCount: 0, archivedCount: 0, totalAffected: 0 };
    }

    const orderItems = await prisma.orderItem.findMany({
      where: { productId: { in: ids } },
      select: { productId: true },
    });
    const restrictedIds = new Set(orderItems.map((o) => o.productId));
    const deletableIds = ids.filter((id) => !restrictedIds.has(id));
    const archivedIds = ids.filter((id) => restrictedIds.has(id));

    if (archivedIds.length > 0) {
      await prisma.product.updateMany({
        where: { id: { in: archivedIds } },
        data: { isActive: false },
      });
    }

    let deletedCount = 0;
    if (deletableIds.length > 0) {
      const result = await prisma.product.deleteMany({
        where: { id: { in: deletableIds } },
      });
      deletedCount = result.count;
    }

    return {
      deletedCount,
      archivedCount: archivedIds.length,
      totalAffected: ids.length,
    };
  }

  static async batchStatus(ids: string[], isActive: boolean) {
    if (!Array.isArray(ids) || ids.length === 0) {
      return { count: 0 };
    }
    const res = await prisma.product.updateMany({
      where: { id: { in: ids } },
      data: { isActive },
    });
    return { count: res.count };
  }

  static async batchFeatured(ids: string[], isFeatured: boolean) {
    if (!Array.isArray(ids) || ids.length === 0) {
      return { count: 0 };
    }
    const res = await prisma.product.updateMany({
      where: { id: { in: ids } },
      data: { isFeatured },
    });
    return { count: res.count };
  }
}

