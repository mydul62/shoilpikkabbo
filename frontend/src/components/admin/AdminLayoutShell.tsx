"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Bell,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";

interface AdminLayoutShellProps {
  children: React.ReactNode;
}

export function AdminLayoutShell({ children }: AdminLayoutShellProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const pathname = usePathname();

  // Generate dynamic breadcrumbs
  const pathSegments = (pathname ?? "/admin")
    .split("/")
    .filter((segment) => segment.length > 0);

  const getBreadcrumbTitle = (segment: string) => {
    switch (segment) {
      case "admin":
        return "Dashboard";
      case "products":
        return "Products";
      case "categories":
        return "Categories";
      case "orders":
        return "Orders";
      case "payments":
        return "Payments";
      case "customers":
        return "Customers";
      case "coupons":
        return "Coupons & Offers";
      case "banners":
        return "Banners";
      case "inquiries":
        return "Service Inquiries";
      case "careers":
        return "Careers";
      case "analytics":
        return "Analytics";
      case "settings":
        return "Website Settings";
      default:
        return segment.charAt(0).toUpperCase() + segment.slice(1);
    }
  };

  return (
    <div className="min-h-screen bg-sand/30 flex text-charcoal-900 font-sans">
      {/* Persistent Sidebar */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-brand-border px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Trigger */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-charcoal-600 hover:bg-sand focus:outline-none cursor-pointer"
              aria-label="Open Admin Menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Dynamic Breadcrumbs */}
            <nav className="flex items-center gap-1.5 text-xs text-charcoal-500 font-medium">
              <Link
                href="/admin"
                className="hover:text-forest-800 transition-colors"
              >
                Admin
              </Link>
              {pathSegments.slice(1).map((segment, idx) => (
                <React.Fragment key={idx}>
                  <ChevronRight className="h-3 w-3 text-charcoal-400" />
                  <span className="text-charcoal-900 font-semibold capitalize">
                    {getBreadcrumbTitle(segment)}
                  </span>
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Link to Storefront */}
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-border text-xs font-semibold text-charcoal-700 hover:bg-sand hover:text-forest-800 transition-colors"
            >
              <span>Live Store</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            {/* Notifications */}
            <button
              className="p-2 rounded-lg text-charcoal-600 hover:bg-sand relative transition-colors cursor-pointer"
              aria-label="Admin Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-gold-600 ring-2 ring-white" />
            </button>

            {/* Admin Profile */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-brand-border">
              <div className="h-8 w-8 rounded-full bg-forest-800 text-gold-400 font-heading font-bold text-xs flex items-center justify-center shadow-xs">
                AD
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-charcoal-900 leading-none">
                  Operations Admin
                </span>
                <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-0.5 mt-0.5">
                  <ShieldCheck className="h-2.5 w-2.5" />
                  Verified Staff
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
