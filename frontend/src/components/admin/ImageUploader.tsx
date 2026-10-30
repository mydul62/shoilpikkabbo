"use client";

import * as React from "react";
import Image from "next/image";
import {
  UploadCloud,
  X,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Plus,
  Link as LinkIcon,
  Sparkles,
  Star,
} from "lucide-react";
import { uploadApi } from "@/lib/api";

interface ImageUploaderProps {
  label?: string;
  helperText?: string;
  value?: string | string[];
  onChange: (value: any) => void;
  folder?: string;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
  aspectRatio?: "square" | "video" | "banner" | "auto";
}

export function ImageUploader({
  label,
  helperText = "Supports JPG, PNG, WEBP, SVG (Max 10MB)",
  value,
  onChange,
  folder = "general",
  multiple = false,
  maxFiles = 8,
  className = "",
  aspectRatio = "auto",
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = React.useState<string | null>(null);
  const [manualMode, setManualMode] = React.useState(false);
  const [manualUrl, setManualUrl] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Normalize value to array for multi or string for single
  const imageList: string[] = React.useMemo(() => {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean);
    return [value];
  }, [value]);

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (fileArray.length === 0) {
      setUploadError("Please select valid image files (JPG, PNG, WEBP, SVG).");
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      setUploadSuccess(null);

      if (multiple) {
        const remainingSlots = maxFiles - imageList.length;
        if (remainingSlots <= 0) {
          setUploadError(`Maximum limit of ${maxFiles} images reached.`);
          return;
        }

        const filesToUpload = fileArray.slice(0, remainingSlots);
        const res = await uploadApi.uploadMultiple(filesToUpload, folder);

        if (res.success && Array.isArray(res.data)) {
          const newUrls = res.data.map((item: any) => item.url);
          const combined = [...imageList, ...newUrls];
          onChange(combined);
          setUploadSuccess(`${newUrls.length} image(s) uploaded to Cloudinary successfully!`);
        } else {
          setUploadError(res.message || "Failed to upload images.");
        }
      } else {
        const fileToUpload = fileArray[0];
        const res = await uploadApi.uploadSingle(fileToUpload, folder);

        if (res.success && res.data?.url) {
          onChange(res.data.url);
          setUploadSuccess("Image uploaded to Cloudinary successfully!");
        } else {
          setUploadError(res.message || "Failed to upload image.");
        }
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError(err?.message || "Network error while uploading to Cloudinary.");
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadSuccess(null), 3000);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveSingle = () => {
    onChange("");
    setUploadSuccess(null);
  };

  const handleRemoveItem = (indexToRemove: number) => {
    const updated = imageList.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const handleSetAsCover = (index: number) => {
    if (index <= 0 || index >= imageList.length) return;
    const target = imageList[index];
    const remaining = imageList.filter((_, idx) => idx !== index);
    const updated = [target, ...remaining];
    onChange(updated);
    setUploadSuccess("Set as primary cover image!");
    setTimeout(() => setUploadSuccess(null), 2500);
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;

    if (multiple) {
      onChange([...imageList, manualUrl.trim()]);
    } else {
      onChange(manualUrl.trim());
    }
    setManualUrl("");
    setManualMode(false);
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square";
      case "video":
        return "aspect-video";
      case "banner":
        return "aspect-[16/7]";
      default:
        return "h-40 sm:h-44";
    }
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Label & Header */}
      <div className="flex items-center justify-between">
        {label && (
          <label className="block text-xs font-bold text-gray-700 tracking-wide">
            {label}
          </label>
        )}
        <div className="flex items-center gap-2">
          {/* Cloudinary Badge */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[10px] font-semibold text-emerald-800">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Cloudinary</span>
          </span>

          {/* Toggle manual URL mode */}
          <button
            type="button"
            onClick={() => setManualMode(!manualMode)}
            className="text-[11px] font-medium text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{manualMode ? "Upload File" : "Paste URL"}</span>
          </button>
        </div>
      </div>

      {/* Manual URL Input Mode */}
      {manualMode ? (
        <form onSubmit={handleManualAdd} className="flex items-center gap-2">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0D3B37] bg-white"
          />
          <button
            type="submit"
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#0D3B37] text-white hover:bg-emerald-900 transition-colors cursor-pointer shrink-0"
          >
            Add URL
          </button>
        </form>
      ) : (
        /* Drag and Drop Zone */
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFiles(e.target.files);
              }
            }}
          />

          {/* Single Image Mode Preview & Dropzone */}
          {!multiple && imageList.length > 0 ? (
            <div className="relative group rounded-2xl overflow-hidden border border-gray-200 bg-[#FAF8F5] shadow-xs">
              <div className={`relative w-full ${getAspectRatioClass()} max-h-56`}>
                <Image
                  src={imageList[0]}
                  alt="Uploaded preview"
                  fill
                  className="object-contain p-2"
                  unoptimized={imageList[0].startsWith("data:")}
                />
              </div>

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-gray-800 text-xs font-bold transition-transform hover:scale-105 cursor-pointer shadow-md"
                >
                  Change Image
                </button>
                <button
                  type="button"
                  onClick={handleRemoveSingle}
                  className="p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-transform hover:scale-105 cursor-pointer shadow-md"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom URL chip */}
              <div className="px-3 py-1.5 bg-white/90 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500 font-mono">
                <span className="truncate max-w-[85%]">{imageList[0]}</span>
                <span className="text-emerald-700 font-sans font-semibold">Active</span>
              </div>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-5 sm:p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                isDragging
                  ? "border-emerald-600 bg-emerald-50/60 scale-[1.01]"
                  : "border-gray-300 hover:border-[#0D3B37] bg-white hover:bg-[#FAF8F5]"
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-2 py-3">
                  <Loader2 className="w-8 h-8 animate-spin text-[#0D3B37]" />
                  <p className="text-xs font-bold text-gray-700">
                    Uploading to Cloudinary...
                  </p>
                  <p className="text-[10px] text-gray-400">Optimizing & generating secure URL</p>
                </div>
              ) : (
                <>
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shadow-2xs">
                    <UploadCloud className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-gray-800">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{helperText}</p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Multiple Images Gallery Grid */}
          {multiple && imageList.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Gallery Images ({imageList.length}/{maxFiles})</span>
                {imageList.length < maxFiles && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add More</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {imageList.map((url, idx) => (
                  <div
                    key={`${url}-${idx}`}
                    className={`group relative aspect-square rounded-2xl overflow-hidden border transition-all ${
                      idx === 0
                        ? "border-[#0D3B37] ring-2 ring-[#0D3B37]/30 bg-emerald-50/20"
                        : "border-gray-200 bg-[#FAF8F5] hover:border-gray-400"
                    } shadow-xs`}
                  >
                    <Image
                      src={url}
                      alt={`Gallery item ${idx + 1}`}
                      fill
                      className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                      unoptimized={url.startsWith("data:")}
                    />

                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <div className="flex items-center justify-between">
                        {idx !== 0 ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetAsCover(idx);
                            }}
                            className="px-2 py-1 rounded-md bg-white/95 hover:bg-white text-gray-900 text-[10px] font-bold flex items-center gap-1 shadow-xs cursor-pointer hover:scale-105 transition-transform"
                            title="Make this photo the main cover"
                          >
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span>Set Cover</span>
                          </button>
                        ) : (
                          <div />
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveItem(idx);
                          }}
                          className="p-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-xs hover:scale-110 transition-transform"
                          title="Remove image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {idx === 0 && (
                        <div className="text-[10px] font-bold text-white flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span>Cover Photo</span>
                        </div>
                      )}
                    </div>

                    {/* Primary Badge always visible */}
                    {idx === 0 && (
                      <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-[#0D3B37] text-white text-[10px] font-bold shadow-xs flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                        <span>Cover</span>
                      </span>
                    )}
                  </div>
                ))}

                {imageList.length < maxFiles && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#0D3B37] flex flex-col items-center justify-center text-gray-500 hover:text-[#0D3B37] transition-all cursor-pointer bg-white hover:bg-emerald-50/30 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-emerald-100 flex items-center justify-center mb-1 text-gray-600 group-hover:text-[#0D3B37] transition-colors">
                      <Plus className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold">Add Photo</span>
                    <span className="text-[10px] text-gray-400">Upload more</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Success / Error Notifications */}
      {uploadSuccess && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/80 animate-in fade-in duration-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {uploadError && (
        <div className="flex items-center gap-1.5 text-xs text-red-800 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200/80 animate-in fade-in duration-200">
          <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
}
