"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Bell,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { useAuth } from "@/context/AuthContext";

interface AdminLayoutShellProps {
  children: React.ReactNode;
}

export function AdminLayoutShell({ children }: AdminLayoutShellProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();

  // Authentication & Role Check
  React.useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !user) {
        router.push(`/login?redirect=${encodeURIComponent(pathname || "/admin")}`);
      } else if (!["ADMIN", "SUPER_ADMIN", "STAFF"].includes(user.role as string)) {
        router.push("/");
      }
    }
  }, [loading, isAuthenticated, user, router, pathname]);

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
      case "pages":
        return "Website Pages";
      case "home-editor":
        return "Visual Page Editor";
      default:
        return segment.charAt(0).toUpperCase() + segment.slice(1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sand flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-forest-800 animate-spin mb-3" />
        <p className="text-sm font-medium text-charcoal-600">Verifying admin access...</p>
      </div>
    );
  }

  if (!user || !["ADMIN", "SUPER_ADMIN", "STAFF"].includes(user.role as string)) {
    return (
      <div className="min-h-screen bg-sand flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-heading font-bold text-forest-900 mb-2">Access Restricted</h2>
        <p className="text-sm text-charcoal-600 max-w-md mb-6">
          This administrative dashboard is restricted to authorized operations staff. Please sign in with an administrator account.
        </p>
        <Link
          href={`/login?redirect=${encodeURIComponent(pathname || "/admin")}`}
          className="px-5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-sand font-semibold text-sm transition-colors shadow-sm"
        >
          Sign In as Admin
        </Link>
      </div>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "AD";

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

            {/* Admin Profile */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-brand-border">
              <div className="h-8 w-8 rounded-full bg-forest-800 text-gold-400 font-heading font-bold text-xs flex items-center justify-center shadow-xs">
                {initials}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-charcoal-900 leading-none">
                  {user.name}
                </span>
                <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-0.5 mt-0.5">
                  <ShieldCheck className="h-2.5 w-2.5" />
                  {user.role}
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
