export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  handicraft: "/images/client-mockup/cat-handicrafts.png",
  "jute-items": "/images/client-mockup/cat-jute.png",
  polymer: "/images/client-mockup/cat-polymer.png",
  "baby-items": "/images/client-mockup/cat-baby.png",
  "corporate-gift-items": "/images/client-mockup/cat-corporate.png",
  "rudiment-garments": "/images/client-mockup/cat-garments.png",
  "industrial-solutions": "/images/client-mockup/cat-industrial.png",
  "health-and-beauty": "/images/client-mockup/cat-beauty.png",
  agriculture: "/images/client-mockup/cat-agriculture.png",
  "special-e-sheba": "/images/client-mockup/cat-services.png",
  "e-sheba": "/images/client-mockup/cat-services.png",
};

export function getProductDisplayImage(product: any): string {
  if (!product) return "/images/client-mockup/cat-handicrafts.png";

  // 1. Relational images array from database
  if (Array.isArray(product.images) && product.images.length > 0) {
    const primary = product.images.find((img: any) => img.isPrimary);
    const chosen = primary || product.images[0];
    const url = typeof chosen === "string" ? chosen : chosen?.url;
    if (url && typeof url === "string" && !url.includes("unsplash.com")) {
      return url;
    }
  }

  // 2. Direct imageUrl field if present and not unsplash
  if (
    product.imageUrl &&
    typeof product.imageUrl === "string" &&
    !product.imageUrl.includes("unsplash.com")
  ) {
    return product.imageUrl;
  }

  // 3. Category-specific icon fallback
  const catSlug =
    product.category?.slug ||
    product.categorySlug ||
    product.categoryId;
  if (catSlug && CATEGORY_FALLBACK_IMAGES[catSlug]) {
    return CATEGORY_FALLBACK_IMAGES[catSlug];
  }

  // 4. Default fallback
  return "/images/client-mockup/cat-handicrafts.png";
}

