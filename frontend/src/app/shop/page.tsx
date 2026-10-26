"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter, SlidersHorizontal, RotateCcw } from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { MOCK_PRODUCTS, MOCK_CATEGORIES, Product } from "@/data/mock-data";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialQuery = searchParams.get("q") || "";

  const [selectedCategory, setSelectedCategory] = React.useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = React.useState<string>(initialQuery);
  const [sortBy, setSortBy] = React.useState<"newest" | "price-asc" | "price-desc" | "rating">("newest");
  const [maxPrice, setMaxPrice] = React.useState<number>(5000);
  const [inStockOnly, setInStockOnly] = React.useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState<boolean>(false);

  // Sync with searchParams changes
  React.useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
    const q = searchParams.get("q");
    if (q) setSearchQuery(q);
  }, [searchParams]);

  // Filter and sort products
  const filteredProducts = React.useMemo(() => {
    return MOCK_PRODUCTS.filter((prod) => {
      // Category filter
      if (selectedCategory !== "all") {
        const categoryObj = MOCK_CATEGORIES.find((c) => c.slug === selectedCategory);
        if (categoryObj && prod.categoryId !== categoryObj.id) {
          return false;
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = prod.name.toLowerCase().includes(query);
        const matchesCategory = prod.categoryName.toLowerCase().includes(query);
        const matchesDesc = prod.description.toLowerCase().includes(query);
        if (!matchesName && !matchesCategory && !matchesDesc) {
          return false;
        }
      }

      // Price filter
      const effectivePrice = prod.salePrice ?? prod.price;
      if (effectivePrice > maxPrice) {
        return false;
      }

      // In-stock filter
      if (inStockOnly && prod.stock <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice ?? a.price;
      const priceB = b.salePrice ?? b.price;
      if (sortBy === "price-asc") return priceA - priceB;
      if (sortBy === "price-desc") return priceB - priceA;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // default newest
    });
  }, [selectedCategory, searchQuery, maxPrice, inStockOnly, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setMaxPrice(5000);
    setInStockOnly(false);
    setSortBy("newest");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-brand-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 font-heading">
            {selectedCategory === "all"
              ? "All Products"
              : MOCK_CATEGORIES.find((c) => c.slug === selectedCategory)?.name || "Catalog"}
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Showing {filteredProducts.length} items
          </p>
        </div>

        {/* Quick Search & Sort */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Search in results..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-brand-border bg-white text-xs text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-forest-800/20 focus:border-forest-800"
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-charcoal-400" />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-9 px-3 rounded-lg border border-brand-border bg-white text-xs text-charcoal-800 font-medium focus:outline-none focus:ring-2 focus:ring-forest-800/20"
          >
            <option value="newest">Sort by: Featured & Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Customer Rating</option>
          </select>

          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="md:hidden flex items-center gap-1.5 h-9 px-3 rounded-lg border border-brand-border bg-white text-xs font-semibold text-charcoal-800"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Grid Layout: Filter Sidebar + Products */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8">
        {/* Desktop Filter Sidebar */}
        <aside
          className={`md:col-span-3 space-y-6 ${
            isMobileFilterOpen ? "block" : "hidden md:block"
          }`}
        >
          <div className="p-5 rounded-2xl border border-brand-border bg-white space-y-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-sand">
              <h3 className="text-sm font-bold text-charcoal-900 uppercase tracking-wider flex items-center gap-2">
                <Filter className="h-4 w-4 text-forest-800" />
                <span>Filters</span>
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-xs text-forest-800 hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-3">
                Categories
              </h4>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex justify-between ${
                    selectedCategory === "all"
                      ? "bg-forest-800 text-white font-semibold"
                      : "text-charcoal-700 hover:bg-sand"
                  }`}
                >
                  <span>All Categories</span>
                  <span className="opacity-80">({MOCK_PRODUCTS.length})</span>
                </button>
                {MOCK_CATEGORIES.filter((c) => !c.isService).map((cat) => {
                  const isSelected = selectedCategory === cat.slug;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex justify-between ${
                        isSelected
                          ? "bg-forest-800 text-white font-semibold"
                          : "text-charcoal-700 hover:bg-sand"
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="opacity-80 ml-2">({cat.itemCount})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <div className="flex justify-between text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-2">
                <span>Max Price</span>
                <span className="text-forest-800 font-extrabold">৳{maxPrice}</span>
              </div>
              <input
                type="range"
                min="500"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-forest-800 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-charcoal-400 mt-1">
                <span>৳500</span>
                <span>৳5,000</span>
              </div>
            </div>

            {/* Availability Checkbox */}
            <div className="pt-2 border-t border-sand">
              <label className="flex items-center gap-2.5 text-xs text-charcoal-800 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-forest-800 focus:ring-forest-800 h-4 w-4"
                />
                <span>In Stock Items Only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="md:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-brand-border bg-white">
              <div className="h-16 w-16 mx-auto rounded-full bg-forest-50 text-forest-800 flex items-center justify-center mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="font-heading font-bold text-lg text-charcoal-900">
                No matching products found
              </h3>
              <p className="text-xs text-charcoal-500 max-w-sm mx-auto mt-1 mb-6">
                Try adjusting your search criteria, price range slider, or selected category.
              </p>
              <Button onClick={handleResetFilters} variant="secondary" size="md">
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <StorefrontLayout>
      <React.Suspense fallback={<div className="p-12 text-center text-sm text-charcoal-500">Loading catalog...</div>}>
        <ShopContent />
      </React.Suspense>
    </StorefrontLayout>
  );
}
