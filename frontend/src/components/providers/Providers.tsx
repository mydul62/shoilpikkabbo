"use client";

import * as React from "react";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { SettingsProvider } from "@/context/SettingsContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SettingsProvider>
        <CartProvider>{children}</CartProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
