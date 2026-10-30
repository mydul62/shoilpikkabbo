"use client";

import * as React from "react";

export interface WishlistItem {
  id: string;
  name: string;
  slug: string;
  categoryId?: string;
  categoryName?: string;
  price: number;
  salePrice?: number;
  imageUrl: string;
  stock?: number;
  rating?: number;
  reviewCount?: number;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  totalWishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: WishlistItem) => void;
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  lastToast: { message: string; type: "add" | "remove" } | null;
}

const WishlistContext = React.createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = "shoilpikkabbo_wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = React.useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [lastToast, setLastToast] = React.useState<{ message: string; type: "add" | "remove" } | null>(null);

  // 1. Load initial wishlist from localStorage
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setWishlist(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load wishlist from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 2. Persist to localStorage whenever wishlist changes
  React.useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.warn("Failed to persist wishlist to localStorage", e);
    }
  }, [wishlist, isLoaded]);

  // 3. Listen to external tab storage changes
  React.useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setWishlist(parsed);
          }
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const showToast = (message: string, type: "add" | "remove") => {
    setLastToast({ message, type });
    setTimeout(() => {
      setLastToast((current) => (current?.message === message ? null : current));
    }, 2500);
  };

  const isInWishlist = React.useCallback(
    (productId: string) => {
      return wishlist.some((item) => item.id === productId);
    },
    [wishlist]
  );

  const addToWishlist = React.useCallback(
    (product: WishlistItem) => {
      setWishlist((prev) => {
        if (prev.some((item) => item.id === product.id)) {
          return prev;
        }
        showToast(`Saved "${product.name}" to your wishlist.`, "add");
        return [...prev, product];
      });
    },
    []
  );

  const removeFromWishlist = React.useCallback((productId: string) => {
    setWishlist((prev) => {
      const found = prev.find((item) => item.id === productId);
      if (found) {
        showToast(`Removed "${found.name}" from your wishlist.`, "remove");
      }
      return prev.filter((item) => item.id !== productId);
    });
  }, []);

  const toggleWishlist = React.useCallback(
    (product: WishlistItem) => {
      setWishlist((prev) => {
        const exists = prev.some((item) => item.id === product.id);
        if (exists) {
          showToast(`Removed "${product.name}" from your wishlist.`, "remove");
          return prev.filter((item) => item.id !== product.id);
        } else {
          showToast(`Saved "${product.name}" to your wishlist.`, "add");
          return [...prev, product];
        }
      });
    },
    []
  );

  const clearWishlist = React.useCallback(() => {
    setWishlist([]);
    showToast("Wishlist cleared.", "remove");
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        totalWishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        lastToast,
      }}
    >
      {children}

      {/* Global floating notification pill */}
      {lastToast && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#0D3B37] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm animate-fade-in border border-emerald-500/30">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              lastToast.type === "add" ? "bg-emerald-400" : "bg-orange-400"
            }`}
          />
          <span>{lastToast.message}</span>
        </div>
      )}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = React.useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}

