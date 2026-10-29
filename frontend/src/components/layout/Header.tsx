"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { MOCK_PRODUCTS } from "@/data/mock-data";

const SEARCH_CATEGORIES = [
  { name: "Handicrafts", slug: "handicraft" },
  { name: "Jute Items", slug: "jute-items" },
  { name: "Polymer", slug: "polymer" },
  { name: "Baby Items", slug: "baby-items" },
  { name: "Corporate Gift Items", slug: "corporate-gift-items" },
  { name: "Rudiment Garments", slug: "rudiment-garments" },
  { name: "Industrial Solutions", slug: "industrial-solutions" },
  { name: "Health & Beauty", slug: "health-and-beauty" },
  { name: "Agriculture", slug: "agriculture" },
  { name: "Special E-Sheba & Services", slug: "special-e-sheba", href: "/services" },
];

const SEARCH_QUICK_LINKS = [
  { title: "Special E-Sheba & Custom Services", href: "/services", keywords: "service sheba corporate order custom solution request" },
  { title: "Track Your Order Status", href: "/track-order", keywords: "track tracking order delivery status parcel package" },
  { title: "Current Offers & Discounts", href: "/offers", keywords: "offer discount deal coupon promo sale voucher" },
  { title: "Career Opportunities", href: "/careers", keywords: "career job work hiring vacancy apply" },
  { title: "Customer Support & Contact", href: "/contact", keywords: "contact help support phone whatsapp email" },
];

// Inner component wrapped in Suspense to safely read searchParams without triggering Next.js build bail-out
function SearchParamsSync({ onSync }: { onSync: (q: string) => void }) {
  const searchParams = useSearchParams();
  React.useEffect(() => {
    const q = searchParams?.get("q");
    if (q) {
      onSync(q);
    }
  }, [searchParams, onSync]);
  return null;
}

