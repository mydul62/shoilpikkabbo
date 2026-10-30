"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  LogOut,
  Package,
  ShieldCheck,
  Heart,
  Phone,
  Mail,
  Truck,
  ShoppingCart,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import { useWishlist } from "@/context/WishlistContext";
import { MOCK_PRODUCTS } from "@/data/mock-data";
import { API_BASE } from "@/lib/api";

export interface MegaMenuCategory {
  name: string;
  slug: string;
  matchNames: string[];
  subtitle: string;
  tagline: string;
  iconImg: string;
  href?: string;
  badge?: string;
}

export const MEGA_MENU_CATEGORIES: MegaMenuCategory[] = [
  {
    name: "Handicrafts",
    slug: "handicraft",
    matchNames: ["handicraft", "handicrafts", "artisan"],
    subtitle: "Pottery, Nakshi Kantha & Brass",
    tagline: "Authentic traditional crafts hand-molded by rural Bengali master artisans.",
    iconImg: "/images/client-mockup/cat-handicrafts.png",
    badge: "Heritage",
  },
  {
    name: "Jute Items",
    slug: "jute-items",
    matchNames: ["jute", "jute items", "golden fiber"],
    subtitle: "Bags, Baskets & Eco Living",
    tagline: "Eco-friendly golden fiber products for modern sustainable living and home decor.",
    iconImg: "/images/client-mockup/cat-jute.png",
    badge: "Eco",
  },
  {
    name: "Polymer",
    slug: "polymer",
    matchNames: ["polymer", "plastic", "containers"],
    subtitle: "Jars, Bottles & Crates",
    tagline: "Durable food-grade polymer utility ware, sports bottles and industrial containers.",
    iconImg: "/images/client-mockup/cat-polymer.png",
  },
  {
    name: "Baby Items",
    slug: "baby-items",
    matchNames: ["baby", "baby items", "kids"],
    subtitle: "Swaddles, Bibs & Rattles",
    tagline: "Ultra-soft combed cotton swaddles and handmade child-safe nursery essentials.",
    iconImg: "/images/client-mockup/cat-baby.png",
  },
  {
    name: "Corporate Gift Items",
    slug: "corporate-gift-items",
    matchNames: ["corporate", "corporate gift items", "executive gifts"],
    subtitle: "Diaries, Flasks & Gift Boxes",
    tagline: "Sophisticated executive gifting sets with custom logo engraving and premium boxes.",
    iconImg: "/images/client-mockup/cat-corporate.png",
    badge: "Custom",
  },
  {
    name: "Rudiment Garments",
    slug: "rudiment-garments",
    matchNames: ["garments", "rudiment garments", "apparel", "clothing"],
    subtitle: "Cotton Tees, Polo & Knitwear",
    tagline: "Export-quality combed cotton everyday apparel, tees, polo shirts and hoodies.",
    iconImg: "/images/client-mockup/cat-garments.png",
  },
  {
    name: "Industrial Solutions",
    slug: "industrial-solutions",
    matchNames: ["industrial", "industrial solutions", "safety"],
    subtitle: "Safety Gear, Helmets & Spares",
    tagline: "Certified protective industrial gear, eye safety glasses, and workplace equipment.",
    iconImg: "/images/client-mockup/cat-industrial.png",
  },
  {
    name: "Health & Beauty",
    slug: "health-and-beauty",
    matchNames: ["health", "beauty", "health & beauty", "cosmetics"],
    subtitle: "Organic Skincare & Herbal Glow",
    tagline: "Pure natural remedies, herbal beauty formulations and glow-enhancing serums.",
    iconImg: "/images/client-mockup/cat-beauty.png",
  },
  {
    name: "Agriculture",
    slug: "agriculture",
    matchNames: ["agriculture", "farming", "organic honey"],
    subtitle: "Bio-Fertilizers & Pure Honey",
    tagline: "Nutrient-rich organic vermicompost fertilizers and raw Sundarban bee honey.",
    iconImg: "/images/client-mockup/cat-agriculture.png",
  },
  {
    name: "Special E-Sheba & Services",
    slug: "special-e-sheba",
    matchNames: ["special e-sheba / services", "service", "sheba", "special-services"],
    subtitle: "Institutional Orders & Inquiries",
    tagline: "Bespoke corporate gifting, custom bulk procurement, and tailored client consultations.",
    iconImg: "/images/client-mockup/cat-services.png",
    href: "/services",
    badge: "Bespoke",
  },
];

