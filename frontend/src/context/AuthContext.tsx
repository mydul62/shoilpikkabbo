"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  role: "ADMIN" | "SUPER_ADMIN" | "STAFF" | "CUSTOMER" | string;
  createdAt?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; message?: string; role?: string }>;
  register: (data: {
    name: string;
    phone: string;
    email?: string;
    password: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [token, setToken] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  // Initialize session on mount
  const refreshUser = React.useCallback(async () => {
    try {
      // First check session storage for fallback token if cookie cross-origin
      const savedToken = typeof window !== "undefined" ? sessionStorage.getItem("shoilpikkabbo_auth_token") : null;
      if (savedToken) {
        setToken(savedToken);
      }

      const res = await authApi.getMe(savedToken || undefined);
      if (res.success && res.data) {
        setUser(res.data as UserProfile);
      } else {
        setUser(null);
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("shoilpikkabbo_auth_token");
        }
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.login({
        emailOrPhone: identifier,
        password,
      });

      if (res.success && res.data) {
        const { user: loggedInUser, token: authToken } = res.data as {
          user: UserProfile;
          token: string;
        };
        setUser(loggedInUser);
        setToken(authToken);

        if (typeof window !== "undefined" && authToken) {
          sessionStorage.setItem("shoilpikkabbo_auth_token", authToken);
        }

        setIsLoading(false);
        return { success: true, role: loggedInUser.role };
      } else {
        setIsLoading(false);
        return {
          success: false,
          message: res.message || "Invalid credentials. Please verify and try again.",
        };
      }
    } catch {
      setIsLoading(false);
      return {
        success: false,
        message: "An unexpected connection error occurred. Please try again.",
      };
    }
  };

  const register = async (data: {
    name: string;
    phone: string;
    email?: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(data);

      if (res.success && res.data) {
        const { user: registeredUser, token: authToken } = res.data as {
          user: UserProfile;
          token: string;
        };
        setUser(registeredUser);
        setToken(authToken);

        if (typeof window !== "undefined" && authToken) {
          sessionStorage.setItem("shoilpikkabbo_auth_token", authToken);
        }

        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return {
          success: false,
          message: res.message || "Registration could not be completed. Please check your details.",
        };
      }
    } catch {
      setIsLoading(false);
      return {
        success: false,
        message: "An unexpected error occurred during registration.",
      };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      setUser(null);
      setToken(null);
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("shoilpikkabbo_auth_token");
      }
      setIsLoading(false);
      router.push("/login");
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    loading: isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
