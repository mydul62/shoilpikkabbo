"use client";

import * as React from "react";
import { Product, MOCK_COUPONS, Coupon, CLIENT_INFO } from "@/data/mock-data";

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

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [appliedCoupon, setAppliedCoupon] = React.useState<Coupon | null>(null);
  const [shippingCity, setShippingCity] = React.useState<"Dhaka" | "Outside Dhaka">("Dhaka");

  // Load cart from localStorage on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("shoilpikkabbo_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save cart to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem("shoilpikkabbo_cart", JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

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
    setIsCartOpen(true);
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
      return { success: false, message: "Invalid promo code. Try WELCOME10." };
    }
    if (subtotal < coupon.minOrderValue) {
      return {
        success: false,
        message: `This coupon requires a minimum subtotal of ৳${coupon.minOrderValue}.`,
      };
    }
    setAppliedCoupon(coupon);
    return {
      success: true,
      message: `Coupon "${coupon.code}" applied! (${coupon.discountPercentage}% off)`,
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const subtotal = items.reduce((acc, item) => {
    const price = item.product.salePrice ?? item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const discount = appliedCoupon
    ? Math.round((subtotal * appliedCoupon.discountPercentage) / 100)
    : 0;

  const deliveryCharge =
    subtotal === 0 || subtotal >= CLIENT_INFO.freeDeliveryThreshold
      ? 0
      : shippingCity === "Dhaka"
      ? CLIENT_INFO.deliveryChargeDhaka
      : CLIENT_INFO.deliveryChargeOutside;

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
