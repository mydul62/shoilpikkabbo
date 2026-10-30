"use client";

import * as React from "react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductAdminPage() {
  return (
    <AdminLayoutShell>
      <ProductForm isEdit={false} />
    </AdminLayoutShell>
  );
}
