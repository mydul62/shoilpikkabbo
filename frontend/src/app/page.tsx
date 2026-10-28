import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Truck,
  Layers,
  HeartHandshake,
  CheckCircle2,
  PhoneCall,
  Clock,
} from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MOCK_CATEGORIES,
  MOCK_PRODUCTS,
  CLIENT_INFO,
} from "@/data/mock-data";

export default function HomePage() {
  const featuredProducts = MOCK_PRODUCTS.filter((p) => p.isFeatured);
  const newArrivals = MOCK_PRODUCTS.filter((p) => p.isNewArrival);

  return (
    <StorefrontLayout>
      {/* 1. Hero Section - Pixel-Exact to User Design */}
      <section className="relative bg-[#FAF7F2] py-8 sm:py-12 lg:py-16 border-b border-[#EAE3D6] overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
            {/* Left Column: Typography & Action */}
            <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-center">
              {/* Overline Tag */}
              <p className="text-[11px] sm:text-xs font-bold tracking-[0.16em] uppercase text-[#B85D38] mb-4 sm:mb-6">
                ROOTED IN CRAFT. MADE FOR LIVING.
              </p>

              {/* Main Headline in Editorial Serif */}
              <h1 className="font-serif text-[42px] sm:text-[54px] lg:text-[66px] xl:text-[76px] leading-[1.04] text-[#132C20] font-normal tracking-tight mb-5 sm:mb-6">
                A little craft.<br />
                A lot of<br />
                character.
              </h1>

              {/* Sub-paragraph */}
              <p className="text-[#555A54] text-sm sm:text-base lg:text-[17px] leading-relaxed max-w-[420px] mb-7 sm:mb-8 font-light">
                Discover thoughtful objects, everyday essentials and services that bring more possibility to your day.
              </p>

              {/* Explore Button */}
              <div>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 bg-[#173829] hover:bg-[#0F261B] text-white text-xs sm:text-sm font-medium rounded-xs transition-colors shadow-xs group"
                >
                  <span>Explore the collection</span>
                  <ArrowUpRight className="h-4 w-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>

              {/* Bottom Feature Teaser / "01" */}
              <div className="pt-8 sm:pt-12 mt-8 sm:mt-12 border-t border-[#EAE3D6] flex items-center gap-4">
                <span className="font-serif text-3xl sm:text-4xl font-normal text-[#B85D38] leading-none select-none">
                  01
                </span>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#14261D]">
                    THE EVERYDAY EDIT
                  </span>
                  <span className="text-xs text-[#6B665F] font-light mt-0.5">
                    Natural textures. Considered details.
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Asset with Floating Card */}
            <div className="lg:col-span-7 xl:col-span-7 relative">
              <div className="relative w-full aspect-[4/3] sm:aspect-[1.35/1] rounded-2xl overflow-hidden shadow-sm bg-[#EFE9DF]">
                <Image
                  src="/images/hero-artisan.png"
                  alt="Handwoven artisanal jute baskets, natural linen and ceramics"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />

                {/* Floating Card Link in Bottom Left */}
                <Link
                  href="/shop?category=jute-items"
                  className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-white/95 backdrop-blur-xs px-4 sm:px-5 py-3 sm:py-3.5 shadow-md border border-[#EAE3D6] flex items-center justify-between gap-5 sm:gap-8 hover:bg-white transition-all group"
                >
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#737069]">
                      THE NATURAL COLLECTION
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-[#14261D] group-hover:text-[#B85D38] transition-colors mt-0.5">
                      Woven into everyday life
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-[#14261D] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Discovery Section - Exact Match with Client Reference */}
      <section className="bg-[#F7F4EE] py-14 sm:py-18 lg:py-20 border-b border-[#EAE3D5]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          {/* Header Row: Overline, Title, and Right 'Explore all categories' Link */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
            <div>
              <p className="text-[11px] sm:text-xs font-bold tracking-[0.16em] uppercase text-[#B85D38] mb-2 sm:mb-3">
                MANY NEEDS. ONE DESTINATION.
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[46px] font-normal text-[#143527] leading-[1.1] tracking-tight">
                Find your everyday.
              </h2>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-[13px] sm:text-[14px] font-medium text-[#143527] hover:text-[#B85D38] transition-colors self-start sm:self-auto group"
            >
              <span>Explore all categories</span>
              <ArrowUpRight className="w-4 h-4 text-[#143527] group-hover:text-[#B85D38] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* 3 Featured Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-8 sm:mb-10">
            {/* 1. Handicrafts */}
            <Link
              href="/shop?category=handicraft"
              className="group block"
            >
              <div className="relative w-full aspect-[1.65/1] rounded-2xl overflow-hidden bg-[#E8E2D6] shadow-[0_1px_3px_rgba(0,0,0,0.03)] mb-4">
                <Image
                  src="/images/category-handicrafts.png"
                  alt="Handcrafted ceramic pottery vase with dried botanical branch"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl sm:text-[25px] font-normal text-[#143527] group-hover:text-[#B85D38] transition-colors leading-tight">
                  Handicrafts
                </h3>
                <ArrowUpRight className="w-4 h-4 text-[#143527] group-hover:text-[#B85D38] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </div>
              <p className="text-[12.5px] sm:text-[13px] text-[#6A736C] font-light mt-1">
                Objects with a human touch
              </p>
            </Link>

            {/* 2. Jute Items */}
            <Link
              href="/shop?category=jute-items"
              className="group block"
            >
              <div className="relative w-full aspect-[1.65/1] rounded-2xl overflow-hidden bg-[#E8E2D6] shadow-[0_1px_3px_rgba(0,0,0,0.03)] mb-4">
                <Image
                  src="/images/category-jute.png"
                  alt="Eco-friendly golden jute tote bag with dark green handles"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl sm:text-[25px] font-normal text-[#143527] group-hover:text-[#B85D38] transition-colors leading-tight">
                  Jute Items
                </h3>
                <ArrowUpRight className="w-4 h-4 text-[#143527] group-hover:text-[#B85D38] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </div>
              <p className="text-[12.5px] sm:text-[13px] text-[#6A736C] font-light mt-1">
                Naturally useful, beautifully simple
              </p>
            </Link>

            {/* 3. Corporate Gift Items */}
            <Link
              href="/shop?category=corporate-gift-items"
              className="group block"
            >
              <div className="relative w-full aspect-[1.65/1] rounded-2xl overflow-hidden bg-[#E8E2D6] shadow-[0_1px_3px_rgba(0,0,0,0.03)] mb-4">
                <Image
                  src="/images/category-corporate.png"
                  alt="Kraft paper corporate gift box with dark green ribbon and ceramic tea mug"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl sm:text-[25px] font-normal text-[#143527] group-hover:text-[#B85D38] transition-colors leading-tight">
                  Corporate Gift Items
                </h3>
                <ArrowUpRight className="w-4 h-4 text-[#143527] group-hover:text-[#B85D38] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </div>
              <p className="text-[12.5px] sm:text-[13px] text-[#6A736C] font-light mt-1">
                A thoughtful way to say thank you
              </p>
            </Link>
          </div>

          {/* 7 Pill Tags for Remaining Categories */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2 sm:pt-4">
            <Link
              href="/shop?category=polymer"
              className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-full border border-[#D5CDC0] bg-[#F7F4EE] hover:bg-white hover:border-[#143527] text-[#2D3F33] hover:text-[#143527] text-[12px] sm:text-[12.5px] font-normal transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] group"
            >
              <span>Polymer</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#6A736C] group-hover:text-[#143527] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <Link
              href="/shop?category=baby-items"
              className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-full border border-[#D5CDC0] bg-[#F7F4EE] hover:bg-white hover:border-[#143527] text-[#2D3F33] hover:text-[#143527] text-[12px] sm:text-[12.5px] font-normal transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] group"
            >
              <span>Baby Items</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#6A736C] group-hover:text-[#143527] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <Link
              href="/shop?category=rudiment-garments"
              className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-full border border-[#D5CDC0] bg-[#F7F4EE] hover:bg-white hover:border-[#143527] text-[#2D3F33] hover:text-[#143527] text-[12px] sm:text-[12.5px] font-normal transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] group"
            >
              <span>Rudiment Garments</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#6A736C] group-hover:text-[#143527] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <Link
              href="/shop?category=industrial-solutions"
              className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-full border border-[#D5CDC0] bg-[#F7F4EE] hover:bg-white hover:border-[#143527] text-[#2D3F33] hover:text-[#143527] text-[12px] sm:text-[12.5px] font-normal transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] group"
            >
              <span>Industrial Solutions</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#6A736C] group-hover:text-[#143527] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <Link
              href="/shop?category=health-and-beauty"
              className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-full border border-[#D5CDC0] bg-[#F7F4EE] hover:bg-white hover:border-[#143527] text-[#2D3F33] hover:text-[#143527] text-[12px] sm:text-[12.5px] font-normal transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] group"
            >
              <span>Health & Beauty (Cosmetics, Food, Medicine)</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#6A736C] group-hover:text-[#143527] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <Link
              href="/shop?category=agriculture"
              className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-full border border-[#D5CDC0] bg-[#F7F4EE] hover:bg-white hover:border-[#143527] text-[#2D3F33] hover:text-[#143527] text-[12px] sm:text-[12.5px] font-normal transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] group"
            >
              <span>Agriculture</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#6A736C] group-hover:text-[#143527] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <Link
              href="/e-sheba"
              className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-full border border-[#D5CDC0] bg-[#F7F4EE] hover:bg-white hover:border-[#143527] text-[#2D3F33] hover:text-[#143527] text-[12px] sm:text-[12.5px] font-normal transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] group"
            >
              <span>Special E-Sheba / Services</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#6A736C] group-hover:text-[#143527] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Featured Products Spotlight */}
      <section className="py-12 bg-white border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-gold-700 uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Handpicked Excellence</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 font-heading mt-1">
                Featured Products
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold text-forest-800 hover:text-forest-700 flex items-center gap-1.5"
            >
              <span>Browse Catalog</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Special E-Sheba Introduction Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-sand p-8 sm:p-12 border border-forest-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gold-600/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <Badge variant="gold" className="text-xs px-3 py-1">
                B2B & Custom Solutions
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                Special E-Sheba — Institutional & Custom Procurement
              </h2>
              <p className="text-sand/80 text-sm leading-relaxed max-w-2xl">
                Need customized corporate gifts, bespoke handicraft production runs, tailored industrial components, or specialized institutional procurement? Submit an inquiry and our dedicated team will consult directly with you.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs text-sand/90">
                  <CheckCircle2 className="h-4 w-4 text-gold-500" />
                  <span>Custom Brand Logo Embossing</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-sand/90">
                  <CheckCircle2 className="h-4 w-4 text-gold-500" />
                  <span>Bulk Corporate Tier Pricing</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-sand/90">
                  <CheckCircle2 className="h-4 w-4 text-gold-500" />
                  <span>Dedicated Account Manager</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <Link href="/e-sheba" className="w-full">
                <Button variant="accent" size="lg" className="w-full shadow-lg">
                  Submit Service Inquiry
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <a
                href={`tel:${CLIENT_INFO.phonePrimary}`}
                className="w-full"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-sand/40 text-sand hover:bg-forest-800"
                >
                  <PhoneCall className="h-4 w-4 mr-2" />
                  Call: {CLIENT_INFO.phonePrimary}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. New Arrivals Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-forest-800 uppercase tracking-wider">
              Fresh Inventory
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 font-heading mt-1">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-forest-800 hover:text-forest-700 flex items-center gap-1.5"
          >
            <span>View All Products</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 7. Brand Values & Quality Assurance */}
      <section className="bg-sand/40 border-t border-brand-border py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <Badge variant="primary" className="text-xs px-3 py-1">
            Why Choose SHOILPIKKABBO
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 font-heading max-w-2xl mx-auto">
            Committed to Quality, Empowering Artisans, Serving Businesses
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 max-w-2xl mx-auto leading-relaxed">
            Every product in our store is crafted or sourced with strict adherence to durability, ecological sustainability, and ethical trade standards across Bangladesh.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 text-left">
            <div className="p-6 rounded-2xl bg-white border border-brand-border shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center mb-4">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-charcoal-900 mb-2">
                Ethical Artisan Partnerships
              </h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Directly supporting local potteries, weavers, and small-batch fabricators without exploitative middleman markups.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-brand-border shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-charcoal-900 mb-2">
                Rigorous Quality Verification
              </h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Every single item undergoes physical inspection for material authenticity, dimension accuracy, and finish quality prior to dispatch.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-brand-border shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center mb-4">
                <Truck className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-charcoal-900 mb-2">
                Punctual & Secure Delivery
              </h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Protective corrugated bubble packaging tailored for fragile ceramics, ensuring your order arrives in pristine condition.
              </p>
            </div>
          </div>
        </div>
      </section>
    </StorefrontLayout>
  );
}
