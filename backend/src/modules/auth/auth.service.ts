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
    const existingPhone = await prisma.user.findUnique({
      where: { phone: data.phone.trim() },
    });
    if (existingPhone) {
      throw new ApiError(409, "An account with this phone number already exists.");
    }

    const cleanEmail = data.email && data.email.trim() ? data.email.trim() : null;
    if (cleanEmail) {
      const existingEmail = await prisma.user.findFirst({
        where: { email: { equals: cleanEmail, mode: "insensitive" } },
      });
      if (existingEmail) {
        throw new ApiError(409, "An account with this email address already exists.");
      }
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: cleanEmail,
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

  static async login(data: {
    phone?: string;
    email?: string;
    emailOrPhone?: string;
    identifier?: string;
    password: string;
  }) {
    const identifier = (data.identifier || data.emailOrPhone || data.email || data.phone || "").trim();
    if (!identifier) {
      throw new ApiError(400, "Please provide your email address or phone number.");
    }

    const isEmail = identifier.includes("@");
    const user = await prisma.user.findFirst({
      where: isEmail
        ? { email: { equals: identifier, mode: "insensitive" } }
        : { phone: identifier },
    });

    if (!user) {
      throw new ApiError(401, "Invalid email/phone or password.");
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new ApiError(401, "Invalid email/phone or password.");
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
