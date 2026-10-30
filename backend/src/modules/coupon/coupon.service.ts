import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/apiError";

export class CouponService {
  static async validateCoupon(code: string, subtotal: number) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      throw new ApiError(404, "Invalid or inactive promo code.");
    }

    if (new Date() > coupon.endDate) {
      throw new ApiError(400, "This coupon has expired.");
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      throw new ApiError(400, "Coupon usage limit has been exceeded.");
    }

    if (subtotal < Number(coupon.minOrderAmount)) {
      throw new ApiError(
        400,
        `Coupon requires a minimum order subtotal of ৳${coupon.minOrderAmount}.`
      );
    }

    const discountAmount = Math.round(
      (subtotal * Number(coupon.discountValue)) / 100
    );

    return {
      code: coupon.code,
      discountPercentage: Number(coupon.discountValue),
      discountAmount,
    };
  }

  static async getAll() {
    return prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async getPublic() {
    return prisma.coupon.findMany({
      where: {
        isActive: true,
        endDate: { gte: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async create(data: {
    code: string;
    discountValue: number;
    minOrderAmount?: number;
    endDate: Date;
    usageLimit?: number;
  }) {
    return prisma.coupon.create({
      data: {
        code: data.code.trim().toUpperCase(),
        discountValue: data.discountValue,
        minOrderAmount: data.minOrderAmount ?? 0,
        endDate: data.endDate,
        usageLimit: data.usageLimit,
      },
    });
  }

  static async delete(id: string) {
    return prisma.coupon.delete({ where: { id } });
  }
}
