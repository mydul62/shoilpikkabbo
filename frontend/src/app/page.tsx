"use client";

import * as React from "react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { useCart } from "@/context/CartContext";
import { HomeSectionsRenderer, HomeSectionData } from "@/components/home/HomeSectionsRenderer";
import { pagesApi } from "@/lib/api";

const DEFAULT_HOME_SECTIONS: HomeSectionData[] = [
  {
    id: "sec-hero",
    name: "Hero Section",
    type: "hero",
    isVisible: true,
    props: {
      overline: "AUTHENTIC BANGLADESHI CRAFTS & ESSENTIALS",
      headline: "Handcrafted for your home.\nThoughtfully made.",
      subtitle: "Discover premium jute decor, traditional handicrafts, lifestyle essentials and custom corporate gifting — delivered all over Bangladesh.",
      ctaText: "Explore the collection",
      ctaLink: "/shop",
      imageUrl: "/images/hero-artisan.png",
      imageAlt: "Handwoven artisanal jute baskets, natural linen and ceramics",
      caption: "100% authentic craftsmanship · Sustainable & durable",
      captionLink: "/shop",
      bgColor: "#FAF7F2",
      textColor: "#143527",
    },
  },
  {
    id: "sec-manifesto",
    name: "Manifesto Banner",
    type: "manifesto",
    isVisible: true,
    props: {
      headline: "Crafted with care.\nMade to last.",
      body: "At SHOILPIKKABBO, we connect local rural artisans with modern homes. Every piece supports sustainable craftsmanship and brings authentic beauty into your everyday life.",
      bgColor: "#EBF0EC",
      textColor: "#143527",
    },
  },
  {
    id: "sec-categories",
    name: "Category Discovery",
    type: "category_discovery",
    isVisible: true,
    props: {
      overline: "EXPLORE OUR CATEGORIES",
      headline: "Shop by category.",
      subtitle: "Explore authentic handicrafts, jute creations, and daily lifestyle essentials.",
      bgColor: "#FAF7F2",
      featuredCategories: [
        { name: "Handicrafts", slug: "handicraft", image: "/images/category-handicrafts.png" },
        { name: "Jute Items", slug: "jute-items", image: "/images/category-jute.png" },
        { name: "Corporate Gift Items", slug: "corporate-gift-items", image: "/images/category-corporate.png" },
      ],
      pills: [
        { name: "Polymer", slug: "polymer" },
        { name: "Baby Items", slug: "baby-items" },
        { name: "Rudiment Garments", slug: "rudiment-garments" },
        { name: "Industrial Solutions", slug: "industrial-solutions" },
        { name: "Health & Beauty (Cosmetics, Food, Medicine)", slug: "health-and-beauty" },
        { name: "Agriculture", slug: "agriculture" },
        { name: "Special E-Sheba / Services", slug: "special-services", href: "/services" },
      ],
    },
  },
  {
    id: "sec-products",
    name: "Product Grid",
    type: "product_grid",
    isVisible: true,
    props: {
      overline: "CURATED BESTSELLERS",
      headline: "Customer favourites\n& new arrivals.",
      ctaText: "Shop all",
      ctaLink: "/shop",
      bgColor: "#FAF7F2",
    },
  },
  {
    id: "sec-promo",
    name: "Promo Offer Banner",
    type: "promo_banner",
    isVisible: true,
    props: {
      tag: "SPECIAL WELCOME OFFER",
      headline: "Save on your\nfirst purchase.",
      offerHighlight: "৳150 off your first ৳1,500 order.",
      code: "WELCOME150",
      terms: "One use per customer · Valid on all categories",
      ctaText: "Explore offers",
      ctaLink: "/offers",
      bgColor: "#143527",
      textColor: "#ffffff",
    },
  },
  {
    id: "sec-services",
    name: "Services Showcase",
    type: "services_showcase",
    isVisible: true,
    props: {
      overline: "SPECIAL E-SHEBA & CUSTOM SOLUTIONS",
      headline: "Need custom craft or bulk orders?",
      subtitle: "We design customized corporate gifts, bulk event items, and bespoke artisan solutions tailored to your unique requirements.",
      ctaText: "Request a consultation",
      ctaLink: "/services",
      bgColor: "#FAF7F2",
      services: [
        { title: "Corporate Gifting", link: "/services", icon: "gift" },
        { title: "Industrial Solutions", link: "/services", icon: "factory" },
        { title: "Special E-Sheba / Services", link: "/services", icon: "headset" },
      ],
    },
  },
  {
    id: "sec-story",
    name: "Brand Story",
    type: "brand_story",
    isVisible: true,
    props: {
      overline: "OUR ARTISAN HERITAGE",
      headline: "Empowering artisans,\npreserving traditions.",
      body: "From traditional clay pottery to handwoven jute, every Shoilpikkabbo creation celebrates Bangladeshi heritage while providing sustainable livelihoods to rural craft communities.",
      ctaText: "Learn our story",
      ctaLink: "/about",
      imageUrl: "/images/story-artisan.png",
      imageAlt: "Artisan hand-weaving natural jute basket on wooden table",
      bgColor: "#EFECE6",
      textColor: "#143527",
    },
  },
  {
    id: "sec-gifting",
    name: "Corporate Gifting",
    type: "corporate_gifting",
    isVisible: true,
    props: {
      overline: "CORPORATE & OCCASIONAL GIFTING",
      headline: "Meaningful gifts your clients\n& team will cherish.",
      body: "Handmade gift hampers, custom branding, and premium artisan boxes for company events, celebrations, and festive occasions.",
      ctaText: "Discover gifting",
      ctaLink: "/services",
      imageUrl: "/images/corporate-gifting-feature.png",
      imageAlt: "Kraft paper gift box tied with forest green ribbon and ceramic mug on stone table",
      bgColor: "#FAF7F2",
      textColor: "#143527",
    },
  },
];

