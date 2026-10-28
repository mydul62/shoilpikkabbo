"use client";

import * as React from "react";
import { Product, MOCK_PRODUCTS, MOCK_COUPONS, Coupon, CLIENT_INFO } from "@/data/mock-data";

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

const defaultInitialItems: CartItem[] = [
  {
    product: {
      id: "prod-jute-basket",
      name: "Everyday jute basket",
      slug: "everyday-jute-basket",
      categoryId: "cat-2",
      categoryName: "Jute Items",
      price: 1450,
      salePrice: 1650,
      stock: 25,
      sku: "JT-BSK-001",
      rating: 4.9,
      reviewCount: 38,
      isFeatured: true,
      imageUrl: "/images/product-jute-basket.png",
      galleryUrls: ["/images/product-jute-basket.png"],
      description: "Everyday natural braided golden jute basket with handles for home storage and living room character.",
      specifications: {
        Material: "100% Biodegradable Golden Jute",
        Origin: "Faridpur, Bangladesh",
        Craft: "Hand-braided spiral weave",
      },
    },
    quantity: 1,
  },
  {
    product: {
      id: "prod-woven-coasters",
      name: "Woven coaster set",
      slug: "woven-coaster-set",
      categoryId: "cat-2",
      categoryName: "Jute Items",
      price: 450,
      stock: 35,
      sku: "JT-CST-003",
      rating: 4.8,
      reviewCount: 29,
      isFeatured: true,
      imageUrl: "/images/product-woven-coasters.png",
      galleryUrls: ["/images/product-woven-coasters.png"],
      description: "Set of 4 circular hand-braided golden jute drink coasters protecting delicate tables with natural warmth.",
      specifications: {
        Material: "Hand-braided golden jute",
        Set: "4 Pieces",
        Diameter: "10 cm",
      },
    },
    quantity: 1,
  },
];

const defaultInitialCoupon: Coupon = {
  code: "WELCOME150",
  discountPercentage: 0,
  discountAmount: 150,
  minOrderValue: 1500,
  description: "৳150 off on orders of ৳1,500 or more",
  expiresAt: "2026-11-30",
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>(defaultInitialItems);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [appliedCoupon, setAppliedCoupon] = React.useState<Coupon | null>(defaultInitialCoupon);
  const [shippingCity, setShippingCity] = React.useState<"Dhaka" | "Outside Dhaka">("Dhaka");

  // Load cart from localStorage on mount if client has custom cart
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("shoilpikkabbo_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed);
          const savedCoupon = localStorage.getItem("shoilpikkabbo_coupon");
          if (savedCoupon) {
            const found = MOCK_COUPONS.find((c) => c.code === savedCoupon);
            if (found) setAppliedCoupon(found);
          } else if (parsed.length === 0) {
            setAppliedCoupon(null);
          }
        }
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
