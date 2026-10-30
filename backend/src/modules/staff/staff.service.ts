import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/apiError";
import { Role } from "@prisma/client";

export class StaffService {
  static async getAll() {
    return prisma.user.findMany({
      where: {
        role: { in: [Role.ADMIN, Role.STAFF] },
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });
  }

  static async create(data: {
    name: string;
    phone: string;
    email?: string;
    role: "ADMIN" | "STAFF";
    password: string;
  }) {
    if (!data.name || !data.phone || !data.password) {
      throw new ApiError(400, "Name, phone number and initial password are required.");
    }

    if (data.password.length < 6) {
      throw new ApiError(400, "Password must be at least 6 characters long.");
    }

    const cleanPhone = data.phone.trim();
    const existingPhone = await prisma.user.findUnique({
      where: { phone: cleanPhone },
    });
    if (existingPhone) {
      throw new ApiError(409, "A user with this phone number already exists.");
    }

    const cleanEmail = data.email && data.email.trim() ? data.email.trim() : null;
    if (cleanEmail) {
      const existingEmail = await prisma.user.findFirst({
        where: { email: { equals: cleanEmail, mode: "insensitive" } },
      });
      if (existingEmail) {
        throw new ApiError(409, "A user with this email address already exists.");
      }
    }

    const targetRole = data.role === "ADMIN" ? Role.ADMIN : Role.STAFF;
    const passwordHash = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
      data: {
        name: data.name.trim(),
        phone: cleanPhone,
        email: cleanEmail,
        passwordHash,
        role: targetRole,
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
  }

  static async updateRole(id: string, role: "ADMIN" | "STAFF", currentAdminId: string) {
    if (id === currentAdminId) {
      throw new ApiError(400, "You cannot alter your own admin privileges.");
    }

    const targetRole = role === "ADMIN" ? Role.ADMIN : Role.STAFF;
    return prisma.user.update({
      where: { id },
      data: { role: targetRole },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  static async resetPassword(id: string, newPassword: string) {
    if (!newPassword || newPassword.length < 6) {
      throw new ApiError(400, "New password must be at least 6 characters long.");
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id },
      data: { passwordHash },
    });

    return { message: "Password reset successfully." };
  }

  static async delete(id: string, currentAdminId: string) {
    if (id === currentAdminId) {
      throw new ApiError(400, "You cannot delete your own account.");
    }

    // Check if user is the last remaining ADMIN
    const userToDelete = await prisma.user.findUnique({ where: { id } });
    if (!userToDelete) {
      throw new ApiError(404, "Team member not found.");
    }

    if (userToDelete.role === Role.ADMIN) {
      const adminCount = await prisma.user.count({
        where: { role: Role.ADMIN },
      });
      if (adminCount <= 1) {
        throw new ApiError(400, "Cannot remove the only remaining system administrator.");
      }
    }

    return prisma.user.delete({ where: { id } });
  }
}

