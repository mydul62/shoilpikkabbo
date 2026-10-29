"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { useCart } from "@/context/CartContext";

export function Header() {
  const router = useRouter();
  const { totalItemCount, setIsCartOpen } = useCart();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState(false);
  const [lang, setLang] = React.useState<"en" | "bn">("en");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
      setIsMobileSearchOpen(false);
    }
  };

  return (
    <header className="w-full bg-[#F7F4EE] z-40 sticky top-0 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* 1. Top Announcement Bar */}
      <div className="bg-[#133829] text-[#DCE5DF] py-2 px-4 sm:px-8 lg:px-16 border-b border-[#0F2D21]">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between text-[11px] sm:text-[12px] font-normal tracking-wide">
          {/* Left Text: Delivery • Quality • Reliability */}
          <div className="text-[#DCE5DF] font-light">
            Delivery • Quality • Reliability
          </div>

          {/* Right Links */}
          <div className="flex items-center gap-2 sm:gap-3 text-[#DCE5DF] font-light shrink-0">
            <Link
              href="/track-order"
              className="hover:text-white transition-colors hidden sm:inline"
            >
              Track order
            </Link>
            <span className="text-[#6D8A7A] select-none hidden sm:inline">·</span>
            <Link
              href="/contact"
              className="hover:text-white transition-colors hidden sm:inline"
            >
              Need help?
            </Link>
            <span className="text-[#6D8A7A] select-none hidden sm:inline">·</span>
            <button
              onClick={() => setLang(lang === "en" ? "bn" : "en")}
              className="hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1 text-[11px] sm:text-xs"
              title="Toggle Language"
            >
              <span className={lang === "en" ? "text-white font-medium" : "text-[#DCE5DF]/80"}>
                EN ⌵
              </span>
              <span className="text-[#6D8A7A]">|</span>
              <span className={lang === "bn" ? "text-white font-medium" : "text-[#DCE5DF]/80"}>
                বাংলা
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Header Row */}
      <div className="border-b border-[#EAE3D5] bg-[#F7F4EE]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-3.5 sm:py-4 lg:py-5 flex items-center justify-between gap-3 sm:gap-6 lg:gap-10">
          {/* Mobile & Tablet Menu Button (Left, visible on < lg) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 -ml-1 text-[#143527] hover:bg-[#EFE8DC] rounded-xs focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Brand Logo / Title: Centered on Mobile & Tablet, Left on Desktop */}
          <div className="shrink-0 flex items-center justify-center flex-1 lg:flex-initial">
            <Link href="/" className="group flex items-center gap-2">
              <span className="font-serif text-[18px] sm:text-[22px] lg:text-[24px] font-normal tracking-[0.14em] text-[#143527] uppercase">
                SHOILPIKKABBO
              </span>
            </Link>
          </div>

          {/* Center: Search Bar (Desktop only, lg+) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex flex-1 max-w-[540px] mx-auto"
          >
            <div className="relative w-full flex items-center bg-[#F7F4EE] border border-[#D5CDC0] rounded-[2px] transition-all focus-within:border-[#143527] focus-within:bg-white focus-within:shadow-sm">
              <div className="pl-4 pr-2.5 flex items-center pointer-events-none">
                <Search className="w-[18px] h-[18px] text-[#243B2D]" strokeWidth={1.8} />
              </div>
              <input
                type="text"
                placeholder="Search products, categories & services"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pr-4 bg-transparent text-[13.5px] text-[#143527] placeholder:text-[#6F7670] placeholder:font-normal focus:outline-none"
              />
            </div>
          </form>

          {/* Right: Actions (User icon & Bag icon on Tablet; full text on Desktop) */}
          <div className="flex items-center gap-3.5 sm:gap-5 lg:gap-9 shrink-0">
            <Link
              href="/login"
              className="flex items-center gap-2 text-[13.5px] sm:text-[14px] text-[#143527] hover:text-[#B85D38] transition-colors font-medium group"
              title="Account"
              aria-label="Account"
            >
              <User className="w-[19px] h-[19px] sm:w-[20px] sm:h-[20px] text-[#143527] group-hover:text-[#B85D38] transition-colors" strokeWidth={1.6} />
              <span className="hidden lg:inline">Sign in</span>
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2.5 text-[13.5px] sm:text-[14px] text-[#143527] hover:text-[#B85D38] transition-colors font-medium cursor-pointer group"
              aria-label="Open Shopping Bag"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-[#143527] group-hover:text-[#B85D38] transition-colors" strokeWidth={1.6} />
                {totalItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#B85D38] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalItemCount}
                  </span>
                )}
              </div>
              <span className="hidden lg:inline">Bag ({totalItemCount})</span>
            </button>
          </div>
        </div>

        {/* 2b. Full-Width Search Bar on Mobile & Tablet (< lg) Matching Tablet Screenshot 1 */}
        <div className="lg:hidden px-4 sm:px-8 py-2.5 bg-[#FAF7F2] border-t border-[#EAE3D5]/80">
          <form onSubmit={handleSearchSubmit} className="relative max-w-[768px] mx-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6F7670]" strokeWidth={1.8} />
            <input
              type="text"
              placeholder="Search products, categories & services"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-3.5 rounded-[2px] border border-[#D5CDC0] bg-white text-[12.5px] sm:text-[13px] text-[#143527] placeholder:text-[#6F7670] focus:outline-none focus:border-[#143527]"
            />
          </form>
        </div>
      </div>

      {/* 3. Secondary Category Bar (Horizontal swipeable on Mobile/Tablet, Distributed on Desktop) */}
      <nav className="border-b border-[#EAE3D5] bg-[#F7F4EE] overflow-x-auto scrollbar-none">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 flex items-center justify-start lg:justify-between gap-5 sm:gap-7 lg:gap-0 py-2.5 sm:py-3 text-[12.5px] sm:text-[13.5px] whitespace-nowrap min-w-max lg:min-w-0">
          <Link
            href="/shop"
            className="text-[#243329] font-medium hover:text-[#B85D38] transition-colors"
          >
            Shop all
          </Link>
          <Link
            href="/shop?category=handicraft"
            className="text-[#243329] font-medium hover:text-[#B85D38] transition-colors"
          >
            Handicrafts
          </Link>
          <Link
            href="/shop?category=jute-items"
            className="text-[#243329] font-medium hover:text-[#B85D38] transition-colors"
          >
            Jute Items
          </Link>
          <Link
            href="/shop?category=corporate-gift-items"
            className="text-[#243329] font-medium hover:text-[#B85D38] transition-colors"
          >
            Gifting
          </Link>
          <Link
            href="/services"
            className="text-[#243329] font-medium hover:text-[#B85D38] transition-colors"
          >
            Services
          </Link>
          <Link
            href="/about"
            className="text-[#243329] font-medium hover:text-[#B85D38] transition-colors"
          >
            About us
          </Link>
          <Link
            href="/careers"
            className="text-[#243329] font-medium hover:text-[#B85D38] transition-colors"
          >
            Career
          </Link>
          <Link
            href="/contact"
            className="text-[#243329] font-medium hover:text-[#B85D38] transition-colors"
          >
            Contact us
          </Link>
          <Link
            href="/offers"
            className="text-[#B85D38] font-medium hover:text-[#9E4A28] transition-colors"
          >
            Offers / Discounts
          </Link>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-[#EAE3D5] bg-[#F7F4EE] px-6 pt-4 pb-8 space-y-5 animate-in fade-in duration-200">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-[#243B2D]" />
            <input
              type="text"
              placeholder="Search products, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-[2px] border border-[#D5CDC0] bg-white text-xs text-[#143527]"
            />
          </form>

          <div className="space-y-2 text-sm text-[#243329] font-medium divide-y divide-[#EAE3D5]/60">
            <div className="pt-2 flex flex-col space-y-2.5">
              <Link
                href="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-[#B85D38]"
              >
                Shop all
              </Link>
              <Link
                href="/shop?category=handicraft"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-[#B85D38]"
              >
                Handicrafts
              </Link>
              <Link
                href="/shop?category=jute-items"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-[#B85D38]"
              >
                Jute Items
              </Link>
              <Link
                href="/shop?category=corporate-gift-items"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-[#B85D38]"
              >
                Gifting
              </Link>
              <Link
                href="/services"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-[#B85D38]"
              >
                Services
              </Link>
            </div>

            <div className="pt-3 flex flex-col space-y-2.5">
              <Link
                href="/offers"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[#B85D38] font-semibold"
              >
                Offers / Discounts
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-[#B85D38]"
              >
                About us
              </Link>
              <Link
                href="/careers"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-[#B85D38]"
              >
                Career
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-[#B85D38]"
              >
                Contact us
              </Link>
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[#143527] font-bold flex items-center justify-between pt-1"
              >
                <span>Admin Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
