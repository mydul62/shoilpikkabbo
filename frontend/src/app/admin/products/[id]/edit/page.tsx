"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { productsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function EditProductAdminPage() {
  const params = useParams();
  const id = params?.id as string;
  const [product, setProduct] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const res = await productsApi.getById(id);
        if (res.success && res.data) {
          setProduct(res.data);
        } else {
          setError(res.message || "Failed to load product details.");
        }
      } catch (err: any) {
        console.error("Error loading product:", err);
        setError(err?.message || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  return (
    <AdminLayoutShell>
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#0D3B37] animate-spin" />
          <p className="text-xs font-bold text-gray-500">Loading catalog product...</p>
        </div>
      ) : error || !product ? (
        <div className="p-12 text-center max-w-md mx-auto bg-white rounded-3xl border border-rose-200 space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
          <h3 className="font-extrabold text-base text-gray-900">
            {error || "Product Not Found"}
          </h3>
          <p className="text-xs text-gray-500">
            The requested product could not be found or has been removed.
          </p>
          <Link href="/admin/products">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Products
            </Button>
          </Link>
        </div>
      ) : (
        <ProductForm initialProduct={product} isEdit={true} />
      )}
    </AdminLayoutShell>
  );
}
