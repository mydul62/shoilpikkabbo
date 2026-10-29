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
      overline: "THE EVERYDAY EDIT / 01",
      headline: "A little craft.\nA lot of\ncharacter.",
      subtitle: "Thoughtful objects, everyday essentials and services in one considered place.",
      ctaText: "Explore the collection",
      ctaLink: "/shop",
      imageUrl: "/images/hero-artisan.png",
      imageAlt: "Handwoven artisanal jute baskets, natural linen and ceramics",
      caption: "Natural textures. Considered details.",
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
      headline: "For the way you live, give\nand grow.",
      body: "Welcome to SHOILPIKKABBO. From handcrafted pieces to practical essentials, discover new possibilities for every day.",
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
      overline: "MANY NEEDS. ONE DESTINATION.",
      headline: "Find your everyday.",
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
      overline: "THE CONSIDERED EDIT",
      headline: "Small details.\nLasting delight.",
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
      tag: "A LITTLE SOMETHING TO BEGIN",
      headline: "Your first find,\na little sweeter.",
      offerHighlight: "৳150 off your first ৳1,500 order.",
      code: "WELCOME150",
      terms: "One use per customer · Until 30 Nov 2026",
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
      overline: "BEYOND THE BASKET",
      headline: "Make room for possibilities.",
      subtitle: "Proposed service areas. Share your brief; scope and availability are confirmed before any commitment.",
      ctaText: "Explore services",
      ctaLink: "/services",
      bgColor: "#FAF7F2",
      services: [
        { title: "Corporate gifting", link: "/services", icon: "gift" },
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
      overline: "TEXTURE & EVERYDAY LIFE",
      headline: "Beauty in the things\nwe choose.",
      body: "The warmth of clay. The quiet character of natural fibres. Objects that feel at home in your life.",
      ctaText: "Get to know us",
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
      overline: "FOR PEOPLE, NOT JUST OCCASIONS",
      headline: "A thoughtful gesture\ngoes a long way.",
      body: "Gift-worthy pieces for your people or your team. Start larger orders with a simple brief.",
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
