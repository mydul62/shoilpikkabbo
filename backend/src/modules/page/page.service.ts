import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/apiError";
import { PageStatus } from "@prisma/client";

// =========================================================================
// 1. HOME PAGE DEFAULT SECTIONS (100% Identical to Approved Storefront)
// =========================================================================
export function getDefaultHomePageSections() {
  return [
    {
      id: "sec-hero",
      type: "hero_carousel",
      name: "Hero Panoramic Carousel",
      isVisible: true,
      props: {
        pill: "Handmade  •  Eco Friendly  •  Local Products",
        titleLine1: "বাংলার ঐতিহ্য,",
        titleLine2: "আপনার প্রয়োজন",
        subtitleLine1: "দেশীয় পণ্য ও আধুনিক সেবার সমন্বয়ে",
        subtitleLine2: "শিল্পকলা এখন আপনার হাতের কাছে!",
        ctaText: "Shop Now",
        ctaLink: "/shop",
        bgImage: "/images/client-mockup/hero-bg-exact.png",
        badge1Text: "Fast Delivery",
        badge2Text: "Quality Products",
        badge3Text: "Reliable Service",
        showLocalBadge: true,
      },
    },
    {
      id: "sec-categories",
      type: "categories_grid",
      name: "Shop by Category Grid",
      isVisible: true,
      props: {
        headline: "Shop by Category",
        subtitle: "Explore our wide range of products and services",
        ctaText: "View All Categories",
        ctaLink: "/shop",
        promoHeadline: "Quality Products\nBetter Life",
        promoCtaText: "Explore Categories",
        promoCtaLink: "/shop",
        promoBgImage: "/images/client-mockup/quality-products-bg.png",
      },
    },
    {
      id: "sec-featured",
      type: "featured_products",
      name: "Featured Products Showcase",
      isVisible: true,
      props: {
        headline: "Featured Products",
        subtitle: "Best selling and most popular products",
        ctaText: "View All Products",
        ctaLink: "/shop",
        limit: 5,
      },
    },
    {
      id: "sec-promo-trio",
      type: "promo_trio",
      name: "Promotional 3-Card Banner Section",
      isVisible: true,
      props: {
        card1Tag: "Special Offer",
        card1Discount: "50%",
        card1Subtitle: "On Selected Products",
        card1CtaText: "Shop Now",
        card1CtaLink: "/offers",
        card1BgImage: "/images/client-mockup/special-offer-banner-bg.png",
        card2Headline: "Our Services",
        card2Subtitle: "More than just products",
        card3Tag: "Stay Connected",
        card3Headline: "Get in Touch",
        card3Note: "Chat with us anytime",
        card3Image: "/images/client-mockup/promo-get-in-touch.png",
      },
    },
    {
      id: "sec-for-you",
      type: "for_you_products",
      name: "For You Personalized Recommendations",
      isVisible: true,
      props: {
        headline: "For You",
        subtitle: "Specially handpicked recommendations tailored for you",
        ctaText: "View All",
        ctaLink: "/shop",
        initialCount: 10,
        batchSize: 10,
      },
    },
    {
      id: "sec-trust",
      type: "trust_mission",
      name: "Why Choose SHOILPIKKABBO (Trust & Brand Mission)",
      isVisible: true,
      props: {
        headline: "Why Choose SHOILPIKKABBO?",
        subtitle: "Your trust is our biggest asset",
        pillar1Title: "Wide Product Range",
        pillar1Desc: "From local to modern",
        pillar2Title: "Secure Payment",
        pillar2Desc: "Safe & trusted transaction",
        pillar3Title: "Fast Delivery",
        pillar3Desc: "On time, every time",
        pillar4Title: "Customer Support",
        pillar4Desc: "Always here for you",
        missionTitle: "SHOILPIKKABBO",
        missionTagline: "DELIVERY • QUALITY • RELIABILITY",
        missionDesc: "We are committed to delivering high-quality products and services with trust, care and reliability to make your life easier.",
        missionBgImage: "/images/client-mockup/trust-mission-banner-bg.png",
        missionIcon: "/images/client-mockup/trust-brand-icon.png",
      },
    },
  ];
}

