"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  User,
  Phone,
  Mail,
  Menu,
  X,
  Truck,
  Sparkles,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { useCart } from "@/context/CartContext";
import { MOCK_CATEGORIES, CLIENT_INFO } from "@/data/mock-data";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const router = useRouter();
  const { totalItemCount, setIsCartOpen } = useCart();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = React.useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-brand-border shadow-xs">
      {/* Top Utility Bar */}
      <div className="bg-forest-950 text-sand text-xs py-2 px-4 border-b border-forest-900">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Support Contacts */}
          <div className="flex items-center gap-4 text-xs font-medium">
            <a
              href={`tel:${CLIENT_INFO.phonePrimary}`}
              className="flex items-center gap-1.5 hover:text-gold-500 transition-colors"
            >
              <Phone className="h-3 w-3 text-gold-500" />
              <span>{CLIENT_INFO.phonePrimary}</span>
            </a>
            <span className="text-forest-700 hidden sm:inline">|</span>
            <a
              href={`mailto:${CLIENT_INFO.email}`}
              className="hidden md:flex items-center gap-1.5 hover:text-gold-500 transition-colors"
            >
              <Mail className="h-3 w-3 text-gold-500" />
              <span>{CLIENT_INFO.email}</span>
            </a>
          </div>

          {/* Promo Announcement */}
          <div className="flex items-center gap-2">
            <span className="hidden lg:inline-flex items-center gap-1 text-gold-500 font-medium">
              <Sparkles className="h-3 w-3" />
              <span>Delivery • Quality • Reliability</span>
            </span>
            <span className="text-forest-600 hidden lg:inline">•</span>
            <span className="text-[11px] text-sand/90">
              Free Delivery on orders over ৳3,000!
            </span>
          </div>

          {/* Utility Quick Links */}
          <div className="flex items-center gap-3">
            <Link
              href="/track-order"
              className="flex items-center gap-1 text-[11px] hover:text-gold-500 transition-colors"
            >
              <Truck className="h-3 w-3" />
              <span>Track Order</span>
            </Link>
            <span className="text-forest-700">|</span>
            <Link
              href="/admin"
              className="flex items-center gap-1 text-[11px] text-gold-500 hover:text-gold-400 font-semibold transition-colors"
            >
              <LayoutDashboard className="h-3 w-3" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-charcoal-700 hover:bg-sand focus:outline-none cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Brand Logo */}
        <Logo variant="storefront" />

        {/* Desktop Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-lg mx-6 relative"
        >
          <input
            type="text"
            placeholder="Search handicrafts, jute products, baby items, agro..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-24 rounded-full border border-brand-border bg-ivory text-xs text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-forest-800/20 focus:border-forest-800 focus:bg-white transition-all shadow-inner"
          />
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-charcoal-400" />
          <button
            type="submit"
            className="absolute right-1 top-1 h-8 px-4 rounded-full bg-forest-800 text-white text-xs font-medium hover:bg-forest-700 transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Actions (Account & Cart) */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/account"
            className="flex items-center gap-2 p-2 rounded-lg text-charcoal-700 hover:text-forest-800 hover:bg-sand transition-colors"
            title="My Account"
          >
            <User className="h-5 w-5" />
            <span className="hidden xl:inline text-xs font-semibold">
              Account
            </span>
          </Link>

          {/* Cart Icon & Live Badge */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-900 border border-forest-100 transition-all cursor-pointer relative"
            aria-label="Open Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag className="h-5 w-5 text-forest-800" />
              {totalItemCount > 0 && (
                <span className="absolute -top-2 -right-2 h-4 min-w-[16px] px-1 rounded-full bg-gold-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {totalItemCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-bold text-forest-900">
              Cart
            </span>
          </button>
        </div>
      </div>

      {/* Primary Category Navigation Bar (Desktop) */}
      <nav className="hidden lg:block bg-ivory border-t border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-semibold">
          {/* Category Dropdown */}
          <div className="relative group">
            <button
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              className="flex items-center gap-2 py-3 px-3 text-forest-900 bg-sand/60 hover:bg-sand rounded-t-lg transition-colors cursor-pointer"
            >
              <Menu className="h-4 w-4 text-forest-800" />
              <span>All 10 Categories</span>
              <ChevronDown className="h-3.5 w-3.5 text-charcoal-500" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute left-0 top-full w-64 bg-white rounded-b-xl shadow-xl border border-brand-border py-2 hidden group-hover:block hover:block z-50">
              {MOCK_CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={cat.isService ? "/e-sheba" : `/shop?category=${cat.slug}`}
                  className="flex items-center justify-between px-4 py-2 hover:bg-forest-50 hover:text-forest-800 transition-colors"
                >
                  <span className="text-xs font-medium text-charcoal-800">
                    {cat.name}
                  </span>
                  {cat.isService ? (
                    <Badge variant="gold" className="text-[10px] py-0">
                      Service
                    </Badge>
                  ) : (
                    <span className="text-[10px] text-charcoal-400">
                      {cat.itemCount} items
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Category Links */}
          <div className="flex items-center space-x-1 xl:space-x-4">
            <Link
              href="/shop"
              className="py-3 px-2 text-charcoal-700 hover:text-forest-800 transition-colors"
            >
              Shop All
            </Link>
            <Link
              href="/shop?category=handicraft"
              className="py-3 px-2 text-charcoal-700 hover:text-forest-800 transition-colors"
            >
              Handicraft
            </Link>
            <Link
              href="/shop?category=jute-items"
              className="py-3 px-2 text-charcoal-700 hover:text-forest-800 transition-colors"
            >
              Jute Items
            </Link>
            <Link
              href="/shop?category=corporate-gift-items"
              className="py-3 px-2 text-charcoal-700 hover:text-forest-800 transition-colors"
            >
              Corporate Gifts
            </Link>
            <Link
              href="/shop?category=baby-items"
              className="py-3 px-2 text-charcoal-700 hover:text-forest-800 transition-colors"
            >
              Baby Items
            </Link>
            <Link
              href="/shop?category=health-and-beauty"
              className="py-3 px-2 text-charcoal-700 hover:text-forest-800 transition-colors"
            >
              Health & Beauty
            </Link>
            <Link
              href="/offers"
              className="py-3 px-2 text-gold-700 font-bold hover:text-gold-800 transition-colors flex items-center gap-1"
            >
              <Sparkles className="h-3 w-3 text-gold-600" />
              <span>Offers & Deals</span>
            </Link>
            <Link
              href="/e-sheba"
              className="py-3 px-3 rounded-lg bg-forest-800 text-white font-bold hover:bg-forest-700 transition-colors"
            >
              Special E-Sheba
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-brand-border bg-white px-4 pt-3 pb-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-lg border border-brand-border bg-sand/30 text-xs"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-charcoal-400" />
          </form>

          <div className="space-y-1">
            <p className="text-[11px] font-bold text-charcoal-400 uppercase tracking-wider mb-2">
              Browse Categories
            </p>
            {MOCK_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={cat.isService ? "/e-sheba" : `/shop?category=${cat.slug}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 text-sm text-charcoal-800 hover:text-forest-800"
              >
                <span>{cat.name}</span>
                {cat.isService && (
                  <Badge variant="gold" className="text-[10px]">
                    Service
                  </Badge>
                )}
              </Link>
            ))}
          </div>

          <div className="border-t border-sand pt-3 space-y-2 text-sm">
            <Link
              href="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1 text-charcoal-700"
            >
              All Products
            </Link>
            <Link
              href="/offers"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1 text-gold-700 font-semibold"
            >
              Seasonal Offers
            </Link>
            <Link
              href="/track-order"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1 text-charcoal-700"
            >
              Track Order
            </Link>
            <Link
              href="/e-sheba"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1 text-forest-800 font-bold"
            >
              Special E-Sheba
            </Link>
            <Link
              href="/careers"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1 text-charcoal-700"
            >
              Careers
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1 text-charcoal-700"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1 text-charcoal-700"
            >
              Contact Us
            </Link>
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-gold-600 font-bold border-t border-sand"
            >
              Admin Dashboard Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
