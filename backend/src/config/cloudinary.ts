import { v2 as cloudinary } from "cloudinary";
import { ENV } from "./env";

const cleanStr = (val?: string) => (val || "").replace(/^["']|["']$/g, "").trim();

export const cloudName = cleanStr(ENV.CLOUDINARY_CLOUD_NAME);
export const apiKey = cleanStr(ENV.CLOUDINARY_API_KEY);
export const apiSecret = cleanStr(ENV.CLOUDINARY_API_SECRET);

export function isCloudinaryConfigured(): boolean {
  return Boolean(cloudName && apiKey && apiSecret);
}

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  console.log("✓ Cloudinary initialized with cloud:", cloudName);
} else {
  console.log("ℹ Cloudinary credentials not configured; local storage fallback active.");
}

export { cloudinary };
