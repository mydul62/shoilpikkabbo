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
  const [lang, setLang] = React.useState<"en" | "bn">("en");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="w-full bg-[#F7F4EE] z-40 sticky top-0 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* 1. Top Announcement Bar */}
      <div className="bg-[#133829] text-[#DCE5DF] py-2 px-6 sm:px-10 lg:px-16 border-b border-[#0F2D21]">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between text-[11.5px] sm:text-[12px] font-normal tracking-wide">
          {/* Left Text */}
          <div className="text-[#DCE5DF] font-light">
            Thoughtful finds. Everyday possibilities.
          </div>

          {/* Right Links */}
          <div className="flex items-center gap-2.5 sm:gap-3 text-[#DCE5DF] font-light">
            <Link
              href="/track-order"
              className="hover:text-white transition-colors"
            >
              Track your order
            </Link>
            <span className="text-[#6D8A7A] select-none">·</span>
            <Link
              href="/contact"
              className="hover:text-white transition-colors"
            >
              Need help?
            </Link>
            <span className="text-[#6D8A7A] select-none">·</span>
            <button
              onClick={() => setLang(lang === "en" ? "bn" : "en")}
              className="hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1"
              title="Toggle Language"
            >
              <span className={lang === "en" ? "text-white font-medium" : "text-[#DCE5DF]/80"}>
                EN
              </span>
              <span className="text-[#6D8A7A]">/</span>
              <span className={lang === "bn" ? "text-white font-medium" : "text-[#DCE5DF]/80"}>
                বাংলা
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Header Row (Logo, Centered Search Bar, Actions) */}
      <div className="border-b border-[#EAE3D5] bg-[#F7F4EE]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-4 sm:py-5 flex items-center justify-between gap-6 lg:gap-10">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 -ml-2 text-[#143527] hover:bg-[#EFE8DC] rounded-xs focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Left: Brand Logo */}
          <div className="shrink-0">
            <Logo variant="storefront" />
          </div>

          {/* Center: Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-[540px] mx-auto"
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

          {/* Right: Actions (Sign in & Bag) */}
          <div className="flex items-center gap-7 sm:gap-9 shrink-0">
            <Link
              href="/login"
              className="flex items-center gap-2.5 text-[14px] text-[#143527] hover:text-[#B85D38] transition-colors font-medium group"
            >
              <User className="w-[20px] h-[20px] text-[#143527] group-hover:text-[#B85D38] transition-colors" strokeWidth={1.6} />
              <span className="hidden sm:inline">Sign in</span>
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 text-[14px] text-[#143527] hover:text-[#B85D38] transition-colors font-medium cursor-pointer group"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-[20px] h-[20px] text-[#143527] group-hover:text-[#B85D38] transition-colors" strokeWidth={1.6} />
              <span>Bag ({totalItemCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Secondary Category Bar (Evenly Distributed Nav Menu) */}
      <nav className="hidden lg:block border-b border-[#EAE3D5] bg-[#F7F4EE]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between w-full py-3 text-[13.5px]">
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
            href="/e-sheba"
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
                href="/e-sheba"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-[#B85D38]"
              >
                Special E-Sheba (Services)
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
