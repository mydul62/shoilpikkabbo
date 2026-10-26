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

  static async getBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { displayOrder: "asc" } },
      },
    });
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
    specifications?: Record<string, string>;
  }) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

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
        images: data.imageUrl
          ? {
              create: [
                {
                  url: data.imageUrl,
                  isPrimary: true,
                  displayOrder: 0,
                },
              ],
            }
          : undefined,
      },
      include: {
        category: true,
        images: true,
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
  }>) {
    return prisma.product.update({
      where: { id },
      data,
      include: { category: true, images: true },
    });
  }

  static async delete(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }
}