export function Header() {
  const router = useRouter();
  const { totalItemCount, setIsCartOpen } = useCart();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = React.useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = React.useState(false);
  const [lang, setLang] = React.useState<"en" | "bn">("en");
  const [catalogProducts, setCatalogProducts] = React.useState<any[]>(MOCK_PRODUCTS);

  const desktopSearchRef = React.useRef<HTMLDivElement>(null);
  const mobileSearchRef = React.useRef<HTMLDivElement>(null);

  // Fetch live products for accurate global search
  React.useEffect(() => {
    let isMounted = true;
    fetch("http://localhost:5000/api/v1/products?limit=100")
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped = json.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            categoryName: p.category?.name || "Handicraft",
            price: Number(p.price),
            salePrice: p.salePrice ? Number(p.salePrice) : undefined,
            imageUrl: p.images?.[0]?.url || "/images/product-jute-basket.png",
            description: p.description || "",
          }));
          setCatalogProducts(mapped);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  // Click outside to close dropdowns
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(e.target as Node)
      ) {
        setIsDesktopDropdownOpen(false);
      }
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target as Node)
      ) {
        setIsMobileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdowns and mobile menu on Escape key
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsDesktopDropdownOpen(false);
        setIsMobileDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Compute live global search results
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const searchResults = React.useMemo(() => {
    if (!normalizedQuery) {
      return {
        products: [],
        allMatchingProductCount: 0,
        categories: [],
        quickLinks: [],
        totalCount: 0,
      };
    }

    const matchedCategories = SEARCH_CATEGORIES.filter(
      (c) =>
        c.name.toLowerCase().includes(normalizedQuery) ||
        c.slug.toLowerCase().includes(normalizedQuery)
    );

    const matchedProducts = catalogProducts.filter((p) => {
      const inName = p.name.toLowerCase().includes(normalizedQuery);
      const inCat = p.categoryName?.toLowerCase().includes(normalizedQuery);
      const inDesc = p.description?.toLowerCase().includes(normalizedQuery);
      return inName || inCat || inDesc;
    });

    const matchedQuickLinks = SEARCH_QUICK_LINKS.filter(
      (l) =>
        l.title.toLowerCase().includes(normalizedQuery) ||
        l.keywords.toLowerCase().includes(normalizedQuery)
    );

    return {
      products: matchedProducts.slice(0, 5),
      allMatchingProductCount: matchedProducts.length,
      categories: matchedCategories.slice(0, 4),
      quickLinks: matchedQuickLinks.slice(0, 3),
      totalCount: matchedProducts.length + matchedCategories.length + matchedQuickLinks.length,
    };
  }, [normalizedQuery, catalogProducts]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setIsDesktopDropdownOpen(false);
      setIsMobileDropdownOpen(false);
      setIsMobileMenuOpen(false);
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSelectProduct = (slug: string) => {
    setIsDesktopDropdownOpen(false);
    setIsMobileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    router.push(`/products/${slug}`);
  };

  const handleSelectCategory = (cat: { slug: string; href?: string }) => {
    setIsDesktopDropdownOpen(false);
    setIsMobileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    if (cat.href) {
      router.push(cat.href);
    } else {
      router.push(`/shop?category=${cat.slug}`);
    }
  };

  const handleSelectLink = (href: string) => {
    setIsDesktopDropdownOpen(false);
    setIsMobileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    router.push(href);
  };

  const renderDropdown = () => {
    if (!normalizedQuery) return null;
    const hasResults = searchResults.totalCount > 0;

    return (
      <div
        className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#D5CDC0] rounded-md shadow-2xl z-50 overflow-hidden max-h-[460px] overflow-y-auto divide-y divide-[#EAE3D5]"
        role="listbox"
      >
        {hasResults ? (
          <>
            {/* Matching Categories */}
            {searchResults.categories.length > 0 && (
              <div className="p-3 bg-[#FAF7F2]">
                <span className="text-[10px] font-semibold text-[#B85D38] uppercase tracking-wider block mb-2">
                  Matching Categories
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {searchResults.categories.map((c) => (
                    <button
                      key={c.slug}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectCategory(c);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-[#143527] text-[#143527] hover:text-white border border-[#D5CDC0] rounded-[2px] text-[12px] font-medium transition-colors cursor-pointer"
                    >
                      <span>{c.name}</span>
                      <ArrowRight className="w-3 h-3 opacity-60" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Services & Quick Links */}
            {searchResults.quickLinks.length > 0 && (
              <div className="p-3 bg-white">
                <span className="text-[10px] font-semibold text-[#869E90] uppercase tracking-wider block mb-1.5">
                  Services & Quick Links
                </span>
                <div className="space-y-1">
                  {searchResults.quickLinks.map((l) => (
                    <button
                      key={l.href}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectLink(l.href);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded hover:bg-[#F7F4EE] text-left transition-colors cursor-pointer group"
                    >
                      <span className="text-[12.5px] font-medium text-[#143527] group-hover:text-[#B85D38]">
                        {l.title}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#869E90] group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Products */}
            {searchResults.products.length > 0 && (
              <div className="p-3 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold text-[#143527] uppercase tracking-wider">
                    Products ({searchResults.allMatchingProductCount})
                  </span>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSearchSubmit(e);
                    }}
                    className="text-[11.5px] text-[#B85D38] hover:underline font-medium cursor-pointer"
                  >
                    View all in Shop
                  </button>
                </div>
                <div className="space-y-1.5">
                  {searchResults.products.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectProduct(p.slug);
                      }}
                      className="w-full flex items-center gap-3 p-2 rounded hover:bg-[#F7F4EE] text-left transition-colors cursor-pointer group"
                    >
                      <div className="relative w-10 h-10 rounded overflow-hidden bg-[#E8E2D6] shrink-0 border border-[#D5CDC0]/60">
                        <Image
                          src={p.imageUrl}
                          alt={p.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[13px] font-medium text-[#143527] truncate group-hover:text-[#B85D38] transition-colors">
                          {p.name}
                        </h4>
                        <p className="text-[11px] text-[#6A736C] font-light">
                          {p.categoryName}
                        </p>
                      </div>
                      <span className="text-[12.5px] font-semibold text-[#143527] shrink-0">
                        ৳{p.price.toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom View All Footer */}
            <div className="p-3 bg-[#FAF7F2] text-center">
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSearchSubmit(e);
                }}
                className="inline-flex items-center gap-2 text-[12.5px] font-medium text-[#143527] hover:text-[#B85D38] transition-colors cursor-pointer"
              >
                <span>View all {searchResults.allMatchingProductCount} matching finds in Shop</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        ) : (
          <div className="p-6 text-center bg-white">
            <p className="text-[13px] text-[#143527] font-medium mb-1">
              No direct matches for &ldquo;{searchQuery}&rdquo;
            </p>
            <p className="text-[12px] text-[#6A736C] font-light mb-3">
              Press Enter to search the catalog or explore our collection categories.
            </p>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSearchSubmit(e);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#143527] text-white text-[12px] font-medium rounded-[2px] cursor-pointer hover:bg-[#1B4332] transition-colors"
            >
              <span>Search in Shop</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="w-full bg-[#F7F4EE] z-40 sticky top-0 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <React.Suspense fallback={null}>
        <SearchParamsSync onSync={(q) => setSearchQuery(q)} />
      </React.Suspense>

      {/* 1. Top Announcement Bar */}
      <div className="bg-[#133829] text-[#DCE5DF] py-2 border-b border-[#0F2D21]">
        <div className="max-w-[1524px] mx-auto px-5 flex items-center justify-between text-[11px] sm:text-[12px] font-normal tracking-wide">
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
        <div className="max-w-[1524px] mx-auto px-5 py-3.5 sm:py-4 lg:py-5 flex items-center justify-between gap-3 sm:gap-6 lg:gap-10">
          {/* Mobile & Tablet Menu Button with Smooth Icon Transition */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 -ml-1 text-[#143527] hover:bg-[#EFE8DC] rounded-xs focus:outline-none cursor-pointer transition-colors"
            aria-label="Toggle navigation menu"
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              <span
                className={`absolute transition-all duration-300 ease-in-out transform ${
                  isMobileMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-75"
                }`}
              >
                <X className="h-6 w-6" />
              </span>
              <span
                className={`absolute transition-all duration-300 ease-in-out transform ${
                  !isMobileMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"
                }`}
              >
                <Menu className="h-6 w-6" />
              </span>
            </div>
          </button>

          {/* Brand Logo / Title */}
          <div className="shrink-0 flex items-center justify-center flex-1 lg:flex-initial">
            <Link href="/" className="group flex items-center gap-2">
              <span className="font-serif text-[18px] sm:text-[22px] lg:text-[24px] font-normal tracking-[0.14em] text-[#143527] uppercase">
                SHOILPIKKABBO
              </span>
            </Link>
          </div>

          {/* Center: Global Search Bar (Desktop only, lg+) */}
          <div
            ref={desktopSearchRef}
            className="hidden lg:flex flex-1 max-w-[540px] mx-auto relative"
          >
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative w-full flex items-center bg-[#F7F4EE] border border-[#D5CDC0] rounded-[2px] transition-all focus-within:border-[#143527] focus-within:bg-white focus-within:shadow-sm">
                <div className="pl-4 pr-2.5 flex items-center pointer-events-none">
                  <Search className="w-[18px] h-[18px] text-[#243B2D]" strokeWidth={1.8} />
                </div>
                <input
                  type="text"
                  placeholder="Search products, categories & services"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsDesktopDropdownOpen(true);
                  }}
                  onFocus={() => {
                    if (searchQuery.trim().length > 0) setIsDesktopDropdownOpen(true);
                  }}
                  className="w-full h-11 pr-8 bg-transparent text-[13.5px] text-[#143527] placeholder:text-[#6F7670] placeholder:font-normal focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setIsDesktopDropdownOpen(false);
                    }}
                    className="absolute right-3 p-1 text-[#869E90] hover:text-[#143527] cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>

            {/* Desktop Live Dropdown */}
            {isDesktopDropdownOpen && renderDropdown()}
          </div>

          {/* Right: Actions */}
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

        {/* 2b. Full-Width Search Bar on Mobile & Tablet (< lg) */}
        <div
          ref={mobileSearchRef}
          className="lg:hidden px-4 sm:px-8 py-2.5 bg-[#FAF7F2] border-t border-[#EAE3D5]/80 relative"
        >
          <form onSubmit={handleSearchSubmit} className="relative max-w-[768px] mx-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6F7670]" strokeWidth={1.8} />
            <input
              type="text"
              placeholder="Search products, categories & services"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsMobileDropdownOpen(true);
              }}
              onFocus={() => {
                if (searchQuery.trim().length > 0) setIsMobileDropdownOpen(true);
              }}
              className="w-full h-10 pl-10 pr-9 rounded-[2px] border border-[#D5CDC0] bg-white text-[12.5px] sm:text-[13px] text-[#143527] placeholder:text-[#6F7670] focus:outline-none focus:border-[#143527]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setIsMobileDropdownOpen(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#869E90] hover:text-[#143527]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Mobile Live Dropdown */}
          {isMobileDropdownOpen && (
            <div className="max-w-[768px] mx-auto relative">
              {renderDropdown()}
            </div>
          )}
        </div>
      </div>

      {/* 3. Secondary Category Bar */}
      <nav className="border-b border-[#EAE3D5] bg-[#F7F4EE] overflow-x-auto scrollbar-none">
        <div className="max-w-[1524px] mx-auto px-5 flex items-center justify-start lg:justify-between gap-5 sm:gap-7 lg:gap-0 py-2.5 sm:py-3 text-[12.5px] sm:text-[13.5px] whitespace-nowrap min-w-max lg:min-w-0">
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

      {/* Mobile Menubar Dropdown with smooth slow height, opacity, and backdrop transition */}
      <div
        className={`lg:hidden grid transition-all duration-500 ease-in-out border-b bg-[#F7F4EE] ${
          isMobileMenuOpen
            ? "grid-rows-[1fr] opacity-100 border-[#EAE3D5]"
            : "grid-rows-[0fr] opacity-0 pointer-events-none border-transparent"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pt-5 pb-8 space-y-4">
            <div className="space-y-2 text-sm text-[#243329] font-medium divide-y divide-[#EAE3D5]/60">
              <div className="flex flex-col space-y-3">
                <Link
                  href="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-[#B85D38] transition-colors"
                >
                  Shop all
                </Link>
                <Link
                  href="/shop?category=handicraft"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-[#B85D38] transition-colors"
                >
                  Handicrafts
                </Link>
                <Link
                  href="/shop?category=jute-items"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-[#B85D38] transition-colors"
                >
                  Jute Items
                </Link>
                <Link
                  href="/shop?category=corporate-gift-items"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-[#B85D38] transition-colors"
                >
                  Gifting
                </Link>
                <Link
                  href="/services"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-[#B85D38] transition-colors"
                >
                  Services
                </Link>
              </div>

              <div className="pt-3.5 flex flex-col space-y-3">
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
                  className="hover:text-[#B85D38] transition-colors"
                >
                  About us
                </Link>
                <Link
                  href="/careers"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-[#B85D38] transition-colors"
                >
                  Career
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-[#B85D38] transition-colors"
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
        </div>
      </div>

      {/* Dimmed backdrop when mobile menubar is open */}
      <div
        className={`lg:hidden fixed inset-0 top-[110px] bg-black/40 backdrop-blur-xs z-30 transition-opacity duration-500 ease-in-out ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
}
