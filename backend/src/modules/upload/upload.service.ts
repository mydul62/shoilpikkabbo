import { cloudinary, isCloudinaryConfigured } from "../../config/cloudinary";
import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { ENV } from "../../config/env";

export interface UploadResult {
  url: string;
  publicId?: string;
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
  originalName: string;
  storage: "cloudinary" | "local";
}

export class UploadService {
  /**
   * Upload a single in-memory multer file to Cloudinary or fallback to local storage
   */
  static async uploadFile(
    file: Express.Multer.File,
    folder: string = "shoilpikkabbo"
  ): Promise<UploadResult> {
    if (!file || !file.buffer) {
      throw new Error("No file buffer provided for upload.");
    }

    // 1. If Cloudinary credentials exist, upload to Cloudinary
    if (isCloudinaryConfigured()) {
      const baseFolder = (process.env.CLOUDINARY_FOLDER || "shoilpikkabbo").replace(/^["']|["']$/g, "").trim();
      return new Promise<UploadResult>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `${baseFolder}/${folder}`,
            resource_type: "auto",
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              return reject(new Error(error.message || "Cloudinary upload failed"));
            }
            if (!result) {
              return reject(new Error("Cloudinary upload returned empty response"));
            }

            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              format: result.format,
              bytes: result.bytes,
              width: result.width,
              height: result.height,
              originalName: file.originalname,
              storage: "cloudinary",
            });
          }
        );

        const bufferStream = Readable.from(file.buffer);
        bufferStream.pipe(uploadStream);
      });
    }

    // 2. Fallback to local uploads directory
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(safeName) || ".png";
    const baseName = path.basename(safeName, ext);
    const fileName = `${baseName}-${uniqueSuffix}${ext}`;
    const filePath = path.join(uploadsDir, fileName);

    await fs.promises.writeFile(filePath, file.buffer);

    const baseUrl =
      process.env.BACKEND_PUBLIC_URL ||
      `http://localhost:${ENV.PORT}`;
    const publicUrl = `${baseUrl}/uploads/${fileName}`;

    return {
      url: publicUrl,
      publicId: fileName,
      format: ext.replace(".", ""),
      bytes: file.size,
      originalName: file.originalname,
      storage: "local",
    };
  }

  /**
   * Upload multiple files in parallel
   */
  static async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder: string = "shoilpikkabbo"
  ): Promise<UploadResult[]> {
    return Promise.all(files.map((f) => this.uploadFile(f, folder)));
  }

  /**
   * Delete an image by its Cloudinary publicId
   */
  static async deleteFile(publicId: string): Promise<boolean> {
    if (isCloudinaryConfigured()) {
      const res = await cloudinary.uploader.destroy(publicId);
      return res.result === "ok";
    }

    const localPath = path.join(process.cwd(), "public", "uploads", publicId);
    if (fs.existsSync(localPath)) {
      await fs.promises.unlink(localPath);
      return true;
    }

    return false;
  }
}
