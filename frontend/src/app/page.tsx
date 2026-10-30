"use client";

import * as React from "react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { HomeSectionsRenderer, HomeSectionData } from "@/components/home/HomeSectionsRenderer";
import { ClientMockupHome } from "@/components/home/ClientMockupHome";
import { pagesApi, productsApi, categoriesApi, bannersApi } from "@/lib/api";
import { useCart } from "@/context/CartContext";

export default function HomePage() {
  const { addToCart } = useCart();
  const [sections, setSections] = React.useState<HomeSectionData[] | null>(null);
  const [liveProducts, setLiveProducts] = React.useState<any[]>([]);
  const [liveCategories, setLiveCategories] = React.useState<any[]>([]);
  const [liveBanners, setLiveBanners] = React.useState<any[]>([]);
  const [addedProductId, setAddedProductId] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Disable browser automatic scroll restoration so page reload always begins at the top hero section
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, []);

  React.useEffect(() => {
    let mounted = true;
    async function loadStorefrontHome() {
      try {
        const [pageRes, prodRes, catRes, banRes] = await Promise.all([
          pagesApi.getPublished("home").catch(() => null),
          productsApi.getAll({ limit: 100 }).catch(() => null),
          categoriesApi.getAll().catch(() => null),
          bannersApi.getAll(true).catch(() => null),
        ]);

        if (!mounted) return;

        if (pageRes && pageRes.success && Array.isArray((pageRes.data as any)?.sections)) {
          setSections((pageRes.data as any).sections);
        }
        if (prodRes && prodRes.success && Array.isArray(prodRes.data)) {
          setLiveProducts(prodRes.data);
        }
        if (catRes && catRes.success && Array.isArray(catRes.data)) {
          setLiveCategories(catRes.data);
        }
        if (banRes && banRes.success && Array.isArray(banRes.data)) {
          setLiveBanners(banRes.data);
        }
      } catch (err) {
        console.error("Error loading published home page:", err);
      }
    }

    loadStorefrontHome();
    return () => {
      mounted = false;
    };
  }, []);

  const handleQuickAdd = (product: any) => {
    const imageUrl =
      product.images && product.images.length > 0 && product.images[0]?.url
        ? product.images[0].url
        : product.imageUrl || "/images/client-mockup/cat-handicrafts.png";

    addToCart(
      {
        id: product.id,
        name: product.name,
        slug: product.slug || product.id,
        categoryId: product.categoryId || "",
        categoryName: product.category?.name || product.categoryName || "Handicrafts",
        stock: product.stock ?? 10,
        sku: product.sku || `SKU-${product.id?.slice(0, 6)}`,
        rating: product.rating ?? 5,
        reviewCount: product.reviewCount ?? 1,
        price: Number(product.price),
        salePrice: product.salePrice ? Number(product.salePrice) : undefined,
        imageUrl,
        galleryUrls: product.images?.map((img: any) => img.url) || [imageUrl],
        description: product.description || product.name,
        specifications: product.specifications || {},
      },
      1
    );
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1500);
  };

  return (
    <StorefrontLayout>
      {sections && sections.length > 0 ? (
        <HomeSectionsRenderer
          sections={sections}
          liveProducts={liveProducts}
          liveCategories={liveCategories}
          liveBanners={liveBanners}
          onQuickAdd={handleQuickAdd}
          addedProductId={addedProductId}
        />
      ) : (
        <ClientMockupHome />
      )}
    </StorefrontLayout>
  );
}