const SEARCH_CATEGORIES = MEGA_MENU_CATEGORIES.map((c) => ({
  name: c.name,
  slug: c.slug,
  href: c.href,
}));

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
  const pathname = usePathname();

  const NAV_LINKS = React.useMemo(
    () => [
      { label: "Home", href: "/", exact: true },
      { label: "Offers", href: "/offers", badge: "Hot" },
      { label: "Services", href: "/services" },
      { label: "About Us", href: "/about" },
      { label: "Career", href: "/careers", altHrefs: ["/career"] },
      { label: "Contact Us", href: "/contact" },
    ],
    []
  );

  const isLinkActive = React.useCallback(
    (item: { href: string; exact?: boolean; altHrefs?: string[] }) => {
      if (!pathname) return false;
      if (item.exact) {
        return pathname === item.href;
      }
      if (pathname === item.href || pathname.startsWith(item.href + "/")) {
        return true;
      }
      if (item.altHrefs && item.altHrefs.some((h) => pathname === h || pathname.startsWith(h + "/"))) {
        return true;
      }
      return false;
    },
    [pathname]
  );
  const { totalItemCount, setIsCartOpen } = useCart();
  const { totalWishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const { settings } = useSettings();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = React.useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isCategoriesMenuOpen, setIsCategoriesMenuOpen] = React.useState(false);
  const [activeMegaCategory, setActiveMegaCategory] = React.useState<string>("handicraft");
  const [catalogProducts, setCatalogProducts] = React.useState<any[]>(MOCK_PRODUCTS);

  const desktopSearchRef = React.useRef<HTMLDivElement>(null);
  const mobileSearchRef = React.useRef<HTMLDivElement>(null);
  const userMenuRef = React.useRef<HTMLDivElement>(null);
  const categoriesMenuRef = React.useRef<HTMLDivElement>(null);

  // Fetch live products for accurate global search
  React.useEffect(() => {
    let isMounted = true;
    fetch(`${API_BASE}/products?limit=100`)
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
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
      if (
        categoriesMenuRef.current &&
        !categoriesMenuRef.current.contains(e.target as Node)
      ) {
        setIsCategoriesMenuOpen(false);
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
        setIsUserMenuOpen(false);
        setIsCategoriesMenuOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent body scroll when mobile navigation drawer is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileMenuOpen]);

  // Current active category and filtered products for Flyout Mega-Menu
  const currentMegaCategory = React.useMemo(() => {
    return (
      MEGA_MENU_CATEGORIES.find((c) => c.slug === activeMegaCategory) ||
      MEGA_MENU_CATEGORIES[0]
    );
  }, [activeMegaCategory]);

  const activeCategoryProducts = React.useMemo(() => {
    if (!currentMegaCategory) return [];
    const matches = currentMegaCategory.matchNames.map((m) => m.toLowerCase());
    return catalogProducts
      .filter((p) => {
        const pCat = (p.categoryName || "").toLowerCase();
        const pName = (p.name || "").toLowerCase();
        return matches.some((m) => pCat.includes(m) || pName.includes(m));
      })
      .slice(0, 3);
  }, [catalogProducts, currentMegaCategory]);

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
  };  return (
    <header className="w-full bg-white z-40 sticky top-0 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <React.Suspense fallback={null}>
        <SearchParamsSync onSync={(q) => setSearchQuery(q)} />
      </React.Suspense>

      {/* 1. Top Bar (Dark Teal #0D3B37) */}
      <div className="bg-[#0D3B37] text-white/90 py-1.5 sm:py-2 border-b border-[#0A2F2C] overflow-hidden">
        <div className="max-w-[1524px] mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between text-xs sm:text-[13px] gap-2">
          {/* Left Contact Info & Announcement */}
          <div className="flex items-center gap-2 sm:gap-4 truncate">
            <a
              href={`mailto:${settings.contactEmail}`}
              className="hidden md:flex items-center gap-1.5 hover:text-orange-300 transition-colors font-medium shrink-0"
            >
              <Mail className="w-3.5 h-3.5 text-white/90" />
              <span>{settings.contactEmail}</span>
            </a>
            <span className="hidden md:inline text-white/30">|</span>
            <a
              href={`tel:${settings.contactPrimary}`}
              className="flex items-center gap-1.5 hover:text-orange-300 transition-colors font-medium shrink-0"
            >
              <Phone className="w-3.5 h-3.5 text-white/90 shrink-0" />
              <span className="truncate">
                {settings.contactPrimary}
                {settings.contactSecondary ? (
                  <span className="hidden sm:inline">, {settings.contactSecondary}</span>
                ) : null}
              </span>
            </a>
            {settings.headerAnnouncementEnabled && settings.headerAnnouncement && (
              <>
                <span className="hidden lg:inline text-white/30">|</span>
                <span className="hidden lg:inline text-amber-200/90 font-medium text-xs truncate max-w-[320px]">
                  ✨ {settings.headerAnnouncement}
                </span>
              </>
            )}
          </div>

          {/* Right Links */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/track-order"
              className="flex items-center gap-1.5 hover:text-orange-300 transition-colors text-xs sm:text-[13px] text-white/90 font-medium"
            >
              <Truck className="w-3.5 h-3.5 text-white/90" />
              <span>Track Order</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Header Row (Clean White Background) */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1524px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-3 sm:gap-6 lg:gap-10">
          {/* Mobile Menu Button with Smooth Icon Transition */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 -ml-1 text-[#0D3B37] hover:bg-gray-100 rounded-lg focus:outline-none cursor-pointer transition-colors"
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

          {/* Brand Logo matching Client Mockup or Custom Dynamic Store Logo */}
          <div className="shrink-0 flex items-center justify-center flex-1 lg:flex-initial">
            <Link href="/" className="group flex items-center">
              {settings.logoUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={settings.logoUrl}
                  alt={settings.storeNameBn || settings.storeName}
                  className="h-11 sm:h-13 md:h-14 w-auto max-w-[260px] object-contain hover:opacity-95 transition-opacity"
                />
              ) : (
                <Image
                  src="/images/client-mockup/logo-brand-exact.png"
                  alt={`${settings.storeName} - ${settings.tagline}`}
                  width={250}
                  height={62}
                  priority
                  className="h-10 sm:h-12 w-auto object-contain hover:opacity-95 transition-opacity"
                />
              )}
            </Link>
          </div>

          {/* Center: Global Search Bar with Attached Orange Button (Desktop only, lg+) */}
          <div
            ref={desktopSearchRef}
            className="hidden lg:flex flex-1 max-w-[580px] mx-auto relative"
          >
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative w-full flex items-center bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl transition-all focus-within:border-[#E0592A] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#E0592A]/10 overflow-hidden shadow-2xs">
                <input
                  type="text"
                  placeholder="Search for products, categories..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsDesktopDropdownOpen(true);
                  }}
                  onFocus={() => {
                    if (searchQuery.trim().length > 0) setIsDesktopDropdownOpen(true);
                  }}
                  className="w-full h-11 pl-4 pr-10 bg-transparent text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setIsDesktopDropdownOpen(false);
                    }}
                    className="p-1 mr-1 text-[#9CA3AF] hover:text-[#111827] cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="h-11 px-5 bg-[#E0592A] hover:bg-[#C94B20] text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" strokeWidth={2.2} />
                </button>
              </div>
            </form>

            {/* Desktop Live Dropdown */}
            {isDesktopDropdownOpen && renderDropdown()}
          </div>

          {/* Right: Actions (Login/Register, Wishlist, Cart) */}
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 shrink-0">
            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 text-sm text-[#0D3B37] hover:text-[#E0592A] transition-colors font-medium group cursor-pointer"
                  title="My Account"
                  aria-label="My Account"
                >
                  <div className="w-9 h-9 rounded-full bg-[#0D3B37] text-white flex items-center justify-center text-xs font-bold uppercase shadow-2xs">
                    {user.name ? user.name.charAt(0) : "U"}
                  </div>
                  <div className="hidden lg:flex flex-col items-start leading-tight">
                    <span className="text-[10.5px] text-gray-400 font-normal">Welcome,</span>
                    <span className="font-semibold text-sm text-[#0D3B37] max-w-[120px] truncate">
                      {user.name.split(" ")[0]}
                    </span>
                  </div>
                  <ChevronDown className={`hidden lg:inline w-3.5 h-3.5 text-gray-400 group-hover:text-[#0D3B37] transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Account Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-60 rounded-xl bg-white border border-gray-100 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-[11px] text-gray-400 font-normal">Signed in as</p>
                      <p className="text-sm font-semibold text-[#0D3B37] truncate mt-0.5">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.phone || user.email}</p>
                    </div>

                    <div className="py-1.5 text-sm text-gray-700">
                      <Link
                        href="/account"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-[#FAF8F3] hover:text-[#E0592A] transition-colors"
                      >
                        <User className="w-4 h-4 text-gray-400" />
                        <span>My Profile & Orders</span>
                      </Link>

                      <Link
                        href="/track-order"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-[#FAF8F3] hover:text-[#E0592A] transition-colors"
                      >
                        <Package className="w-4 h-4 text-gray-400" />
                        <span>Track My Order</span>
                      </Link>

                      {(user.role === "ADMIN" || user.role === "SUPER_ADMIN" || user.role === "STAFF") && (
                        <Link
                          href="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 font-semibold text-[#0D3B37] hover:bg-[#FAF8F3] hover:text-[#E0592A] transition-colors border-t border-gray-100"
                        >
                          <ShieldCheck className="w-4 h-4 text-[#0D3B37]" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={async () => {
                          setIsUserMenuOpen(false);
                          await logout();
                          router.push("/");
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#E0592A] transition-colors font-semibold group"
                title="Login / Register"
              >
                <User className="w-5 h-5 text-[#0D3B37] group-hover:text-[#E0592A] transition-colors" strokeWidth={1.8} />
                <span className="hidden lg:inline">Login / Register</span>
              </Link>
            )}

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#E0592A] transition-colors font-semibold group relative cursor-pointer"
              title="View Wishlist"
              aria-label="Wishlist"
            >
              <div className="relative flex items-center">
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    totalWishlistCount > 0
                      ? "text-[#E0592A] fill-[#E0592A]"
                      : "text-[#0D3B37] group-hover:text-[#E0592A]"
                  }`}
                  strokeWidth={1.8}
                />
                {totalWishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#E0592A] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                    {totalWishlistCount}
                  </span>
                )}
              </div>
              <span className="hidden lg:inline">Wishlist</span>
            </Link>

            {/* Cart Button with Cart Icon & Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 text-sm text-[#0D3B37] hover:text-[#E0592A] transition-colors font-bold cursor-pointer group"
              aria-label="Open Cart"
            >
              <div className="relative flex items-center">
                <ShoppingCart className="w-5 h-5 text-[#0D3B37] group-hover:text-[#E0592A] transition-colors" strokeWidth={1.8} />
                <span className="absolute -top-2 -right-2 bg-[#E0592A] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                  {totalItemCount}
                </span>
              </div>
              <span className="hidden lg:inline text-sm font-bold text-[#0D3B37] group-hover:text-[#E0592A]">Cart</span>
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Full-Width Search Bar */}
        <div
          ref={mobileSearchRef}
          className="lg:hidden px-4 sm:px-6 py-3 bg-[#FAF8F5] border-t border-gray-100 relative"
        >
          <form onSubmit={handleSearchSubmit} className="relative max-w-[768px] mx-auto flex items-center">
            <div className="relative w-full flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs focus-within:border-[#E0592A]">
              <input
                type="text"
                placeholder="Search for products, categories..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsMobileDropdownOpen(true);
                }}
                onFocus={() => {
                  if (searchQuery.trim().length > 0) setIsMobileDropdownOpen(true);
                }}
                className="w-full h-11 pl-4 pr-9 bg-transparent text-sm text-[#111827] placeholder:text-gray-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setIsMobileDropdownOpen(false);
                  }}
                  className="p-1 mr-1 text-gray-400 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="h-11 px-4 bg-[#E0592A] hover:bg-[#C94B20] text-white flex items-center justify-center transition-colors shrink-0"
              >
                <Search className="w-4 h-4" strokeWidth={2.2} />
              </button>
            </div>
          </form>

          {/* Mobile Live Dropdown */}
          {isMobileDropdownOpen && (
            <div className="max-w-[768px] mx-auto relative">
              {renderDropdown()}
            </div>
          )}
        </div>
      </div>

      {/* 3. Navigation Bar (All Categories Button + Centered Links - Hidden on small devices) */}
      <nav className="hidden md:block border-b border-gray-100 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="max-w-[1524px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 sm:gap-8 lg:gap-10 py-2.5">
          {/* All Categories Dropdown Button & Flyout Mega-Menu (Option 2: Daraz / Amazon Style) */}
          <div className="relative shrink-0" ref={categoriesMenuRef}>
            <button
              type="button"
              onClick={() => setIsCategoriesMenuOpen(!isCategoriesMenuOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#E0592A] hover:bg-[#C94B20] text-white rounded-xl font-bold text-sm tracking-wide transition-all shadow-xs cursor-pointer select-none"
              aria-expanded={isCategoriesMenuOpen}
            >
              <Menu className="w-4 h-4 stroke-[2.2]" />
              <span>All Categories</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isCategoriesMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Flyout Mega-Menu Dropdown */}
            {isCategoriesMenuOpen && (
              <div className="absolute left-0 top-full mt-2 w-[860px] lg:w-[920px] xl:w-[960px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.16)] border border-gray-100 overflow-hidden flex z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* Left Column: Categories List */}
                <div className="w-[295px] shrink-0 bg-[#FAF9F6] border-r border-gray-100 p-2 flex flex-col justify-between">
                  <div className="space-y-0.5">
                    {MEGA_MENU_CATEGORIES.map((cat) => {
                      const isActive = activeMegaCategory === cat.slug;
                      return (
                        <Link
                          key={cat.slug}
                          href={cat.href || `/shop?category=${cat.slug}`}
                          onMouseEnter={() => setActiveMegaCategory(cat.slug)}
                          onClick={() => setIsCategoriesMenuOpen(false)}
                          className={`group flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-all duration-150 ${
                            isActive
                              ? "bg-white text-[#E0592A] shadow-[0_2px_8px_rgba(224,89,42,0.12)] border border-[#E0592A]/25"
                              : "text-gray-700 hover:bg-white/70 hover:text-[#E0592A] border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center p-1 shrink-0 transition-colors ${
                                isActive
                                  ? "bg-[#FFF4EE] border border-[#E0592A]/30"
                                  : "bg-white border border-gray-200/60 group-hover:border-[#E0592A]/30"
                              }`}
                            >
                              <Image
                                src={cat.iconImg}
                                alt={cat.name}
                                width={22}
                                height={22}
                                className="object-contain"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`text-[12.5px] font-bold truncate leading-tight ${
                                    isActive ? "text-[#E0592A]" : "text-gray-800"
                                  }`}
                                >
                                  {cat.name}
                                </span>
                                {cat.badge && (
                                  <span
                                    className={`text-[8.5px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wide ${
                                      isActive
                                        ? "bg-[#E0592A] text-white"
                                        : "bg-[#E0592A]/10 text-[#E0592A]"
                                    }`}
                                  >
                                    {cat.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10.5px] text-gray-400 font-normal truncate mt-0.5">
                                {cat.subtitle}
                              </p>
                            </div>
                          </div>
                          <ArrowRight
                            className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                              isActive
                                ? "text-[#E0592A] translate-x-0.5"
                                : "text-gray-300 group-hover:text-[#E0592A]"
                            }`}
                          />
                        </Link>
                      );
                    })}
                  </div>

                  {/* Left Column Bottom Action */}
                  <div className="pt-2 mt-2 border-t border-gray-200/60">
                    <Link
                      href="/shop"
                      onClick={() => setIsCategoriesMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 text-xs font-bold text-[#143527] bg-white rounded-xl hover:bg-[#143527] hover:text-white transition-colors border border-gray-200/80 shadow-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Package className="w-3.5 h-3.5 text-[#E0592A]" />
                        <span>Browse All Products</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Right Column: Dynamic Preview Panel */}
                <div className="flex-1 p-5 lg:p-6 bg-white flex flex-col justify-between min-h-[490px]">
                  {/* Category Header */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
                    <div className="min-w-0 pr-4">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg lg:text-xl font-extrabold text-gray-900 tracking-tight truncate">
                          {currentMegaCategory.name}
                        </h3>
                        {currentMegaCategory.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E0592A]/10 text-[#E0592A] uppercase">
                            {currentMegaCategory.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {currentMegaCategory.tagline}
                      </p>
                    </div>
                    <Link
                      href={currentMegaCategory.href || `/shop?category=${currentMegaCategory.slug}`}
                      onClick={() => setIsCategoriesMenuOpen(false)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#E0592A] bg-[#FFF4EE] hover:bg-[#E0592A] hover:text-white transition-colors shrink-0"
                    >
                      <span>Explore All</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Body Content */}
                  {currentMegaCategory.slug === "special-e-sheba" ? (
                    <div className="my-auto py-2 space-y-3.5">
                      {/* Institutional Custom Banner */}
                      <div className="rounded-2xl p-4 lg:p-5 bg-gradient-to-br from-[#143527] via-[#0E281C] to-[#0A1B13] text-white relative overflow-hidden shadow-md">
                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1.5 max-w-md">
                            <span className="inline-block px-2.5 py-0.5 bg-[#E0592A] text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                              Institutional & Corporate Solutions
                            </span>
                            <h4 className="text-base lg:text-lg font-bold text-white leading-snug">
                              Need Bespoke Corporate Gifts or Bulk Sourcing?
                            </h4>
                            <p className="text-xs text-emerald-100/80 leading-relaxed">
                              Custom logo branding on jute & leatherette, direct artisan procurement with bulk wholesale rates, and dedicated support.
                            </p>
                          </div>
                          <Link
                            href="/services"
                            onClick={() => setIsCategoriesMenuOpen(false)}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#E0592A] hover:bg-[#C94B20] text-white text-xs font-bold rounded-xl transition-all shadow-md shrink-0 self-start sm:self-center"
                          >
                            <span>Service Inquiry</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>

                      {/* 3 Featured Products in this Category */}
                      <div className="grid grid-cols-3 gap-3">
                        {activeCategoryProducts.map((prod) => (
                          <Link
                            key={prod.id}
                            href={`/products/${prod.slug}`}
                            onClick={() => setIsCategoriesMenuOpen(false)}
                            className="group/prod flex items-center gap-2.5 p-2 rounded-xl border border-gray-100 hover:border-[#E0592A]/40 hover:bg-[#FAF8F3] transition-all bg-white shadow-xs"
                          >
                            <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden relative shrink-0 border border-gray-100">
                              <Image
                                src={prod.imageUrl || "/images/product-jute-basket.png"}
                                alt={prod.name}
                                fill
                                className="object-cover group-hover/prod:scale-105 transition-transform duration-200"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-gray-800 truncate group-hover/prod:text-[#E0592A] transition-colors">
                                {prod.name}
                              </p>
                              <p className="text-[11px] font-extrabold text-[#E0592A] mt-0.5">
                                ৳{Number(prod.price).toLocaleString()}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="my-auto py-2">
                      <div className="grid grid-cols-3 gap-3.5">
                        {activeCategoryProducts.map((prod) => {
                          const discount =
                            prod.salePrice && prod.price > prod.salePrice
                              ? Math.round(((prod.price - prod.salePrice) / prod.price) * 100)
                              : null;
                          return (
                            <Link
                              key={prod.id}
                              href={`/products/${prod.slug}`}
                              onClick={() => setIsCategoriesMenuOpen(false)}
                              className="group/card flex flex-col rounded-xl p-2.5 border border-gray-100 hover:border-[#E0592A]/30 hover:shadow-lg transition-all duration-200 bg-white"
                            >
                              <div className="relative aspect-square w-full rounded-lg bg-[#F8F7F4] overflow-hidden mb-2 border border-gray-100/70">
                                <Image
                                  src={prod.imageUrl || "/images/product-jute-basket.png"}
                                  alt={prod.name}
                                  fill
                                  className="object-cover group-hover/card:scale-105 transition-transform duration-300"
                                />
                                {discount && (
                                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-[#EF4444] text-white text-[9.5px] font-black rounded-md shadow-xs">
                                    -{discount}%
                                  </span>
                                )}
                              </div>
                              <h5 className="text-xs font-bold text-gray-800 line-clamp-2 leading-snug group-hover/card:text-[#E0592A] transition-colors mb-1 min-h-[32px]">
                                {prod.name}
                              </h5>
                              <div className="flex items-center gap-1.5 mt-auto">
                                <span className="text-xs font-black text-[#E0592A]">
                                  ৳{Number(prod.salePrice || prod.price).toLocaleString()}
                                </span>
                                {prod.salePrice && prod.price > prod.salePrice && (
                                  <span className="text-[10.5px] text-gray-400 line-through">
                                    ৳{Number(prod.price).toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Trust Footer Strip */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>100% Authentic Handcrafted</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#E0592A]" />
                      <span>Nationwide Delivery</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified Quality Guarantee</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Horizontal Menu Links with Dynamic Active Route & Underline Indicator */}
          <div className="hidden md:flex items-center gap-7 lg:gap-9 text-sm font-semibold">
            {NAV_LINKS.map((item) => {
              const active = isLinkActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-1.5 transition-all pb-1 border-b-2 ${
                    active
                      ? "text-[#804A3E] font-bold border-[#804A3E]"
                      : "text-gray-700 hover:text-[#804A3E] hover:border-[#804A3E]/30 border-transparent font-semibold"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 bg-[#EF4444] text-white text-[9.5px] font-bold rounded-full uppercase leading-tight animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* Modern Slide-Over Mobile Navigation Drawer (from the Left) */}
      {/* ========================================================================= */}
      <div
        className={`lg:hidden fixed inset-0 z-50 overflow-hidden transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? "visible pointer-events-auto" : "invisible pointer-events-none delay-500"
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        {/* Full-Screen Dimmed Backdrop */}
        <div
          className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-500 ease-in-out ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Drawer Panel Sliding in from the Left */}
        <div
          className={`fixed inset-y-0 left-0 w-[84vw] max-w-[340px] bg-[#FAF7F2] shadow-2xl flex flex-col border-r border-[#EAE3D5] transform transition-transform duration-500 ease-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE3D5] bg-[#F7F4EE]">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2"
            >
              {settings.logoUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={settings.logoUrl}
                  alt={settings.storeName}
                  className="h-9 w-auto max-w-[180px] object-contain"
                />
              ) : (
                <span className="font-serif text-lg font-normal tracking-[0.14em] text-[#143527] uppercase">
                  {settings.storeNameBn || settings.storeName}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 -mr-1 text-[#143527] hover:bg-[#EAE3D5] rounded-xs transition-colors cursor-pointer"
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {/* User Profile Banner in Mobile Drawer */}
            {isAuthenticated && user ? (
              <div className="bg-[#F7F4EE] rounded-xl p-3.5 border border-[#EAE3D5] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#143527] text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#143527] truncate">{user.name}</p>
                      <p className="text-xs text-[#7A837C] truncate">{user.phone || user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      setIsMobileMenuOpen(false);
                      await logout();
                      router.push("/");
                    }}
                    className="text-xs text-red-600 font-medium hover:underline shrink-0 ml-2 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>

                <div className="pt-2 border-t border-[#EAE3D5]/80 flex items-center justify-between text-xs">
                  <Link
                    href="/account"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[#143527] font-semibold hover:text-[#E0592A] flex items-center gap-1.5 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-[#B85D38]" />
                    <span>My Profile & Orders</span>
                  </Link>
                  {(user.role === "ADMIN" || user.role === "SUPER_ADMIN" || user.role === "STAFF") && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-[#E0592A] font-bold hover:underline flex items-center gap-1 transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Admin</span>
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#143527] text-white text-sm font-medium rounded-lg hover:bg-[#0F261B] transition-colors shadow-xs"
              >
                <User className="w-4 h-4" />
                <span>Sign in to your account</span>
              </Link>
            )}

            {/* Mobile Wishlist Shortcut */}
            <Link
              href="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 bg-[#F7F4EE] hover:bg-white rounded-xl border border-[#EAE3D5] text-sm font-semibold text-[#143527] hover:text-[#E0592A] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Heart className={`w-4 h-4 ${totalWishlistCount > 0 ? "text-[#E0592A] fill-[#E0592A]" : "text-[#143527]"}`} />
                <span>My Wishlist</span>
              </div>
              <div className="flex items-center gap-1.5">
                {totalWishlistCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#E0592A] text-white">
                    {totalWishlistCount}
                  </span>
                ) : (
                  <span className="text-xs text-[#8C948E]">Empty</span>
                )}
                <ArrowRight className="w-3.5 h-3.5 text-[#8C948E]" />
              </div>
            </Link>

            {/* Main Navigation (1:1 with Desktop Navbar) */}
            <div>
              <p className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-[#B85D38] mb-2.5">
                Main Pages
              </p>
              <div className="flex flex-col space-y-1 text-[14.5px] font-medium text-[#143527]">
                {NAV_LINKS.map((item) => {
                  const active = isLinkActive(item);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between py-2 px-2.5 rounded-lg transition-colors border-b border-[#EAE3D5]/40 ${
                        active
                          ? "bg-[#F2ECE1] text-[#804A3E] font-bold border-l-4 border-l-[#804A3E]"
                          : "hover:bg-[#F2ECE1] text-[#143527]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.2 bg-[#EF4444] text-white text-[9px] font-bold rounded-full uppercase leading-tight animate-pulse">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <ArrowRight className={`w-3.5 h-3.5 ${active ? "text-[#804A3E]" : "text-[#8C948E]"}`} />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* All 10 Categories matching Desktop "All Categories" Dropdown */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-[#B85D38]">
                  All Categories ({SEARCH_CATEGORIES.length})
                </p>
                <Link
                  href="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xs font-semibold text-[#E0592A] hover:underline"
                >
                  Shop all &rarr;
                </Link>
              </div>
              <div className="flex flex-col space-y-1 text-[13.5px] text-[#2D3F33] bg-[#F7F4EE] rounded-xl p-2 border border-[#EAE3D5]/70">
                {SEARCH_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={cat.href || `/shop?category=${cat.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-1.5 px-2.5 rounded-md hover:bg-white hover:text-[#E0592A] transition-colors"
                  >
                    <span>{cat.name}</span>
                    <ArrowRight className="w-3 h-3 text-[#A0A7A1]" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Admin Dashboard Quick Access (Only if Admin/Staff logged in) */}
            {isAuthenticated && (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN" || user?.role === "STAFF") && (
              <div className="pt-2 border-t border-[#EAE3D5]">
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 bg-[#0D3B37] text-white rounded-lg text-sm font-semibold hover:bg-[#143527] transition-colors shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[#E0592A]" />
                    <span>Admin Dashboard</span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Drawer Footer with Store Name & Help Link */}
          <div className="p-4 border-t border-[#EAE3D5] bg-[#F7F4EE] flex items-center justify-between text-xs text-[#555A54]">
            <span className="font-semibold text-[#143527]">{settings.storeName}</span>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[#143527] underline font-medium hover:text-[#B85D38] transition-colors"
            >
              Need help?
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
