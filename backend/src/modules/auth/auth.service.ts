import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma";
import { ENV } from "../../config/env";
import { ApiError } from "../../utils/apiError";
import { Role } from "@prisma/client";

export class AuthService {
  static async register(data: {
    name: string;
    phone: string;
    email?: string;
    password: string;
  }) {
    const existing = await prisma.user.findUnique({
      where: { phone: data.phone },
    });
    if (existing) {
      throw new ApiError(409, "User with this phone number already exists.");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        passwordHash,
        role: Role.CUSTOMER,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const token = jwt.sign(
      { userId: user.id, role: user.role, phone: user.phone },
      ENV.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return { user, token };
  }

  static async login(data: { phone: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: { phone: data.phone },
    });
    if (!user) {
      throw new ApiError(401, "Invalid phone number or password.");
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new ApiError(401, "Invalid phone number or password.");
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, phone: user.phone },
      ENV.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new ApiError(404, "User not found.");
    }
    return user;
  }
}
