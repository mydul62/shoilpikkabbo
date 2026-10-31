"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowUpRight, Plus, Check, X, SlidersHorizontal, ChevronLeft, ChevronRight, Sparkles, Star, Heart, ShoppingCart } from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { MOCK_PRODUCTS, MOCK_CATEGORIES, Product } from "@/data/mock-data";
import { API_BASE } from "@/lib/api";
import { getProductDisplayImage } from "@/lib/productImage";

const OFFICIAL_CATEGORIES = [
  { name: "Handicrafts", slug: "handicraft" },
  { name: "Jute Items", slug: "jute-items" },
  { name: "Polymer", slug: "polymer" },
  { name: "Baby Items", slug: "baby-items" },
  { name: "Corporate Gift Items", slug: "corporate-gift-items" },
  { name: "Rudiment Garments", slug: "rudiment-garments" },
  { name: "Industrial Solutions", slug: "industrial-solutions" },
  { name: "Health & Beauty (Cosmetics, Food, Medicine)", slug: "health-and-beauty" },
  { name: "Agriculture", slug: "agriculture" },
  { name: "Special E-Sheba / Services", slug: "special-e-sheba" },
];

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart, setIsCartOpen } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const initialCat = searchParams.get("category");
  const initialQ = searchParams.get("q") || "";

  // State - Default to showing all products without hardcoded mock filters
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    initialCat ? [initialCat] : []
  );
  const [searchQuery, setSearchQuery] = React.useState<string>(initialQ || "");
  const [sortBy, setSortBy] = React.useState<string>("featured");
  const [minPriceInput, setMinPriceInput] = React.useState<string>("0");
  const [maxPriceInput, setMaxPriceInput] = React.useState<string>("10000");
  const [appliedMinPrice, setAppliedMinPrice] = React.useState<number>(0);
  const [appliedMaxPrice, setAppliedMaxPrice] = React.useState<number>(10000);
  const [inStockOnly, setInStockOnly] = React.useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState<boolean>(false);
  const [addedProductId, setAddedProductId] = React.useState<string | null>(null);
  const [liveCategories, setLiveCategories] = React.useState<any[]>([]);

  // Sync with searchParams
  React.useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setSelectedCategories([cat]);
    }
    const q = searchParams.get("q");
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Toggle Category Checkbox
  const toggleCategory = (slug: string) => {
    if (selectedCategories.includes(slug)) {
      setSelectedCategories(selectedCategories.filter((s) => s !== slug));
    } else {
      setSelectedCategories([...selectedCategories, slug]);
    }
  };

  // Remove Category Pill
  const removeCategory = (slug: string) => {
    setSelectedCategories(selectedCategories.filter((s) => s !== slug));
  };

  // Apply Price Filters
  const handleApplyPrice = () => {
    const min = parseFloat(minPriceInput) || 0;
    const max = parseFloat(maxPriceInput) || 100000;
    setAppliedMinPrice(min);
    setAppliedMaxPrice(max);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSearchQuery("");
    setMinPriceInput("0");
    setMaxPriceInput("5000");
    setAppliedMinPrice(0);
    setAppliedMaxPrice(5000);
    setInStockOnly(false);
    setSortBy("featured");
  };

  // Handle Quick Add to Bag
  const handleQuickAdd = (prod: Product) => {
    addToCart(prod, 1);
    setAddedProductId(prod.id);
    setTimeout(() => setAddedProductId(null), 1500);
  };

  const [liveProducts, setLiveProducts] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await fetch(`${API_BASE}/products?limit=100`);
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          const mapped = json.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            categoryId: p.categoryId,
            categoryName: p.category?.name || "Handicraft",
            price: Number(p.price),
            salePrice: p.salePrice ? Number(p.salePrice) : undefined,
            stock: p.stock ?? 25,
            sku: p.sku || `SK-${p.slug}`,
            rating: 5,
            reviewCount: 12,
            imageUrl: getProductDisplayImage(p),
            galleryUrls: p.images?.map((img: any) => img.url) || [],
            description: p.description || p.name,
            specifications: p.specifications || {},
          }));
          setLiveProducts(mapped);
        } else {
          setLiveProducts(MOCK_PRODUCTS);
        }
      } catch (e) {
        setLiveProducts(MOCK_PRODUCTS);
      } finally {
        setIsLoading(false);
      }
    };
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/categories`);
        const json = await res.json();
        if (json.success && json.data) {
          setLiveCategories(json.data);
        }
      } catch (e) {}
    };

    fetchCatalog();
    fetchCategories();
  }, []);

  const catalogProducts = liveProducts;

  // Filter & Sort Products
  const filteredProducts = React.useMemo(() => {
    return catalogProducts.filter((prod) => {
      // Category filter
      if (selectedCategories.length > 0) {
        const matchesCategory = selectedCategories.some((slug) => {
          if (slug === "handicraft") return prod.categoryName.toLowerCase().includes("handicraft");
          if (slug === "jute-items") return prod.categoryName.toLowerCase().includes("jute");
          if (slug === "polymer") return prod.categoryName.toLowerCase().includes("polymer");
          if (slug === "baby-items") return prod.categoryName.toLowerCase().includes("baby");
          if (slug === "corporate-gift-items") return prod.categoryName.toLowerCase().includes("corporate");
          if (slug === "rudiment-garments") return prod.categoryName.toLowerCase().includes("garment");
          if (slug === "industrial-solutions") return prod.categoryName.toLowerCase().includes("industrial");
          if (slug === "health-and-beauty") return prod.categoryName.toLowerCase().includes("health");
          if (slug === "agriculture") return prod.categoryName.toLowerCase().includes("agriculture");
          return false;
        });
        if (!matchesCategory) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inName = prod.name.toLowerCase().includes(q);
        const inCat = prod.categoryName.toLowerCase().includes(q);
        const inDesc = prod.description.toLowerCase().includes(q);
        if (!inName && !inCat && !inDesc) return false;
      }

      // Price filter
      const price = prod.price;
      if (price < appliedMinPrice || price > appliedMaxPrice) {
        return false;
      }

      // In-stock filter
      if (inStockOnly && prod.stock <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "newest") return b.id.localeCompare(a.id);
      return 0; // default featured
    });
  }, [catalogProducts, selectedCategories, searchQuery, appliedMinPrice, appliedMaxPrice, inStockOnly, sortBy]);

  // Pagination: 15 items limit per page, 3 items per row on large devices
  const ITEMS_PER_PAGE = 15;
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  // Reset to page 1 whenever filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, searchQuery, appliedMinPrice, appliedMaxPrice, inStockOnly, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));

  const paginatedProducts = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  // Breadcrumb Category Title
  const activeCategoryTitle =
    selectedCategories.length === 1
      ? OFFICIAL_CATEGORIES.find((c) => c.slug === selectedCategories[0])?.name || "Natural textures"
      : "Natural textures";

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-16">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* 1. Breadcrumbs */}
        <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-4">
          <Link href="/" className="hover:text-[#E0592A] transition-colors">
            Home
          </Link>
          <span className="select-none text-gray-300">/</span>
          <Link href="/shop" className="hover:text-[#E0592A] transition-colors">
            Shop
          </Link>
          <span className="select-none text-gray-300">/</span>
          <span className="text-[#0D3B37] font-bold">{activeCategoryTitle}</span>
        </nav>

        {/* 2. Page Header Banner matching Home Theme */}
        <div className="relative bg-gradient-to-r from-[#0D3B37] to-[#124B46] rounded-3xl p-8 sm:p-10 lg:p-12 text-white mb-8 sm:mb-10 shadow-[0_4px_24px_rgba(13,59,55,0.1)] overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-2">
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#F59E0B] bg-white/10 px-3 py-1 rounded-full border border-white/10">
              AUTHENTIC BANGLADESHI HANDICRAFTS & ESSENTIALS
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Explore Our Collection
            </h1>
            <p className="text-sm sm:text-base text-white/85 font-normal leading-relaxed pt-1">
              Handcrafted jute treasures, traditional pottery, natural foods, and curated lifestyle essentials delivered with care.
            </p>
          </div>
          {/* Subtle Decorative Circle */}
          <div className="absolute -right-16 -bottom-16 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-15 hidden md:block pointer-events-none">
            <Sparkles className="w-48 h-48 text-white" />
          </div>
        </div>

        {/* 3. Catalog Controls Toolbar: Filters Summary, Active Global Search Tag, and Sort */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-[#FAF8F5] hover:bg-[#F3EFE6] text-[#0D3B37] text-xs sm:text-sm font-semibold rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters ({selectedCategories.length + (inStockOnly ? 1 : 0) + (appliedMaxPrice < 10000 ? 1 : 0)})</span>
            </button>

            {/* Results Count */}
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              Showing <span className="font-bold text-[#0D3B37]">{filteredProducts.length}</span> {filteredProducts.length === 1 ? "product" : "products"}
            </p>

            {/* Active Global Search Tag (if searched via Header) */}
            {searchQuery && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#0D3B37] text-white rounded-xl text-xs font-semibold shadow-2xs">
                <span>Search: &ldquo;{searchQuery}&rdquo;</span>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    router.push("/shop");
                  }}
                  className="hover:text-orange-300 p-0.5 cursor-pointer transition-colors"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider whitespace-nowrap">
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 px-4 bg-[#FAF8F5] border border-gray-200 rounded-xl text-xs sm:text-sm text-[#0D3B37] font-semibold focus:outline-none focus:ring-2 focus:ring-[#0D3B37]/15 transition-all cursor-pointer shadow-2xs"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>

        {/* 4. Two-Column Layout (Sidebar + Catalog) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Filter your finds Sidebar (Sticky on Large Devices when scrolling) */}
          <aside
            className={`lg:col-span-3 lg:block lg:sticky lg:top-[170px] lg:self-start lg:max-h-[calc(100vh-190px)] lg:overflow-y-auto scrollbar-thin z-20 ${
              isMobileFilterOpen
                ? "block bg-white p-6 sm:p-7 rounded-3xl shadow-xl mb-6 lg:mb-0"
                : "hidden bg-white p-6 sm:p-7 rounded-3xl shadow-[0_2px_14px_rgba(0,0,0,0.03)]"
            }`}
          >
            <div className="space-y-7">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h2 className="text-lg sm:text-xl font-bold text-[#0D3B37] tracking-tight">
                  Filter Your Finds
                </h2>
                {isMobileFilterOpen && (
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="lg:hidden text-xs text-gray-500 hover:text-gray-900 p-1 rounded-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Block 1: Categories */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3.5">
                  Categories
                </h3>
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                  {(liveCategories.length > 0 ? liveCategories : OFFICIAL_CATEGORIES).map((cat) => {
                    const isChecked = selectedCategories.includes(cat.slug);
                    return (
                      <label
                        key={cat.slug}
                        className="flex items-start gap-3 text-xs sm:text-[13.5px] text-gray-700 hover:text-[#0D3B37] cursor-pointer select-none leading-snug font-medium transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCategory(cat.slug)}
                          className="mt-0.5 w-4 h-4 rounded text-[#0D3B37] focus:ring-0 cursor-pointer accent-[#0D3B37]"
                        />
                        <span className={isChecked ? "font-bold text-[#0D3B37]" : ""}>{cat.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Block 2: Price Range */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Price range - BDT
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-[11px] text-gray-500 font-medium mb-1 block">
                      Min
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-gray-400 font-medium">
                        ৳
                      </span>
                      <input
                        type="number"
                        value={minPriceInput}
                        onChange={(e) => setMinPriceInput(e.target.value)}
                        placeholder="0"
                        className="w-full h-10 pl-7 pr-2 bg-[#FAF8F5] border border-gray-200 rounded-xl text-xs sm:text-sm text-[#0D3B37] font-semibold focus:outline-none focus:border-[#0D3B37] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-500 font-medium mb-1 block">
                      Max
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-gray-400 font-medium">
                        ৳
                      </span>
                      <input
                        type="number"
                        value={maxPriceInput}
                        onChange={(e) => setMaxPriceInput(e.target.value)}
                        placeholder="2000"
                        className="w-full h-10 pl-7 pr-2 bg-[#FAF8F5] border border-gray-200 rounded-xl text-xs sm:text-sm text-[#0D3B37] font-semibold focus:outline-none focus:border-[#0D3B37] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleApplyPrice}
                  className="w-full py-2.5 sm:py-3 bg-[#0D3B37] hover:bg-[#E0592A] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <span>Apply filters</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-gray-400 hover:text-[#E0592A] font-semibold cursor-pointer mt-3 block transition-colors text-center w-full"
                >
                  Clear all filters
                </button>
              </div>

              {/* Block 3: Availability */}
              <div className="pt-2 border-t border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Availability
                </h3>
                <label className="flex items-center gap-3 text-xs sm:text-sm text-gray-700 hover:text-[#0D3B37] font-medium cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0D3B37] focus:ring-0 cursor-pointer accent-[#0D3B37]"
                  />
                  <span className={inStockOnly ? "font-bold text-[#0D3B37]" : ""}>In stock only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Right Column: Products & Active Filter Tags */}
          <main className="lg:col-span-9">
            {/* Context & Active Pills Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
                {totalPages > 1 ? ` · Page ${currentPage} of ${totalPages}` : ""}
                {searchQuery ? ` · Search "${searchQuery}"` : ""}
              </p>

              {/* Active Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {selectedCategories.map((slug) => {
                  const catObj = OFFICIAL_CATEGORIES.find((c) => c.slug === slug);
                  return (
                    <button
                      key={slug}
                      onClick={() => removeCategory(slug)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-white shadow-2xs rounded-xl text-xs text-[#0D3B37] font-semibold hover:text-[#E0592A] transition-colors group cursor-pointer"
                    >
                      <span>{catObj?.name || slug}</span>
                      <X className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#E0592A]" />
                    </button>
                  );
                })}

                {appliedMaxPrice < 10000 && (
                  <button
                    onClick={() => {
                      setMaxPriceInput("5000");
                      setAppliedMaxPrice(10000);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white shadow-2xs rounded-xl text-xs text-[#0D3B37] font-semibold hover:text-[#E0592A] transition-colors group cursor-pointer"
                  >
                    <span>Under ৳{appliedMaxPrice.toLocaleString()}</span>
                    <X className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#E0592A]" />
                  </button>
                )}
              </div>
            </div>

            {/* Product Cards Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-7 mb-10 sm:mb-12">
                {[...Array(6)].map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 animate-pulse"
                  >
                    <div>
                      <div className="w-full aspect-square rounded-xl bg-gray-100 mb-4" />
                      <div className="h-3 bg-gray-100 rounded-md w-1/3 mb-2" />
                      <div className="h-4 bg-gray-100 rounded-md w-4/5 mb-3" />
                      <div className="h-5 bg-gray-100 rounded-md w-1/2 mb-2" />
                    </div>
                    <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                      <div className="h-3 bg-gray-100 rounded-md w-1/4" />
                      <div className="h-8 w-8 bg-gray-100 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-16 text-center rounded-3xl bg-white shadow-[0_2px_14px_rgba(0,0,0,0.03)] my-6">
                <p className="text-2xl text-[#0D3B37] mb-2 font-bold">
                  No matching finds found
                </p>
                <p className="text-sm text-gray-500 font-normal mb-6 max-w-sm mx-auto">
                  Try clearing your search query or adjusting your price filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-3 bg-[#0D3B37] hover:bg-[#E0592A] text-white text-sm font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-7 mb-10 sm:mb-12">
                {paginatedProducts.map((prod) => {
                  const isWishlisted = isInWishlist(prod.id);
                  const isAdded = addedProductId === prod.id;
                  const discountPct =
                    prod.salePrice && prod.salePrice > prod.price
                      ? Math.round(((prod.salePrice - prod.price) / prod.salePrice) * 100)
                      : 0;

                  return (
                    <div
                      key={prod.id}
                      className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 transition-all duration-300 relative group border border-gray-100"
                    >
                      {/* Optional Badge on Top Left */}
                      {discountPct > 0 && (
                        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                          <span className="text-[9px] sm:text-[10px] font-bold text-white bg-gradient-to-r from-[#E0592A] to-[#F59E0B] px-2 py-0.5 rounded-md shadow-2xs">
                            {discountPct}% OFF
                          </span>
                        </div>
                      )}

                      {/* Wishlist Button on Top Right */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist({
                            id: prod.id,
                            name: prod.name,
                            slug: prod.slug || prod.id,
                            categoryName: prod.category?.name || prod.categoryName,
                            price: Number(prod.price) || 0,
                            salePrice: prod.salePrice ? Number(prod.salePrice) : undefined,
                            imageUrl: getProductDisplayImage(prod),
                            stock: prod.stock,
                            rating: prod.rating,
                            reviewCount: prod.reviewCount,
                          });
                        }}
                        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-gray-400 hover:text-[#E0592A] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                        title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
                        aria-label="Save to Wishlist"
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            isWishlisted
                              ? "fill-[#E0592A] text-[#E0592A]"
                              : "text-gray-400"
                          }`}
                        />
                      </button>

                      <div>
                        {/* Visual Card Image */}
                        <Link
                          href={`/products/${prod.slug}`}
                          className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#FAF8F5] mb-3 sm:mb-4 flex items-center justify-center p-3 group-hover:bg-[#F5F1E9] transition-colors block cursor-pointer"
                        >
                          <Image
                            src={prod.imageUrl}
                            alt={prod.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-contain p-2 group-hover:scale-106 transition-transform duration-300"
                          />
                        </Link>

                        {/* Category Label */}
                        <p className="text-[11px] text-gray-400 font-medium truncate">
                          {prod.categoryName}
                        </p>

                        {/* Product Name - Fixed 2-line height */}
                        <Link href={`/products/${prod.slug}`} title={prod.name}>
                          <h3 className="text-sm sm:text-[15.5px] font-semibold text-gray-900 group-hover:text-[#E0592A] transition-colors line-clamp-2 mt-0.5 leading-snug h-10 overflow-hidden">
                            {prod.name}
                          </h3>
                        </Link>

                        {/* Star Rating Row */}
                        <div className="flex items-center gap-1 text-xs text-amber-500 pt-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-gray-700">
                            {prod.rating ?? 4.8}
                          </span>
                          <span className="text-gray-400 text-[10.5px]">
                            ({prod.reviewCount ?? 35})
                          </span>
                        </div>

                        {/* Price Row */}
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-50 flex-wrap">
                          <span className="text-base sm:text-lg font-bold text-[#0D3B37]">
                            ৳ {prod.price.toLocaleString()}
                          </span>
                          {prod.salePrice && prod.salePrice > prod.price && (
                            <span className="text-xs sm:text-sm text-gray-400 line-through font-light">
                              ৳ {prod.salePrice.toLocaleString()}
                            </span>
                          )}
                          {discountPct > 0 && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded ml-auto">
                              {discountPct}% OFF
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Full-width Add to Cart Button (Transparent outline initially, solid on hover) */}
                      <div className="pt-3">
                        <button
                          type="button"
                          onClick={() => handleQuickAdd(prod)}
                          className={`w-full py-2.5 sm:py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                            isAdded
                              ? "bg-emerald-600 text-white border border-emerald-600 shadow-sm"
                              : "bg-transparent text-[#0D3B37] border border-[#0D3B37]/35 hover:bg-[#0D3B37] hover:text-white hover:border-[#0D3B37] hover:shadow-md active:scale-98"
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-4 h-4 stroke-[3]" />
                              <span>Added to Cart</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <nav
                aria-label="Shop catalog pagination"
                className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-center justify-between gap-4 mb-8"
              >
                {/* Count indicator */}
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  Showing{" "}
                  <span className="font-bold text-[#0D3B37]">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-[#0D3B37]">{filteredProducts.length}</span>{" "}
                  products
                </p>

                {/* Page Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed bg-transparent"
                        : "text-[#0D3B37] hover:bg-[#FAF8F5] bg-white shadow-2xs cursor-pointer"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                      const isActive = pageNum === currentPage;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => handlePageChange(pageNum)}
                          className={`min-w-9 h-9 px-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                            isActive
                              ? "bg-[#0D3B37] text-white shadow-xs"
                              : "text-gray-700 bg-white hover:bg-[#FAF8F5] shadow-2xs"
                          }`}
                          aria-current={isActive ? "page" : undefined}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed bg-transparent"
                        : "text-[#0D3B37] hover:bg-[#FAF8F5] bg-white shadow-2xs cursor-pointer"
                    }`}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </nav>
            )}

            {/* Bottom Row: Summary & Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6">
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                {filteredProducts.length > 0
                  ? `Page ${currentPage} of ${totalPages} · ${filteredProducts.length} total products`
                  : "No products to display."}
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-[#FAF8F5] text-[#0D3B37] text-xs sm:text-sm font-bold rounded-xl shadow-2xs transition-all group self-start sm:self-auto cursor-pointer"
              >
                <span>Explore every category</span>
                <ArrowUpRight className="w-4 h-4 text-[#0D3B37] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <StorefrontLayout>
      <React.Suspense
        fallback={
          <div className="bg-[#F7F4EE] min-h-screen py-16 text-center text-sm text-[#6A736C]">
            Loading catalog...
          </div>
        }
      >
        <ShopContent />
      </React.Suspense>
    </StorefrontLayout>
  );
}

