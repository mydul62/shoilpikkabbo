const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface FetchOptions extends RequestInit {
  token?: string;
}

export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<{ success: boolean; data?: T; message?: string; error?: any; meta?: any }> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    const authToken =
      options.token ||
      (typeof window !== "undefined"
        ? sessionStorage.getItem("shoilpikkabbo_auth_token") || localStorage.getItem("shoilpikkabbo_auth_token")
        : null);

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      credentials: "include", // Include secure HTTP-only cookies
      ...options,
      headers,
    });

    const data = await res.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: "Network or API connection error",
      error,
    };
  }
}

// 1. Auth API
export const authApi = {
  register: (body: any) =>
    apiFetch("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body: any) =>
    apiFetch("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  logout: () =>
    apiFetch("/auth/logout", { method: "POST" }),
  getMe: (token?: string) => apiFetch("/auth/me", { token }),
  updateProfile: (body: { name?: string; phone?: string; email?: string }, token?: string) =>
    apiFetch("/auth/profile", { method: "PATCH", body: JSON.stringify(body), token }),
  changePassword: (body: { currentPassword: string; newPassword: string }, token?: string) =>
    apiFetch("/auth/change-password", { method: "POST", body: JSON.stringify(body), token }),
};

// 2. Categories API
export const categoriesApi = {
  getAll: () => apiFetch("/categories"),
  getBySlug: (slug: string) => apiFetch(`/categories/${slug}`),
  create: (body: any, token?: string) =>
    apiFetch("/categories", { method: "POST", body: JSON.stringify(body), token }),
  update: (id: string, body: any, token?: string) =>
    apiFetch(`/categories/${id}`, { method: "PATCH", body: JSON.stringify(body), token }),
  delete: (id: string, options?: { force?: boolean; reassignTo?: string }, token?: string) => {
    const params = new URLSearchParams();
    if (options?.force) params.append("force", "true");
    if (options?.reassignTo) params.append("reassignTo", options.reassignTo);
    const qs = params.toString() ? `?${params.toString()}` : "";
    return apiFetch(`/categories/${id}${qs}`, { method: "DELETE", token });
  },
  batchDelete: (
    ids: string[],
    options?: { force?: boolean; reassignTo?: string },
    token?: string
  ) =>
    apiFetch("/categories/batch-delete", {
      method: "POST",
      body: JSON.stringify({ ids, ...options }),
      token,
    }),
};

// 3. Products API
export const productsApi = {
  getAll: (params?: Record<string, any>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiFetch(`/products${qs}`);
  },
  getBySlug: (slug: string) => apiFetch(`/products/${slug}`),
  getById: (id: string) => apiFetch(`/products/${id}`),
  create: (body: any, token?: string) =>
    apiFetch("/products", { method: "POST", body: JSON.stringify(body), token }),
  update: (id: string, body: any, token?: string) =>
    apiFetch(`/products/${id}`, { method: "PATCH", body: JSON.stringify(body), token }),
  delete: (id: string, token?: string) =>
    apiFetch(`/products/${id}`, { method: "DELETE", token }),
  batchDelete: (ids: string[], token?: string) =>
    apiFetch("/products/batch-delete", {
      method: "POST",
      body: JSON.stringify({ ids }),
      token,
    }),
  batchStatus: (ids: string[], isActive: boolean, token?: string) =>
    apiFetch("/products/batch-status", {
      method: "POST",
      body: JSON.stringify({ ids, isActive }),
      token,
    }),
  batchFeatured: (ids: string[], isFeatured: boolean, token?: string) =>
    apiFetch("/products/batch-featured", {
      method: "POST",
      body: JSON.stringify({ ids, isFeatured }),
      token,
    }),
};

// 4. Orders API
export const ordersApi = {
  create: (body: any) =>
    apiFetch("/orders", { method: "POST", body: JSON.stringify(body) }),
  track: (orderNumber: string, phone?: string) => {
    const qs = phone ? `?phone=${encodeURIComponent(phone)}` : "";
    return apiFetch(`/orders/track/${orderNumber}${qs}`);
  },
  getAll: (tokenOrParams?: string | Record<string, any>, params?: Record<string, any>) => {
    let token: string | undefined;
    let query: Record<string, any> | undefined;
    if (typeof tokenOrParams === "string") {
      token = tokenOrParams;
      query = params;
    } else {
      query = tokenOrParams;
    }
    const qs = query ? `?${new URLSearchParams(query).toString()}` : "";
    return apiFetch(`/orders${qs}`, { token });
  },
  getById: (id: string, token?: string) =>
    apiFetch(`/orders/${id}`, { token }),
  updateStatus: (id: string, status: string, token?: string, note?: string, location?: string) =>
    apiFetch(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, note, location }),
      token,
    }),
  updatePayment: (id: string, paymentStatus: string, notes?: string, token?: string) =>
    apiFetch(`/orders/${id}/payment`, {
      method: "PATCH",
      body: JSON.stringify({ paymentStatus, notes }),
      token,
    }),
  addTracking: (
    id: string,
    event: { status: string; description: string; location?: string },
    token?: string
  ) =>
    apiFetch(`/orders/${id}/tracking`, {
      method: "POST",
      body: JSON.stringify(event),
      token,
    }),
  batchStatus: (ids: string[], status: string, note?: string, token?: string) =>
    apiFetch("/orders/batch-status", {
      method: "POST",
      body: JSON.stringify({ ids, status, note }),
      token,
    }),
  batchPaymentStatus: (ids: string[], paymentStatus: string, notes?: string, token?: string) =>
    apiFetch("/orders/batch-payment-status", {
      method: "POST",
      body: JSON.stringify({ ids, paymentStatus, notes }),
      token,
    }),
  delete: (id: string, token?: string) =>
    apiFetch(`/orders/${id}`, { method: "DELETE", token }),
  batchDelete: (ids: string[], token?: string) =>
    apiFetch("/orders/batch-delete", {
      method: "POST",
      body: JSON.stringify({ ids }),
      token,
    }),
};

