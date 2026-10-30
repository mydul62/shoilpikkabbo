"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, Package, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const { totalItemCount, setIsCartOpen } = useCart();

  const accountHref = isAuthenticated
    ? (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN" ? "/admin" : "/account")
    : "/login";

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 px-1.5 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            pathname === "/"
              ? "text-[#E0592A] font-bold"
              : "text-gray-500 hover:text-[#0D3B37] font-medium"
          }`}
        >
          <Home
            className={`w-5 h-5 transition-transform duration-200 ${
              pathname === "/" ? "stroke-[2.2] scale-105 text-[#E0592A]" : "stroke-[1.7]"
            }`}
          />
          <span
            className={`text-[10px] mt-0.5 tracking-normal ${
              pathname === "/" ? "font-bold text-[#E0592A]" : "font-medium"
            }`}
          >
            Home
          </span>
        </Link>

        {/* 2. Explore */}
        <Link
          href="/shop"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            pathname.startsWith("/shop")
              ? "text-[#E0592A] font-bold"
              : "text-gray-500 hover:text-[#0D3B37] font-medium"
          }`}
        >
          <Search
            className={`w-5 h-5 transition-transform duration-200 ${
              pathname.startsWith("/shop") ? "stroke-[2.2] scale-105 text-[#E0592A]" : "stroke-[1.7]"
            }`}
          />
          <span
            className={`text-[10px] mt-0.5 tracking-normal ${
              pathname.startsWith("/shop") ? "font-bold text-[#E0592A]" : "font-medium"
            }`}
          >
            Explore
          </span>
        </Link>

        {/* 3. Cart Button with Live Badge */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all text-gray-600 hover:text-[#E0592A] cursor-pointer group"
          aria-label="Open Shopping Cart"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-[1.8] group-hover:scale-105 transition-transform text-[#0D3B37]" />
            {totalItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-[#E0592A] text-white text-[9px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs">
                {totalItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-semibold text-gray-700 group-hover:text-[#E0592A]">
            Cart
          </span>
        </button>

        {/* 4. Track */}
        <Link
          href="/track-order"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            pathname.startsWith("/track-order")
              ? "text-[#E0592A] font-bold"
              : "text-gray-500 hover:text-[#0D3B37] font-medium"
          }`}
        >
          <Package
            className={`w-5 h-5 transition-transform duration-200 ${
              pathname.startsWith("/track-order") ? "stroke-[2.2] scale-105 text-[#E0592A]" : "stroke-[1.7]"
            }`}
          />
          <span
            className={`text-[10px] mt-0.5 tracking-normal ${
              pathname.startsWith("/track-order") ? "font-bold text-[#E0592A]" : "font-medium"
            }`}
          >
            Track
          </span>
        </Link>

        {/* 5. Account */}
        <Link
          href={accountHref}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/account") || pathname.startsWith("/admin")
              ? "text-[#E0592A] font-bold"
              : "text-gray-500 hover:text-[#0D3B37] font-medium"
          }`}
        >
          <User
            className={`w-5 h-5 transition-transform duration-200 ${
              pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/account") || pathname.startsWith("/admin")
                ? "stroke-[2.2] scale-105 text-[#E0592A]"
                : "stroke-[1.7]"
            }`}
          />
          <span
            className={`text-[10px] mt-0.5 tracking-normal ${
              pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/account") || pathname.startsWith("/admin")
                ? "font-bold text-[#E0592A]"
                : "font-medium"
            }`}
          >
            {isAuthenticated ? "Account" : "Sign In"}
          </span>
        </Link>
      </div>
    </nav>
  );
}