// =========================================================================
// 2. ABOUT US PAGE DEFAULT SECTIONS
// =========================================================================
export function getDefaultAboutPageSections() {
  return [
    {
      id: "sec-about-header",
      type: "about_header",
      name: "About Page Hero Header",
      isVisible: true,
      props: {
        badge: "Heritage Craft & Everyday Commerce",
        headline: "Thoughtfully brought together.",
        subtitle: "SHOILPIKKABBO is built upon three foundational tenets: Delivery, Quality, and Reliability. Bridging traditional artisans with modern lifestyle needs across Bangladesh.",
      },
    },
    {
      id: "sec-about-story",
      type: "about_story",
      name: "Our Story & Artisan Heritage",
      isVisible: true,
      props: {
        tag: "OUR HERITAGE & MISSION",
        headline: "Connecting root artisans with modern Bangladeshi homes.",
        paragraph1: "Founded with the ambition of making authentic Bangladeshi craftsmanship accessible to everyone, SHOILPIKKABBO curates handloom textiles, natural golden jute creations, pottery, and sustainable daily lifestyle solutions.",
        paragraph2: "We work directly with craft guilds, women cooperatives, and master makers from Bogura, Tangail, Cumilla, and rural handicraft hubs. Every product empowers rural families with dignified, fair-trade earnings.",
        imageUrl: "/images/story-artisan.png",
        imageAlt: "Artisan hand-weaving natural jute basket on wooden table",
      },
    },
    {
      id: "sec-about-pillars",
      type: "about_pillars",
      name: "The Three Core Tenets (Pillars)",
      isVisible: true,
      props: {
        headline: "The Principles That Guide Us",
        subtitle: "Every order, interaction and service is held to our three uncompromising benchmarks.",
        pillar1Title: "Delivery",
        pillar1Desc: "Dependable, trackable, and prompt nationwide shipping reaching all 64 districts in Bangladesh.",
        pillar2Title: "Quality",
        pillar2Desc: "Uncompromising raw material selection, artisanal inspection, and durable export-standard standards.",
        pillar3Title: "Reliability",
        pillar3Desc: "Consistent customer care, transparent billing, and authentic relationship with our patrons.",
      },
    },
    {
      id: "sec-about-values",
      type: "about_values",
      name: "Eco-Friendly & Sustainable Promise",
      isVisible: true,
      props: {
        headline: "Our Sustainable Commitment",
        body: "Plastic reduction through biodegradable golden jute, fair compensation for indigenous artisan communities, and carbon-conscious packaging.",
        ctaText: "Explore Collection",
        ctaLink: "/shop",
      },
    },
  ];
}

// =========================================================================
// 3. SPECIAL E-SHEBA & SERVICES DEFAULT SECTIONS
// =========================================================================
export function getDefaultServicesPageSections() {
  return [
    {
      id: "sec-services-header",
      type: "services_header",
      name: "Special E-Sheba & Procurement Hero",
      isVisible: true,
      props: {
        badge: "Institutional Sourcing & Customized Support",
        headline: "Special E-Sheba & Corporate Solutions",
        subtitle: "Tailor-made institutional procurement, personalized corporate hampers, customized branding, and direct business solutions backed by nationwide delivery.",
      },
    },
    {
      id: "sec-services-list",
      type: "services_list",
      name: "Specialized Service Hubs",
      isVisible: true,
      props: {
        headline: "Our Service Specializations",
        subtitle: "Select a service area to submit an institutional brief or consultation request.",
        service1Title: "Corporate Gift Items",
        service1Desc: "Customized handcrafted packages, corporate branding, packaging preferences & bulk volumes.",
        service2Title: "Industrial Solutions",
        service2Desc: "B2B raw supplies, artisan-grade materials, sourcing requirements and customized production.",
        service3Title: "Special E-Sheba / Services",
        service3Desc: "Direct personalized support, custom bespoke orders, and dedicated account advisory.",
        service4Title: "Bespoke Jute & Agro Packaging",
        service4Desc: "Biodegradable bulk packaging solutions tailored for retail brands and industrial exports.",
      },
    },
    {
      id: "sec-services-form-info",
      type: "services_form_info",
      name: "Consultation Form Details",
      isVisible: true,
      props: {
        headline: "Submit a Tailored Service Inquiry",
        subtitle: "Our corporate desk responds within 24 hours with custom quotes and sample timelines.",
        phoneSupport: "+880 1731214379",
        emailSupport: "shoilpikkabbo@gmail.com",
      },
    },
  ];
}

