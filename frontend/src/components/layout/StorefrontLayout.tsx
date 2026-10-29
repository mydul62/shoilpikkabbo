"use client";

import * as React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-ivory text-charcoal-900 pb-14 md:pb-0">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <MobileBottomNav />
    </div>
  );
}
