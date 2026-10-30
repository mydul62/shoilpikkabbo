"use client";

import * as React from "react";
import { Product, MOCK_PRODUCTS, MOCK_COUPONS, Coupon } from "@/data/mock-data";
import { useSettings } from "@/context/SettingsContext";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  shippingCity: "Dhaka" | "Outside Dhaka";
  setShippingCity: (city: "Dhaka" | "Outside Dhaka") => void;
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  totalItemCount: number;
}

const CartContext = React.createContext<CartContextType | undefined>(undefined);

export const defaultInitialItems: CartItem[] = [];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [appliedCoupon, setAppliedCoupon] = React.useState<Coupon | null>(null);
  const [shippingCity, setShippingCity] = React.useState<"Dhaka" | "Outside Dhaka">("Dhaka");
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Load cart from localStorage on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("shoilpikkabbo_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Clean out legacy demo items if they were saved in browser localStorage from earlier sessions
          const cleaned = parsed.filter(
            (item: any) =>
              item?.product?.id !== "prod-jute-basket" &&
              item?.product?.id !== "prod-woven-coasters" &&
              item?.product?.name !== "Everyday jute basket" &&
              item?.product?.name !== "Woven coaster set"
          );
          setItems(cleaned);
          localStorage.setItem("shoilpikkabbo_cart", JSON.stringify(cleaned));
        }
      }
      const savedCoupon = localStorage.getItem("shoilpikkabbo_coupon");
      if (savedCoupon && savedCoupon !== "WELCOME150") {
        const found = MOCK_COUPONS.find((c) => c.code === savedCoupon);
        if (found) setAppliedCoupon(found);
      } else {
        localStorage.removeItem("shoilpikkabbo_coupon");
      }
    } catch {
      // ignore
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save cart to localStorage only after hydration
  React.useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("shoilpikkabbo_cart", JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, isHydrated]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = MOCK_COUPONS.find((c) => c.code === cleanCode);
    if (!coupon) {
      return { success: false, message: "Invalid promo code. Try WELCOME150." };
    }
    if (subtotal < coupon.minOrderValue) {
      return {
        success: false,
        message: `This coupon requires a minimum subtotal of ৳${coupon.minOrderValue.toLocaleString()}.`,
      };
    }
    setAppliedCoupon(coupon);
    try {
      localStorage.setItem("shoilpikkabbo_coupon", coupon.code);
    } catch {
      // ignore
    }
    const discountText = coupon.discountAmount
      ? `You saved ৳${coupon.discountAmount}.`
      : `You saved ${coupon.discountPercentage}%.`;
    return {
      success: true,
      message: `${coupon.code} applied. ${discountText}`,
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    try {
      localStorage.removeItem("shoilpikkabbo_coupon");
    } catch {
      // ignore
    }
  };

  const subtotal = items.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);

  const discount = appliedCoupon
    ? appliedCoupon.discountAmount
      ? appliedCoupon.discountAmount
      : Math.round((subtotal * appliedCoupon.discountPercentage) / 100)
    : 0;

  const deliveryCharge =
    subtotal === 0 || subtotal >= (settings?.freeDeliveryThreshold ?? 3000)
      ? 0
      : shippingCity === "Dhaka"
      ? (settings?.deliveryDhaka ?? 70)
      : (settings?.deliveryOutside ?? 130);

  const total = Math.max(0, subtotal - discount + deliveryCharge);

  const totalItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        shippingCity,
        setShippingCity,
        subtotal,
        discount,
        deliveryCharge,
        total,
        totalItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
