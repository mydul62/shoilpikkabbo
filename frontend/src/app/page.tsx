import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
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
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-b from-forest-950 via-forest-900 to-forest-950 text-sand py-16 lg:py-24 overflow-hidden border-b border-forest-800">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-forest-800/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-gold-600/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-800/80 border border-gold-500/40 text-gold-400 text-xs font-semibold backdrop-blur-xs">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Premier Bangladeshi Commerce • Delivery • Quality • Reliability</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading tracking-tight leading-tight">
                Authentic Craftsmanship, <br />
                <span className="text-gold-500">Pure Quality & Reliability</span>
              </h1>

              <p className="text-sand/80 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Explore handwoven natural jute, genuine terracotta ceramics, export-grade cotton garments, sustainable polymers, and custom corporate gift solutions tailored for Bangladesh and beyond.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link href="/shop">
                  <Button variant="accent" size="lg" className="shadow-lg">
                    <span>Explore Products</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/e-sheba">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-sand/40 text-sand hover:bg-forest-800 hover:text-white"
                  >
                    Special E-Sheba
                  </Button>
                </Link>
              </div>

              {/* Verified Trust Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-forest-800/80 text-center lg:text-left">
                <div>
                  <p className="font-heading font-black text-xl text-gold-500">10+</p>
                  <p className="text-[11px] text-sand/70 uppercase tracking-wider">
                    Core Categories
                  </p>
                </div>
                <div>
                  <p className="font-heading font-black text-xl text-white">100%</p>
                  <p className="text-[11px] text-sand/70 uppercase tracking-wider">
                    Authentic Sourced
                  </p>
                </div>
                <div>
                  <p className="font-heading font-black text-xl text-white">64</p>
                  <p className="text-[11px] text-sand/70 uppercase tracking-wider">
                    Districts Delivery
                  </p>
                </div>
              </div>
            </div>

            {/* Right Hero Card Display */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl p-2 bg-gradient-to-tr from-gold-500/20 via-forest-700/30 to-forest-800/40 border border-gold-500/30 shadow-2xl backdrop-blur-xs">
                <div className="relative h-80 sm:h-96 w-full rounded-xl overflow-hidden bg-forest-900">
                  <Image
                    src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"
                    alt="Artisanal Terracotta Pottery"
                    fill
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-forest-950/80 backdrop-blur-md border border-forest-800 flex items-center justify-between">
                    <div>
                      <p className="text-gold-400 text-xs font-semibold">Featured Craft</p>
                      <h4 className="text-white text-sm font-bold font-heading">
                        Dhamrai Terracotta Tea Set
                      </h4>
                    </div>
                    <Link href="/products/handcrafted-terracotta-ceramic-tea-set">
                      <Button variant="accent" size="sm">
                        View Item
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Value Propositions Bar */}
      <section className="bg-sand/60 border-b border-brand-border py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center p-3">
            <Truck className="h-6 w-6 text-forest-800 mb-1.5" />
            <h4 className="text-xs font-bold text-charcoal-900 uppercase tracking-wide">
              Nationwide Delivery
            </h4>
            <p className="text-[11px] text-charcoal-500">Dhaka & all 64 districts</p>
          </div>
          <div className="flex flex-col items-center p-3">
            <ShieldCheck className="h-6 w-6 text-forest-800 mb-1.5" />
            <h4 className="text-xs font-bold text-charcoal-900 uppercase tracking-wide">
              Verified Quality
            </h4>
            <p className="text-[11px] text-charcoal-500">Artisan direct inspection</p>
          </div>
          <div className="flex flex-col items-center p-3">
            <Layers className="h-6 w-6 text-forest-800 mb-1.5" />
            <h4 className="text-xs font-bold text-charcoal-900 uppercase tracking-wide">
              10 Catalog Niches
            </h4>
            <p className="text-[11px] text-charcoal-500">Retail & corporate solutions</p>
          </div>
          <div className="flex flex-col items-center p-3">
            <Clock className="h-6 w-6 text-forest-800 mb-1.5" />
            <h4 className="text-xs font-bold text-charcoal-900 uppercase tracking-wide">
              Direct Support
            </h4>
            <p className="text-[11px] text-charcoal-500">{CLIENT_INFO.phonePrimary}</p>
          </div>
        </div>
      </section>

      {/* 3. Featured Categories Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-forest-800 uppercase tracking-wider">
              Curated Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 font-heading mt-1">
              Explore Our Product Categories
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-forest-800 hover:text-forest-700 flex items-center gap-1.5"
          >
            <span>View All Categories</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {MOCK_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.isService ? "/e-sheba" : `/shop?category=${cat.slug}`}
              className="group relative flex flex-col rounded-2xl border border-brand-border bg-white overflow-hidden shadow-xs hover:shadow-md hover:border-forest-700 transition-all duration-300"
            >
              <div className="relative aspect-4/3 w-full bg-sand/50 overflow-hidden">
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-charcoal-950/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-heading font-bold text-sm leading-tight drop-shadow-sm">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-sand/80 mt-0.5">
                    {cat.isService ? "Service Inquiries" : `${cat.itemCount} items`}
                  </p>
                </div>
              </div>
            </Link>
          ))}
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