// 5. Payments API
export const paymentsApi = {
  getAll: (tokenOrParams?: string | Record<string, any>, params?: Record<string, any>) => {
    let token: string | undefined;
    let query: Record<string, any> | undefined;
    if (typeof tokenOrParams === "string") {
      token = tokenOrParams;
      query = params;
    } else {
      query = tokenOrParams;
    }
    const qs = query ? `?${new URLSearchParams(query).toString()}` : "";
    return apiFetch(`/payments${qs}`, { token });
  },
  verify: (id: string, decision: "VERIFIED" | "REJECTED", notes?: string, token?: string) =>
    apiFetch(`/payments/${id}/verify`, {
      method: "PATCH",
      body: JSON.stringify({ decision, notes }),
      token,
    }),
  batchVerify: (
    ids: string[],
    decision: "VERIFIED" | "REJECTED",
    notes?: string,
    token?: string
  ) =>
    apiFetch("/payments/batch-verify", {
      method: "POST",
      body: JSON.stringify({ ids, decision, notes }),
      token,
    }),
  delete: (id: string, token?: string) =>
    apiFetch(`/payments/${id}`, { method: "DELETE", token }),
  batchDelete: (ids: string[], token?: string) =>
    apiFetch("/payments/batch-delete", {
      method: "POST",
      body: JSON.stringify({ ids }),
      token,
    }),
};

// 6. Coupons API
export const couponsApi = {
  getPublic: () => apiFetch<any[]>("/coupons/public"),
  validate: (code: string, subtotal: number) =>
    apiFetch("/coupons/validate", {
      method: "POST",
      body: JSON.stringify({ code, subtotal }),
    }),
  getAll: (token?: string) => apiFetch("/coupons", { token }),
  create: (body: any, token?: string) =>
    apiFetch("/coupons", { method: "POST", body: JSON.stringify(body), token }),
  update: (id: string, body: any, token?: string) =>
    apiFetch(`/coupons/${id}`, { method: "PATCH", body: JSON.stringify(body), token }),
  delete: (id: string, token?: string) =>
    apiFetch(`/coupons/${id}`, { method: "DELETE", token }),
};

