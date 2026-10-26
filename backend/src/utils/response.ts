import { Response } from "express";

interface ResponseData<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export function sendResponse<T>(res: Response, data: ResponseData<T>) {
  return res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    meta: data.meta,
  });
}
