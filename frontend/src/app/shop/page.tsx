"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowUpRight, Plus, Check, X, SlidersHorizontal } from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { useCart } from "@/context/CartContext";
import { MOCK_PRODUCTS, MOCK_CATEGORIES, Product } from "@/data/mock-data";

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

  const initialCat = searchParams.get("category");
  const initialQ = searchParams.get("q") || "";

  // State
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    initialCat ? [initialCat] : ["jute-items"]
  );
  const [searchQuery, setSearchQuery] = React.useState<string>(initialQ || "jute");
  const [searchInput, setSearchInput] = React.useState<string>(initialQ || "jute");
  const [sortBy, setSortBy] = React.useState<string>("featured");
  const [minPriceInput, setMinPriceInput] = React.useState<string>("0");
  const [maxPriceInput, setMaxPriceInput] = React.useState<string>("2000");
  const [appliedMinPrice, setAppliedMinPrice] = React.useState<number>(0);
  const [appliedMaxPrice, setAppliedMaxPrice] = React.useState<number>(2000);
  const [inStockOnly, setInStockOnly] = React.useState<boolean>(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState<boolean>(false);
  const [addedProductId, setAddedProductId] = React.useState<string | null>(null);

  // Sync with searchParams
  React.useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setSelectedCategories([cat]);
    }
    const q = searchParams.get("q");
    if (q !== null) {
      setSearchQuery(q);
      setSearchInput(q);
    }
  }, [searchParams]);

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

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
    setSearchInput("");
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
    setIsCartOpen(true);
  };

  const [liveProducts, setLiveProducts] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/products?limit=100");
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
            imageUrl: p.images?.[0]?.url || "/images/product-jute-basket.png",
            galleryUrls: p.images?.map((img: any) => img.url) || [],
            description: p.description || p.name,
            specifications: p.specifications || {},
          }));
          setLiveProducts(mapped);
        }
      } catch (e) {
        // Fallback to MOCK_PRODUCTS
      }
    };
    fetchCatalog();
  }, []);

  const catalogProducts = liveProducts.length > 0 ? liveProducts : MOCK_PRODUCTS;

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

  // Breadcrumb Category Title
  const activeCategoryTitle =
    selectedCategories.length === 1
      ? OFFICIAL_CATEGORIES.find((c) => c.slug === selectedCategories[0])?.name || "Natural textures"
      : "Natural textures";

  return (
    <div className="bg-[#F7F4EE] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-8 sm:py-12">
        {/* 1. Breadcrumbs */}
        <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-[11.5px] sm:text-[12px] text-[#7E8881] font-light mb-3">
          <Link href="/" className="hover:text-[#143527] transition-colors">
            Home
          </Link>
          <span className="select-none text-[#A8B2AA]">/</span>
          <Link href="/shop" className="hover:text-[#143527] transition-colors">
            Shop
          </Link>
          <span className="select-none text-[#A8B2AA]">/</span>
          <span className="text-[#143527] font-normal">{activeCategoryTitle}</span>
        </nav>

        {/* 2. Page Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[46px] font-normal text-[#143527] leading-[1.12] tracking-tight mb-2.5">
            Everyday, thoughtfully chosen.
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[#6A736C] font-light leading-relaxed max-w-2xl">
            Discover natural textures, useful objects and little details for your home.
          </p>
        </div>

        {/* 3. Search and Sort Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end mb-10 pb-8 border-b border-[#EAE3D5]">
          {/* Search the collection */}
          <div className="md:col-span-8 lg:col-span-9">
            <label className="text-[11.5px] text-[#556059] font-medium mb-1.5 block tracking-tight">
              Search the collection
            </label>
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-xl">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products, materials..."
                className="w-full h-11 px-3.5 sm:px-4 bg-white border border-[#D5CDC0] rounded-[2px] text-[13px] text-[#143527] placeholder:text-[#9EA8A1] focus:outline-none focus:border-[#143527] transition-colors"
              />
              <button
                type="submit"
                className="h-11 px-4 sm:px-6 bg-[#143527] hover:bg-[#1B4332] text-white text-[13px] font-medium rounded-[2px] inline-flex items-center gap-1.5 sm:gap-2 shrink-0 transition-colors cursor-pointer"
              >
                <span>Search</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Sort By */}
          <div className="md:col-span-4 lg:col-span-3 flex flex-col md:items-end">
            <div className="w-full sm:w-auto">
              <label className="text-[11.5px] text-[#556059] font-medium mb-1.5 block tracking-tight">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-[190px] h-11 px-4 bg-white border border-[#D5CDC0] rounded-[2px] text-[13px] text-[#143527] focus:outline-none focus:border-[#143527] transition-colors cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6 flex justify-between items-center">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#D5CDC0] text-[#143527] text-[13px] font-medium rounded-[2px]"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#143527]" />
            <span>{isMobileFilterOpen ? "Hide filters" : "Filter your finds"}</span>
          </button>
          <span className="text-[12.5px] text-[#6A736C]">
            {filteredProducts.length} finds
          </span>
        </div>

        {/* 4. Two-Column Layout (Sidebar + Catalog) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Filter your finds Sidebar */}
          <aside
            className={`lg:col-span-3 space-y-7 ${
              isMobileFilterOpen
                ? "block bg-white p-5 sm:p-6 rounded-lg border border-[#D5CDC0] shadow-sm mb-6 lg:mb-0"
                : "hidden lg:block"
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl sm:text-[25px] font-normal text-[#143527] tracking-tight">
                Filter your finds
              </h2>
              {isMobileFilterOpen && (
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="lg:hidden text-xs text-[#6A736C] hover:text-[#143527] p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Block 1: Categories */}
            <div>
              <h3 className="text-[12.5px] font-semibold text-[#143527] mb-3.5 tracking-tight">
                Categories
              </h3>
              <div className="space-y-2.5">
                {OFFICIAL_CATEGORIES.map((cat) => {
                  const isChecked = selectedCategories.includes(cat.slug);
                  return (
                    <label
                      key={cat.slug}
                      className="flex items-start gap-3 text-[13px] text-[#33423A] hover:text-[#143527] cursor-pointer select-none leading-snug"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCategory(cat.slug)}
                        className="mt-0.5 w-4 h-4 rounded-[2px] border-[#C4B8A5] text-[#143527] focus:ring-0 cursor-pointer accent-[#143527]"
                      />
                      <span>{cat.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Block 2: Price Range */}
            <div>
              <h3 className="text-[12.5px] font-semibold text-[#143527] mb-3 tracking-tight">
                Price range - BDT
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-[11px] text-[#6A736C] font-light mb-1 block">
                    Min
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-[12px] text-[#6A736C]">
                      ৳
                    </span>
                    <input
                      type="number"
                      value={minPriceInput}
                      onChange={(e) => setMinPriceInput(e.target.value)}
                      placeholder="0"
                      className="w-full h-9 pl-6 pr-2 bg-white border border-[#D5CDC0] rounded-[2px] text-[12.5px] text-[#143527] focus:outline-none focus:border-[#143527]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-[#6A736C] font-light mb-1 block">
                    Max
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-[12px] text-[#6A736C]">
                      ৳
                    </span>
                    <input
                      type="number"
                      value={maxPriceInput}
                      onChange={(e) => setMaxPriceInput(e.target.value)}
                      placeholder="2000"
                      className="w-full h-9 pl-6 pr-2 bg-white border border-[#D5CDC0] rounded-[2px] text-[12.5px] text-[#143527] focus:outline-none focus:border-[#143527]"
                    />
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleApplyPrice}
                className="w-full py-2.5 bg-[#143527] hover:bg-[#1B4332] text-white text-[12.5px] font-medium rounded-[2px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Apply filters</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[12px] text-[#6A736C] hover:text-[#B85D38] cursor-pointer mt-2.5 block transition-colors"
              >
                Clear all filters
              </button>
            </div>

            {/* Block 3: Availability */}
            <div>
              <h3 className="text-[12.5px] font-semibold text-[#143527] mb-3 tracking-tight">
                Availability
              </h3>
              <label className="flex items-center gap-3 text-[13px] text-[#33423A] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded-[2px] border-[#C4B8A5] text-[#143527] focus:ring-0 cursor-pointer accent-[#143527]"
                />
                <span>In stock only</span>
              </label>
            </div>
          </aside>

          {/* Right Column: Products & Active Filter Tags */}
          <main className="lg:col-span-9">
            {/* Context & Active Pills Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <p className="text-[12.5px] sm:text-[13px] text-[#6A736C] font-light">
                {filteredProducts.length} products
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
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#D5CDC0] rounded-[2px] text-[11.5px] text-[#143527] font-medium hover:border-[#B85D38] transition-colors group cursor-pointer"
                    >
                      <span>{catObj?.name || slug}</span>
                      <X className="w-3 h-3 text-[#6A736C] group-hover:text-[#B85D38]" />
                    </button>
                  );
                })}

                {appliedMaxPrice < 10000 && (
                  <button
                    onClick={() => {
                      setMaxPriceInput("5000");
                      setAppliedMaxPrice(10000);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#D5CDC0] rounded-[2px] text-[11.5px] text-[#143527] font-medium hover:border-[#B85D38] transition-colors group cursor-pointer"
                  >
                    <span>Under ৳{appliedMaxPrice.toLocaleString()}</span>
                    <X className="w-3 h-3 text-[#6A736C] group-hover:text-[#B85D38]" />
                  </button>
                )}
              </div>
            </div>

            {/* Product Cards Grid - 2 Columns Matching Client Reference */}
            {filteredProducts.length === 0 ? (
              <div className="p-16 text-center border border-[#EAE3D5] rounded-2xl bg-white/60 my-6">
                <p className="font-serif text-2xl text-[#143527] mb-2 font-normal">
                  No matching finds found
                </p>
                <p className="text-xs text-[#6A736C] font-light mb-6 max-w-sm mx-auto">
                  Try clearing your search query or adjusting your price filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-[#143527] text-white text-xs font-medium rounded-[2px]"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3.5 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
                {filteredProducts.map((prod) => (
                  <div key={prod.id} className="group flex flex-col">
                    {/* Visual Card Image with Floating Quick-Add */}
                    <div className="relative w-full aspect-[1.48/1] rounded-xl sm:rounded-2xl overflow-hidden bg-[#E8E2D6] shadow-[0_1px_3px_rgba(0,0,0,0.03)] mb-2.5 sm:mb-3.5">
                      <Link
                        href={`/products/${prod.slug}`}
                        className="block relative w-full h-full"
                      >
                        <Image
                          src={prod.imageUrl}
                          alt={prod.name}
                          fill
                          sizes="(max-width: 640px) 50vw, 50vw"
                          className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                        />
                      </Link>

                      {/* Floating Add to Bag Button */}
                      <button
                        onClick={() => handleQuickAdd(prod)}
                        className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white hover:bg-[#143527] text-[#143527] hover:text-white shadow-sm flex items-center justify-center transition-all cursor-pointer group/btn"
                        title="Add to bag"
                        aria-label={`Add ${prod.name} to bag`}
                      >
                        {addedProductId === prod.id ? (
                          <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#143527]" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:rotate-90 transition-transform duration-200" />
                        )}
                      </button>
                    </div>

                    {/* Category Label */}
                    <span className="text-[10px] sm:text-[11.5px] text-[#6A736C] font-light">
                      {prod.categoryName}
                    </span>

                    {/* Product Name */}
                    <Link href={`/products/${prod.slug}`}>
                      <h3 className="text-[13px] sm:text-[15.5px] font-medium text-[#143527] group-hover:text-[#B85D38] transition-colors mt-0.5 leading-snug line-clamp-1 sm:line-clamp-none">
                        {prod.name}
                      </h3>
                    </Link>

                    {/* Price Row */}
                    <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5">
                      <span className="text-[13px] sm:text-[14.5px] font-semibold text-[#143527]">
                        ৳{prod.price.toLocaleString()}
                      </span>
                      {prod.salePrice && prod.salePrice > prod.price && (
                        <span className="text-[11px] sm:text-[12px] text-[#8C948E] line-through font-light">
                          ৳{prod.salePrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Row: Seen count & Explore every category */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-[#EAE3D5]">
              <p className="text-[12.5px] sm:text-[13px] text-[#6A736C] font-light">
                You&apos;ve seen all {filteredProducts.length} finds.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-transparent hover:bg-white border border-[#D5CDC0] hover:border-[#143527] text-[#143527] text-[13px] font-medium rounded-[2px] transition-all group self-start sm:self-auto cursor-pointer"
              >
                <span>Explore every category</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#143527] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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