// 7. Special E-Sheba Inquiries API
export const inquiriesApi = {
  create: (body: any) =>
    apiFetch("/inquiries", { method: "POST", body: JSON.stringify(body) }),
  getAll: (tokenOrParams?: string | Record<string, any>, params?: Record<string, any>) => {
    let token: string | undefined;
    let query: Record<string, any> | undefined;
    if (typeof tokenOrParams === "string") {
      token = tokenOrParams;
      query = params;
    } else {
      query = tokenOrParams;
    }
    const qs = query ? `?${new URLSearchParams(query).toString()}` : "";
    return apiFetch(`/inquiries${qs}`, { token });
  },
  updateStatus: (id: string, status: string, adminNotes?: string, token?: string) =>
    apiFetch(`/inquiries/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, adminNotes }),
      token,
    }),
  batchStatus: (ids: string[], status: string, adminNotes?: string, token?: string) =>
    apiFetch("/inquiries/batch-status", {
      method: "POST",
      body: JSON.stringify({ ids, status, adminNotes }),
      token,
    }),
  delete: (id: string, token?: string) =>
    apiFetch(`/inquiries/${id}`, { method: "DELETE", token }),
  batchDelete: (ids: string[], token?: string) =>
    apiFetch("/inquiries/batch-delete", {
      method: "POST",
      body: JSON.stringify({ ids }),
      token,
    }),
};

// 8. Analytics API
export const analyticsApi = {
  getOverview: (token?: string) => apiFetch("/analytics/overview", { token }),
};

// 9. Settings API
export const settingsApi = {
  getAll: () => apiFetch("/settings"),
  update: (body: Record<string, string>, token?: string) =>
    apiFetch("/settings", { method: "PATCH", body: JSON.stringify(body), token }),
  testEmail: (targetEmail: string, token?: string) =>
    apiFetch("/settings/test-email", {
      method: "POST",
      body: JSON.stringify({ targetEmail }),
      token,
    }),
};

// 10. Visual Page Builder (Omnichannel CMS Pages Editor) API
export const pagesApi = {
  listPages: () => apiFetch("/pages"),
  getPublished: (slug: string = "home") => apiFetch(`/pages/${slug}`),
  getDraft: (slug: string = "home", token?: string) =>
    apiFetch(`/pages/${slug}/draft`, { token }),
  saveDraft: (slug: string = "home", body: any, token?: string) =>
    apiFetch(`/pages/${slug}/draft`, {
      method: "PUT",
      body: JSON.stringify(body),
      token,
    }),
  publish: (slug: string = "home", token?: string) =>
    apiFetch(`/pages/${slug}/publish`, {
      method: "POST",
      token,
    }),
  getRevisions: (slug: string = "home", token?: string) =>
    apiFetch(`/pages/${slug}/revisions`, { token }),
  restoreRevision: (slug: string, revisionId: string, token?: string) =>
    apiFetch(`/pages/${slug}/revisions/${revisionId}/restore`, {
      method: "POST",
      token,
    }),
};

// 11. Banners API
export const bannersApi = {
  getAll: (activeOnly: boolean = false) => {
    const qs = activeOnly ? "?active=true" : "";
    return apiFetch(`/banners${qs}`);
  },
  create: (body: any, token?: string) =>
    apiFetch("/banners", { method: "POST", body: JSON.stringify(body), token }),
  update: (id: string, body: any, token?: string) =>
    apiFetch(`/banners/${id}`, { method: "PATCH", body: JSON.stringify(body), token }),
  delete: (id: string, token?: string) =>
    apiFetch(`/banners/${id}`, { method: "DELETE", token }),
};

// 12. Careers API
export const careersApi = {
  getAll: (activeOnly: boolean = false) => {
    const qs = activeOnly ? "?active=true" : "";
    return apiFetch(`/careers${qs}`);
  },
  getListings: (activeOnly: boolean = true) => {
    const qs = activeOnly ? "?active=true" : "?active=false";
    return apiFetch(`/careers${qs}`);
  },
  getById: (id: string) => apiFetch(`/careers/${id}`),
  apply: (id: string, body: any) =>
    apiFetch(`/careers/${id}/apply`, { method: "POST", body: JSON.stringify(body) }),
  create: (body: any, token?: string) =>
    apiFetch("/careers", { method: "POST", body: JSON.stringify(body), token }),
  update: (id: string, body: any, token?: string) =>
    apiFetch(`/careers/${id}`, { method: "PATCH", body: JSON.stringify(body), token }),
  delete: (id: string, token?: string) =>
    apiFetch(`/careers/${id}`, { method: "DELETE", token }),
  getApplications: (token?: string) => apiFetch("/careers/admin/applications", { token }),
};

// 13. Customers API
export const customersApi = {
  getAll: (token?: string) => apiFetch("/customers", { token }),
};

// 14. Cloudinary Upload API
export const uploadApi = {
  uploadSingle: async (file: File, folder: string = "general", token?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const headers: Record<string, string> = {};
    const authToken =
      token ||
      (typeof window !== "undefined"
        ? sessionStorage.getItem("shoilpikkabbo_auth_token") || localStorage.getItem("shoilpikkabbo_auth_token")
        : null);
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      headers,
      body: formData,
    });
    return res.json();
  },

  uploadMultiple: async (files: File[], folder: string = "general", token?: string) => {
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    formData.append("folder", folder);

    const headers: Record<string, string> = {};
    const authToken =
      token ||
      (typeof window !== "undefined"
        ? sessionStorage.getItem("shoilpikkabbo_auth_token") || localStorage.getItem("shoilpikkabbo_auth_token")
        : null);
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const res = await fetch(`${API_BASE}/upload/multiple`, {
      method: "POST",
      headers,
      body: formData,
    });
    return res.json();
  },

  deleteFile: (publicId: string, token?: string) =>
    apiFetch(`/upload/${encodeURIComponent(publicId)}`, { method: "DELETE", token }),
};

// 17. Staff & Team Management API
export const staffApi = {
  getAll: (token?: string) => apiFetch<any[]>("/staff", { token }),
  create: (body: { name: string; phone: string; email?: string; role: "ADMIN" | "STAFF"; password: string }, token?: string) =>
    apiFetch<any>("/staff", { method: "POST", body: JSON.stringify(body), token }),
  updateRole: (id: string, role: "ADMIN" | "STAFF", token?: string) =>
    apiFetch<any>(`/staff/${id}/role`, { method: "PATCH", body: JSON.stringify({ role }), token }),
  resetPassword: (id: string, newPassword: string, token?: string) =>
    apiFetch<any>(`/staff/${id}/reset-password`, { method: "POST", body: JSON.stringify({ newPassword }), token }),
  delete: (id: string, token?: string) =>
    apiFetch<any>(`/staff/${id}`, { method: "DELETE", token }),
};

