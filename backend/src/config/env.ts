import dotenv from "dotenv";
dotenv.config();

const isProd = process.env.NODE_ENV === "production" || process.env.RENDER === "true";

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "shoilpikkabbo_jwt_secret_default",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  FRONTEND_URL: process.env.FRONTEND_URL || (isProd ? "https://shoilpikkabbo.vercel.app" : "http://localhost:3000"),
  BACKEND_BASE_URL: process.env.BACKEND_BASE_URL || (isProd ? "https://shoilpikkabbo.onrender.com" : "http://localhost:5000"),
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
  SSLCOMMERZ_STORE_ID: process.env.SSLCOMMERZ_STORE_ID || "testbox",
  SSLCOMMERZ_STORE_PASS: process.env.SSLCOMMERZ_STORE_PASS || "qwerty",
  SSLCOMMERZ_IS_SANDBOX: process.env.SSLCOMMERZ_IS_SANDBOX !== "false",
};

