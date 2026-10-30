import { Router, Request } from "express";
import multer from "multer";
import { UploadController } from "./upload.controller";
import { ApiError } from "../../utils/apiError";

const storage = multer.memoryStorage();

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/svg+xml",
    "image/gif",
    "image/avif",
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, "Invalid file format. Please upload JPG, PNG, WEBP, SVG, GIF, or AVIF image."));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per image
  fileFilter,
});

const router = Router();

// Single file upload (accepts field 'file' or 'image')
router.post(
  "/",
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        // Fallback to checking 'image' field
        upload.single("image")(req, res, (err2) => {
          if (err2) return next(err2);
          next();
        });
      } else {
        next();
      }
    });
  },
  UploadController.uploadSingle
);

// Multiple files upload (accepts field 'files' or 'images', up to 10 files)
router.post(
  "/multiple",
  (req, res, next) => {
    upload.array("files", 10)(req, res, (err) => {
      if (err) {
        upload.array("images", 10)(req, res, (err2) => {
          if (err2) return next(err2);
          next();
        });
      } else {
        next();
      }
    });
  },
  UploadController.uploadMultiple
);

// Delete an uploaded file
router.delete("/:publicId", UploadController.deleteFile);
router.delete("/", UploadController.deleteFile);

export const uploadRoutes = router;