export default function HomePage() {
  const { addToCart, setIsCartOpen } = useCart();
  const [sections, setSections] = React.useState<HomeSectionData[]>(DEFAULT_HOME_SECTIONS);
  const [addedProductId, setAddedProductId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const isPreview =
      typeof window !== "undefined" &&
      window.location.search.includes("preview=true");

    const fetchSections = async () => {
      try {
        const res = isPreview
          ? await pagesApi.getDraft("home")
          : await pagesApi.getPublished("home");

        const pageData = res.data as any;
        if (res.success && pageData?.sections && pageData.sections.length > 0) {
          setSections(pageData.sections);
        }
      } catch (err) {
        // Fallback to default sections smoothly
        console.warn("Using default verified sections:", err);
      }
    };

    fetchSections();
  }, []);

  const handleQuickAdd = (productData: {
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice?: number;
    imageUrl: string;
    categoryName: string;
    stock?: number;
  }) => {
    addToCart(
      {
        id: productData.id,
        name: productData.name,
        slug: productData.slug,
        categoryId: "quick-cat",
        categoryName: productData.categoryName,
        price: productData.price,
        salePrice: productData.salePrice,
        stock: productData.stock ?? 25,
        sku: `SK-${productData.slug}`,
        rating: 5,
        reviewCount: 18,
        imageUrl: productData.imageUrl,
        galleryUrls: [productData.imageUrl],
        description: productData.name,
        specifications: {},
      },
      1
    );
    setAddedProductId(productData.id);
    setTimeout(() => setAddedProductId(null), 1500);
    setIsCartOpen(true);
  };

  return (
    <StorefrontLayout>
      <HomeSectionsRenderer
        sections={sections}
        isEditorMode={false}
        onQuickAdd={handleQuickAdd}
        addedProductId={addedProductId}
      />
    </StorefrontLayout>
  );
}
