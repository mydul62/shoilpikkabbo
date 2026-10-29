"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Package, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();

  const accountHref = isAuthenticated
    ? (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN" ? "/admin" : "/account")
    : "/login";

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Explore",
      href: "/shop",
      icon: Search,
      isActive: pathname.startsWith("/shop"),
    },
    {
      label: "Track",
      href: "/track-order",
      icon: Package,
      isActive: pathname.startsWith("/track-order"),
    },
    {
      label: isAuthenticated ? "Account" : "Sign In",
      href: accountHref,
      icon: User,
      isActive: pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/account") || pathname.startsWith("/admin"),
    },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 px-2 py-1.5 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const IconComp = item.icon;
          const active = item.isActive;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-md transition-colors ${
                active
                  ? "text-[#E0592A]"
                  : "text-gray-500 hover:text-[#0D3B37]"
              }`}
            >
              <IconComp
                className={`w-[21px] h-[21px] ${
                  active ? "stroke-[2.2] text-[#E0592A]" : "stroke-[1.6]"
                }`}
              />
              <span
                className={`text-[10px] mt-0.5 tracking-tight ${
                  active ? "font-bold text-[#E0592A]" : "font-normal"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
