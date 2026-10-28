"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Lock, Eye, EyeOff } from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("nusrat@example.com");
  const [password, setPassword] = React.useState("••••••••••");
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/account");
    }, 600);
  };

  return (
    <StorefrontLayout>
      <div className="bg-[#F7F4EE] min-h-[calc(100vh-280px)] py-10 sm:py-16">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Left Column: Lifestyle photo & copy (6 cols) */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] rounded-[4px] overflow-hidden bg-[#EAE5DC] border border-[#E0D9CD]">
                <Image
                  src="/images/auth-lifestyle.png"
                  alt="Woven jute baskets with fresh foliage on sunlit stone ledge"
                  fill
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-cover"
                  priority
                />
              </div>

              <div className="mt-6">
                <span className="text-[10px] font-semibold text-[#B85D38] uppercase tracking-widest block mb-2">
                  YOUR EVERYDAY, A LITTLE MORE PERSONAL
                </span>
                <h2 className="font-serif text-2xl sm:text-[32px] text-[#143527] font-normal leading-snug mb-2">
                  Keep your favourites close.
                </h2>
                <p className="text-[13px] text-[#6F7771] font-light leading-relaxed max-w-md">
                  Follow your orders and keep your delivery details ready for next
                  time.
                </p>
              </div>
            </div>

            {/* Right Column: Sign In Form & Tabs (6 cols) */}
            <div className="lg:col-span-6">
              {/* Header Tabs */}
              <div className="flex items-center gap-8 mb-8 text-[13.5px]">
                <span className="font-medium text-[#143527] border-b-2 border-[#143527] pb-1 cursor-default">
                  Sign in —
                </span>
                <Link
                  href="/register"
                  className="font-light text-[#7A837C] hover:text-[#143527] transition-colors pb-1"
                >
                  Create account
                </Link>
              </div>

              {/* Title & Subtitle */}
              <h1 className="font-serif text-3xl sm:text-[40px] text-[#143527] font-normal leading-tight mb-2">
                Welcome back.
              </h1>
              <p className="text-[13px] text-[#6F7771] font-light mb-8">
                Sign in to your SHOILPIKKABBO account.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[12px] font-medium text-[#143527] block mb-1.5">
                    Email address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-11 px-3.5 bg-white border border-[#D5CDC0] rounded-[2px] text-[13px] text-[#143527] focus:outline-none focus:border-[#143527] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[12px] font-medium text-[#143527] block mb-1.5">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••"
                      className="w-full h-11 px-3.5 pr-10 bg-white border border-[#D5CDC0] rounded-[2px] text-[13px] text-[#143527] focus:outline-none focus:border-[#143527] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C948E] hover:text-[#143527] cursor-pointer"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot Password */}
                <div className="flex items-center justify-between text-[11.5px] text-[#6F7771] pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-light">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 text-[#143527] rounded-[2px] focus:ring-[#143527]"
                    />
                    <span>Keep me signed in</span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      alert("Password reset instructions will be sent to your email address.")
                    }
                    className="hover:text-[#143527] font-light cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-[#143527] hover:bg-[#1B4332] text-white text-[13.5px] font-medium rounded-[3px] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-75"
                  >
                    <span>{isLoading ? "Signing in..." : "Sign in"}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Security Advisory */}
                <div className="flex items-center gap-2 text-[11px] text-[#8C948E] font-light pt-2">
                  <Lock className="w-3.5 h-3.5 text-[#8C948E] shrink-0" />
                  <span>We never ask for payment PINs or OTPs by message.</span>
                </div>
              </form>

              {/* Guest Checkout Alternative */}
              <div className="mt-10 pt-6">
                <p className="text-[12px] text-[#6F7771] font-light mb-3">
                  Just placing an order? You can check out as a guest.
                </p>
                <Link
                  href="/shop"
                  className="h-10 px-5 bg-white hover:bg-[#F3EFE7] border border-[#D5CDC0] text-[#143527] text-[12.5px] font-medium rounded-[3px] inline-flex items-center gap-2 transition-colors cursor-pointer w-fit shadow-xs"
                >
                  <span>Continue shopping</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