// =========================================================================
// 4. CONTACT PAGE DEFAULT SECTIONS
// =========================================================================
export function getDefaultContactPageSections() {
  return [
    {
      id: "sec-contact-header",
      type: "contact_header",
      name: "Contact Hero Header",
      isVisible: true,
      props: {
        badge: "We Are Here For You",
        headline: "Get in Touch With SHOILPIKKABBO",
        subtitle: "Have a question about an order, bespoke product, or partnership? Reach out to our dedicated operations desk anytime.",
      },
    },
    {
      id: "sec-contact-details",
      type: "contact_details",
      name: "Customer Care & Office Details",
      isVisible: true,
      props: {
        headline: "Communication Channels",
        primaryPhone: "+880 1731214379",
        secondaryPhone: "+880 1811909068",
        email: "shoilpikkabbo@gmail.com",
        officeAddress: "House 12, Road 4, Sector 3, Uttara, Dhaka - 1230, Bangladesh",
        officeHours: "Saturday - Thursday: 9:00 AM - 8:00 PM",
        whatsappLink: "https://wa.me/8801731214379",
        messengerLink: "https://m.me/shoilpikkabbo",
      },
    },
  ];
}

export function getPageSectionsBySlug(slug: string) {
  switch (slug) {
    case "about":
      return getDefaultAboutPageSections();
    case "services":
    case "e-sheba":
      return getDefaultServicesPageSections();
    case "contact":
      return getDefaultContactPageSections();
    case "home":
    default:
      return getDefaultHomePageSections();
  }
}

export function getPageTitleBySlug(slug: string) {
  switch (slug) {
    case "about":
      return "About Us Page";
    case "services":
    case "e-sheba":
      return "Special E-Sheba & Services Page";
    case "contact":
      return "Contact Us Page";
    case "home":
    default:
      return "Home Page";
  }
}

export class PageService {
  /**
   * Lists all editable CMS pages with their draft/published status
   */
  static async listPages() {
    const slugs = [
      { slug: "home", title: "Home Page", path: "/" },
      { slug: "about", title: "About Us Page", path: "/about" },
      { slug: "services", title: "Special E-Sheba & Services Page", path: "/services" },
      { slug: "contact", title: "Contact Us Page", path: "/contact" },
    ];

    const pages = await Promise.all(
      slugs.map(async (item) => {
        const published = await prisma.pageVersion.findFirst({
          where: { slug: item.slug, status: PageStatus.PUBLISHED },
          orderBy: { version: "desc" },
          select: { version: true, publishedAt: true, updatedAt: true },
        });
        const draft = await prisma.pageVersion.findFirst({
          where: { slug: item.slug, status: PageStatus.DRAFT },
          orderBy: { updatedAt: "desc" },
          select: { version: true, updatedAt: true },
        });
        return {
          slug: item.slug,
          title: item.title,
          path: item.path,
          publishedVersion: published?.version || null,
          publishedAt: published?.publishedAt || null,
          hasDraft: Boolean(draft),
          updatedAt: draft?.updatedAt || published?.updatedAt || null,
        };
      })
    );

    return pages;
  }

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
          title: getPageTitleBySlug(slug),
          status: PageStatus.PUBLISHED,
          version: 1,
          sections: getPageSectionsBySlug(slug) as any,
          publishedAt: new Date(),
          metadata: {
            title: `SHOILPIKKABBO | ${getPageTitleBySlug(slug)}`,
            description: "Authentic Bangladeshi craftsmanship and solutions.",
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
      throw new ApiError(404, `No active draft found for page '${slug}' to publish.`);
    }

    // Archive previously published versions
    await prisma.pageVersion.updateMany({
      where: { slug, status: PageStatus.PUBLISHED },
      data: { status: PageStatus.ARCHIVED },
    });

    // Mark current draft as published
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
   * Retrieves revision history for rollback
   */
  static async getRevisions(slug: string = "home") {
    return prisma.pageVersion.findMany({
      where: { slug },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  }

  /**
   * Restores an older version as the new working draft
   */
  static async restoreRevision(slug: string, revisionId: string, authorId?: string) {
    const revision = await prisma.pageVersion.findUnique({
      where: { id: revisionId },
    });

    if (!revision || revision.slug !== slug) {
      throw new ApiError(404, "Revision not found.");
    }

    const currentPublished = await this.getPublishedPage(slug);
    const nextVersion = currentPublished.version + 1;

    let draft = await prisma.pageVersion.findFirst({
      where: { slug, status: PageStatus.DRAFT },
      orderBy: { updatedAt: "desc" },
    });

    if (draft) {
      draft = await prisma.pageVersion.update({
        where: { id: draft.id },
        data: {
          sections: revision.sections as any,
          title: revision.title,
          metadata: revision.metadata as any,
          authorId,
          updatedAt: new Date(),
        },
      });
    } else {
      draft = await prisma.pageVersion.create({
        data: {
          slug,
          title: revision.title,
          status: PageStatus.DRAFT,
          version: nextVersion,
          sections: revision.sections as any,
          metadata: revision.metadata as any,
          authorId,
        },
      });
    }

    return draft;
  }
}
