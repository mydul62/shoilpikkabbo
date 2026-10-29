"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingCart,
  CreditCard,
  Users,
  Tag,
  Image as ImageIcon,
  MessageSquare,
  Briefcase,
  BarChart3,
  Settings,
  Store,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/Logo";
import { useAuth } from "@/context/AuthContext";

interface AdminSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export function AdminSidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const navItems = [
    {
      group: "Core Management",
      items: [
        {
          label: "Overview",
          href: "/admin",
          icon: LayoutDashboard,
          badge: null,
        },
        {
          label: "Products",
          href: "/admin/products",
          icon: Package,
          badge: null,
        },
        {
          label: "Categories",
          href: "/admin/categories",
          icon: Layers,
          badge: null,
        },
        {
          label: "Orders",
          href: "/admin/orders",
          icon: ShoppingCart,
          badge: null,
          badgeVariant: "warning",
        },
        {
          label: "Payments",
          href: "/admin/payments",
          icon: CreditCard,
          badge: null,
          badgeVariant: "danger",
        },
        {
          label: "Customers",
          href: "/admin/customers",
          icon: Users,
          badge: null,
        },
      ],
    },
    {
      group: "Visual Builder & CMS",
      items: [
        {
          label: "Home Page Editor",
          href: "/admin/home-editor",
          icon: Palette,
          badge: "Elementor",
          badgeVariant: "gold",
        },
        {
          label: "Banners & Promos",
          href: "/admin/banners",
          icon: ImageIcon,
          badge: null,
        },
      ],
    },
    {
      group: "Marketing & Growth",
      items: [
        {
          label: "Coupons & Offers",
          href: "/admin/coupons",
          icon: Tag,
          badge: null,
        },
        {
          label: "Service Inquiries",
          href: "/admin/inquiries",
          icon: MessageSquare,
          badge: null,
          badgeVariant: "gold",
        },
        {
          label: "Careers",
          href: "/admin/careers",
          icon: Briefcase,
          badge: null,
        },
      ],
    },
    {
      group: "System & Reports",
      items: [
        {
          label: "Analytics",
          href: "/admin/analytics",
          icon: BarChart3,
          badge: null,
        },
        {
          label: "Website Settings",
          href: "/admin/settings",
          icon: Settings,
          badge: null,
        },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-forest-950 text-sand border-r border-forest-900 select-none">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-forest-900/80 bg-forest-950 shrink-0">
        {!isCollapsed && <Logo variant="light" showTagline={false} />}
        {isCollapsed && (
          <div className="h-9 w-9 mx-auto rounded-lg bg-forest-800 text-gold-500 font-heading font-black text-base flex items-center justify-center border border-gold-600/30">
            SK
          </div>
        )}

        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-1.5 text-sand/70 hover:text-white rounded-lg hover:bg-forest-900 cursor-pointer"
          aria-label="Close Mobile Sidebar"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Desktop collapse toggle button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex p-1.5 text-sand/70 hover:text-gold-500 rounded-lg hover:bg-forest-900 cursor-pointer transition-colors"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navItems.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-sand/40 mb-2">
                {group.group}
              </p>
            )}
            {group.items.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname?.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative",
                    isActive
                      ? "bg-forest-800 text-white font-semibold shadow-sm border border-gold-600/20"
                      : "text-sand/70 hover:bg-forest-900 hover:text-white"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive
                        ? "text-gold-400"
                        : "text-sand/60 group-hover:text-gold-400"
                    )}
                  />
                  {!isCollapsed && (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}
                  {!isCollapsed && item.badge !== null && (
                    <span
                      className={cn(
                        "ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0",
                        item.badgeVariant === "danger"
                          ? "bg-rose-500 text-white"
                          : item.badgeVariant === "warning"
                          ? "bg-amber-500 text-charcoal-950 font-bold"
                          : "bg-gold-500 text-forest-950 font-bold"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                  {/* Tooltip badge for collapsed state */}
                  {isCollapsed && item.badge !== null && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-gold-400" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer / Storefront Switcher */}
      <div className="p-3 border-t border-forest-900 bg-forest-950/80 space-y-1 shrink-0">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-gold-400 hover:bg-forest-900 hover:text-gold-300 transition-colors",
            isCollapsed && "justify-center px-0"
          )}
          title="Back to Customer Storefront"
        >
          <Store className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>View Storefront</span>}
        </Link>
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-300 hover:bg-rose-950/30 transition-colors cursor-pointer text-left",
            isCollapsed && "justify-center px-0"
          )}
          title="Sign Out"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={cn(
          "hidden lg:block shrink-0 sticky top-0 h-screen transition-all duration-300 z-30",
          isCollapsed ? "w-18" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-charcoal-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 shadow-2xl z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
