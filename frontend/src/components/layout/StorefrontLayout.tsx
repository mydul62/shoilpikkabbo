"use client";

import * as React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { FloatingWidgets } from "@/components/layout/FloatingWidgets";

export function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-ivory text-charcoal-900 pb-16 md:pb-0 overflow-x-hidden w-full max-w-full">
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
      <CartDrawer />
      <MobileBottomNav />
      <FloatingWidgets />
    </div>
  );
}
