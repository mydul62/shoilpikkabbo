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

    if (options.token) {
      headers["Authorization"] = `Bearer ${options.token}`;
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
};

// 2. Categories API
export const categoriesApi = {
  getAll: () => apiFetch("/categories"),
  getBySlug: (slug: string) => apiFetch(`/categories/${slug}`),
  create: (body: any, token?: string) =>
    apiFetch("/categories", { method: "POST", body: JSON.stringify(body), token }),
  update: (id: string, body: any, token?: string) =>
    apiFetch(`/categories/${id}`, { method: "PATCH", body: JSON.stringify(body), token }),
  delete: (id: string, token?: string) =>
    apiFetch(`/categories/${id}`, { method: "DELETE", token }),
};

// 3. Products API
export const productsApi = {
  getAll: (params?: Record<string, any>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiFetch(`/products${qs}`);
  },
  getBySlug: (slug: string) => apiFetch(`/products/${slug}`),
  create: (body: any, token?: string) =>
    apiFetch("/products", { method: "POST", body: JSON.stringify(body), token }),
  update: (id: string, body: any, token?: string) =>
    apiFetch(`/products/${id}`, { method: "PATCH", body: JSON.stringify(body), token }),
  delete: (id: string, token?: string) =>
    apiFetch(`/products/${id}`, { method: "DELETE", token }),
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
  updateStatus: (id: string, status: string, token?: string, note?: string) =>
    apiFetch(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, note }),
      token,
    }),
};

// 5. Payments API
export const paymentsApi = {
  getAll: (token?: string, status?: string) => {
    const qs = status ? `?status=${status}` : "";
    return apiFetch(`/payments${qs}`, { token });
  },
  verify: (id: string, decision: "VERIFIED" | "REJECTED", token?: string, notes?: string) =>
    apiFetch(`/payments/${id}/verify`, {
      method: "PATCH",
      body: JSON.stringify({ decision, notes }),
      token,
    }),
};

// 6. Coupons API
export const couponsApi = {
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
  getAll: (token?: string) => apiFetch("/inquiries", { token }),
  updateStatus: (id: string, status: string, token?: string, adminNotes?: string) =>
    apiFetch(`/inquiries/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, adminNotes }),
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
};

// 10. Visual Page Builder (Home Page Editor) API
export const pagesApi = {
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
