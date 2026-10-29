import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/apiError";
import { PageStatus } from "@prisma/client";

export function getDefaultHomePageSections() {
  return [
    {
      id: "sec-hero",
      type: "hero",
      name: "Hero Section",
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
      type: "manifesto",
      name: "Manifesto Banner",
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
      type: "category_discovery",
      name: "Category Discovery",
      isVisible: true,
      props: {
        overline: "EXPLORE OUR CATEGORIES",
        headline: "Shop by category.",
        subtitle: "Explore authentic handicrafts, jute creations, and daily lifestyle essentials.",
        bgColor: "#FAF7F2",
        featuredCategories: [
          {
            id: "cat-1",
            title: "Handicrafts",
            slug: "handicraft",
            imageUrl: "/images/category-handicrafts.png",
            subtitle: "Objects with a human touch",
          },
          {
            id: "cat-2",
            title: "Jute Items",
            slug: "jute-items",
            imageUrl: "/images/category-jute.png",
            subtitle: "Naturally useful, beautifully simple",
          },
          {
            id: "cat-3",
            title: "Corporate Gift Items",
            slug: "corporate-gift-items",
            imageUrl: "/images/category-corporate.png",
            subtitle: "A thoughtful way to say thank you",
          },
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
      type: "product_grid",
      name: "Customer Favourites & New Arrivals",
      isVisible: true,
      props: {
        overline: "CURATED BESTSELLERS",
        headline: "Customer favourites\n& new arrivals.",
        ctaText: "Shop all",
        ctaLink: "/shop",
        bgColor: "#FAF7F2",
        productLimit: 4,
      },
    },
    {
      id: "sec-promo",
      type: "promo_banner",
      name: "Promotional Welcome Offer",
      isVisible: true,
      props: {
        tag: "SPECIAL WELCOME OFFER",
        code: "WELCOME150",
        headline: "Save on your\nfirst purchase.",
        offerHighlight: "৳150 off your first ৳1,500 order.",
        terms: "One use per customer · Valid on all categories",
        ctaText: "Explore offers",
        ctaLink: "/offers",
        bgColor: "#143527",
        textColor: "#FFFFFF",
      },
    },
    {
      id: "sec-services",
      type: "services_showcase",
      name: "Special E-Sheba & Custom Solutions",
      isVisible: true,
      props: {
        overline: "SPECIAL E-SHEBA & CUSTOM SOLUTIONS",
        headline: "Need custom craft or bulk orders?",
        subtitle: "We design customized corporate gifts, bulk event items, and bespoke artisan solutions tailored to your unique requirements.",
        ctaText: "Request a consultation",
        ctaLink: "/services",
        bgColor: "#FAF7F2",
        services: [
          {
            id: "srv-1",
            icon: "Gift",
            title: "Corporate Gifting",
            link: "/services",
            linkText: "Discuss your brief",
          },
          {
            id: "srv-2",
            icon: "Factory",
            title: "Industrial Solutions",
            link: "/services",
            linkText: "Discuss your brief",
          },
          {
            id: "srv-3",
            icon: "Headset",
            title: "Special E-Sheba / Services",
            link: "/services",
            linkText: "Discuss your brief",
          },
        ],
      },
    },
    {
      id: "sec-story",
      type: "brand_story",
      name: "Brand Story & Heritage",
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
      type: "corporate_gifting",
      name: "Corporate Gifting Feature",
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
}

export class PageService {
  /**
   * Retrieves the current published page version for the public site.
   * If none exists in DB yet, seeds default page version and returns it.
   */
  static async getPublishedPage(slug: string = "home") {
    let published = await prisma.pageVersion.findFirst({
      where: { slug, status: PageStatus.PUBLISHED },
      orderBy: { version: "desc" },
    });

    if (!published) {
      published = await prisma.pageVersion.create({
        data: {
          slug,
          title: slug === "home" ? "Home Page" : slug,
          status: PageStatus.PUBLISHED,
          version: 1,
          sections: getDefaultHomePageSections() as any,
          publishedAt: new Date(),
          metadata: {
            title: "SHOILPIKKABBO | Delivery • Quality • Reliability",
            description: "Artisanal crafts, natural jute essentials, and institutional solutions.",
          },
        },
      });
    }

    return published;
  }

  /**
   * Retrieves the current working draft for editor.
   * If no draft exists, clones from published or default.
   */
  static async getDraftPage(slug: string = "home") {
    let draft = await prisma.pageVersion.findFirst({
      where: { slug, status: PageStatus.DRAFT },
      orderBy: { updatedAt: "desc" },
    });

    if (!draft) {
      const published = await this.getPublishedPage(slug);
      const nextVersion = published.version + 1;

      draft = await prisma.pageVersion.create({
        data: {
          slug,
          title: published.title,
          status: PageStatus.DRAFT,
          version: nextVersion,
          sections: published.sections as any,
          metadata: published.metadata as any,
        },
      });
    }

    return draft;
  }

  /**
   * Saves updates to the draft page.
   */
  static async saveDraft(
    slug: string = "home",
    data: { sections: any[]; title?: string; metadata?: any },
    authorId?: string
  ) {
    if (!Array.isArray(data.sections)) {
      throw new ApiError(400, "Sections must be an array.");
    }

    let draft = await prisma.pageVersion.findFirst({
      where: { slug, status: PageStatus.DRAFT },
      orderBy: { updatedAt: "desc" },
    });

    if (draft) {
      draft = await prisma.pageVersion.update({
        where: { id: draft.id },
        data: {
          sections: data.sections as any,
          title: data.title || draft.title,
          metadata: data.metadata || (draft.metadata as any),
          authorId,
          updatedAt: new Date(),
        },
      });
    } else {
      const published = await this.getPublishedPage(slug);
      draft = await prisma.pageVersion.create({
        data: {
          slug,
          title: data.title || published.title,
          status: PageStatus.DRAFT,
          version: published.version + 1,
          sections: data.sections as any,
          metadata: data.metadata || (published.metadata as any),
          authorId,
        },
      });
    }

    return draft;
  }

  /**
   * Publishes the current draft to make it live on the public site.
   */
  static async publishDraft(slug: string = "home", authorId?: string) {
    const draft = await prisma.pageVersion.findFirst({
      where: { slug, status: PageStatus.DRAFT },
      orderBy: { updatedAt: "desc" },
    });

    if (!draft) {
      throw new ApiError(400, "No active draft found to publish.");
    }

    // Archive current published versions
    await prisma.pageVersion.updateMany({
      where: { slug, status: PageStatus.PUBLISHED },
      data: { status: PageStatus.ARCHIVED },
    });

    // Promote draft to published
    const published = await prisma.pageVersion.update({
      where: { id: draft.id },
      data: {
        status: PageStatus.PUBLISHED,
        publishedAt: new Date(),
        authorId,
      },
    });

    return published;
  }

  /**
   * Retrieves revision history for the page.
   */
  static async getRevisions(slug: string = "home") {
    const revisions = await prisma.pageVersion.findMany({
      where: { slug },
      orderBy: { version: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        status: true,
        version: true,
        authorId: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return revisions;
  }

  /**
   * Restores a past revision as a new draft.
   */
  static async restoreRevision(slug: string, revisionId: string, authorId?: string) {
    const target = await prisma.pageVersion.findUnique({
      where: { id: revisionId },
    });

    if (!target || target.slug !== slug) {
      throw new ApiError(404, "Revision not found.");
    }

    const latest = await prisma.pageVersion.findFirst({
      where: { slug },
      orderBy: { version: "desc" },
    });

    const nextVersion = (latest?.version || 1) + 1;

    // Delete existing uncommitted draft if any
    await prisma.pageVersion.deleteMany({
      where: { slug, status: PageStatus.DRAFT },
    });

    const newDraft = await prisma.pageVersion.create({
      data: {
        slug,
        title: target.title,
        status: PageStatus.DRAFT,
        version: nextVersion,
        sections: target.sections as any,
        metadata: target.metadata as any,
        authorId,
      },
    });

    return newDraft;
  }
}
