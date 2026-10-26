import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, HeartHandshake, ShieldCheck, Truck, ArrowRight } from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CLIENT_INFO } from "@/data/mock-data";

export default function AboutPage() {
  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="primary" className="text-xs px-3 py-1">
            Our Brand Story
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-charcoal-900 font-heading">
            Preserving Artisanal Heritage, <br />
            <span className="text-forest-800">Delivering Modern Reliability</span>
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
            Founded in Dhaka, Bangladesh, <strong>SHOILPIKKABBO</strong> bridges timeless rural craft traditions with high-standards modern e-commerce fulfillment.
          </p>
        </div>

        {/* Brand Story Image + Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 relative aspect-4/3 rounded-2xl overflow-hidden border border-brand-border shadow-md">
            <Image
              src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"
              alt="Bangladeshi Artisan Crafting Pottery"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="lg:col-span-6 space-y-4 text-xs sm:text-sm text-charcoal-700 leading-relaxed">
            <h2 className="font-heading font-extrabold text-2xl text-charcoal-900">
              Who We Are
            </h2>
            <p>
              At <strong>SHOILPIKKABBO</strong>, we believe every handwoven jute basket, finely turned terracotta cup, and precision-manufactured textile tells a story of dignity, patience, and uncompromising craftsmanship.
            </p>
            <p>
              Too often, rural master artisans struggle with logistics, fragile product transit, and delayed payment terms. We created a centralized, verified digital marketplace that ensures transparent artisan compensation while providing consumers and institutions with dependable nationwide delivery and certified quality.
            </p>
            <div className="pt-2">
              <Link href="/shop">
                <Button variant="primary" size="md">
                  Explore Handcrafted Collections
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-white border border-brand-border shadow-xs space-y-3">
            <span className="text-xs font-bold text-forest-800 uppercase tracking-wider">
              Our Purpose
            </span>
            <h3 className="font-heading font-black text-xl text-charcoal-900">
              Our Mission
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
              To be Bangladesh’s most reliable e-commerce gateway for artisanal crafts, organic wellness goods, and institutional procurement—delivering authentic items safely, transparently, and swiftly to every doorstep.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-brand-border shadow-xs space-y-3">
            <span className="text-xs font-bold text-gold-700 uppercase tracking-wider">
              Long-term Outlook
            </span>
            <h3 className="font-heading font-black text-xl text-charcoal-900">
              Our Vision
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
              To elevate Bangladeshi handicraft, sustainable jute goods, and regional enterprise to world-class standards, creating sustainable livelihoods for artisan clusters while maintaining 100% customer satisfaction.
            </p>
          </div>
        </div>

        {/* Three Core Pillars */}
        <div className="p-8 rounded-3xl bg-forest-950 text-sand border border-forest-900 text-center space-y-6">
          <Badge variant="gold" className="text-xs px-3 py-1">
            Our Brand Philosophy
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Delivery • Quality • Reliability
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-left">
            <div className="p-5 rounded-xl bg-forest-900/60 border border-forest-800">
              <Truck className="h-6 w-6 text-gold-500 mb-2" />
              <h4 className="font-heading font-bold text-white text-sm">Delivery</h4>
              <p className="text-xs text-sand/70 mt-1 leading-relaxed">
                Punctual dispatch, specialized shock-proof packaging for ceramics, and delivery across all 64 districts.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-forest-900/60 border border-forest-800">
              <ShieldCheck className="h-6 w-6 text-gold-500 mb-2" />
              <h4 className="font-heading font-bold text-white text-sm">Quality</h4>
              <p className="text-xs text-sand/70 mt-1 leading-relaxed">
                Rigorous inspection of all clay, fabric weave, polymer strength, and cold-pressed oil purity before warehouse acceptance.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-forest-900/60 border border-forest-800">
              <HeartHandshake className="h-6 w-6 text-gold-500 mb-2" />
              <h4 className="font-heading font-bold text-white text-sm">Reliability</h4>
              <p className="text-xs text-sand/70 mt-1 leading-relaxed">
                Audited payment records, direct human phone support, and transparent return policies for your absolute peace of mind.
              </p>
            </div>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
