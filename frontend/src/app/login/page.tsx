"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpRight, Lock, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { useAuth } from "@/context/AuthContext";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  const { login, isAuthenticated, user, isLoading: authLoading } = useAuth();

  const [identifier, setIdentifier] = React.useState("01731214379");
  const [password, setPassword] = React.useState("admin1234");
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // If already logged in, redirect
  React.useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      if (redirectPath) {
        router.push(redirectPath);
      } else if (user.role === "ADMIN" || user.role === "STAFF") {
        router.push("/admin");
      } else {
        router.push("/account");
      }
    }
  }, [authLoading, isAuthenticated, user, redirectPath, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim()) {
      setErrorMessage("Please enter your email address or phone number.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsLoading(true);
    const res = await login(identifier.trim(), password);
    setIsLoading(false);

    if (res.success) {
      if (redirectPath) {
        router.push(redirectPath);
      } else if (res.role === "ADMIN" || res.role === "STAFF") {
        router.push("/admin");
      } else {
        router.push("/account");
      }
    } else {
      setErrorMessage(res.message || "Invalid credentials. Please verify your details.");
    }
  };

  return (
    <StorefrontLayout>
      <div className="bg-[#FAF8F5] min-h-[calc(100vh-280px)] py-10 sm:py-16">
        <div className="max-w-[1524px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Column: Lifestyle photo & copy */}
            <div className="lg:col-span-6 order-2 lg:order-1 space-y-6">
              <div className="relative aspect-[16/9] sm:aspect-[4/3] rounded-3xl overflow-hidden bg-white shadow-[0_2px_14px_rgba(0,0,0,0.03)]">
                <Image
                  src="/images/auth-lifestyle.png"
                  alt="Woven jute baskets with fresh foliage on sunlit stone ledge"
                  fill
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-cover"
                  priority
                />
              </div>

              <div>
                <span className="text-xs font-bold text-[#E0592A] uppercase tracking-wider block mb-2">
                  YOUR EVERYDAY, A LITTLE MORE PERSONAL
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D3B37] leading-snug mb-2">
                  Keep your favourites close.
                </h2>
                <p className="text-sm sm:text-base text-gray-600 font-normal leading-relaxed max-w-md">
                  Follow your orders, verify payments, and manage your artisanal selections.
                </p>
              </div>

              {/* Demo Accounts Preset Helper */}
              <div className="p-5 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3">
                <p className="text-xs font-bold text-[#0D3B37] uppercase tracking-wider">Quick Demo Accounts:</p>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIdentifier("01731214379");
                      setPassword("admin1234");
                      setErrorMessage(null);
                    }}
                    className="px-3.5 py-1.5 bg-[#FAF8F5] hover:bg-[#0D3B37] hover:text-white rounded-xl text-xs font-bold text-[#0D3B37] transition-all cursor-pointer"
                  >
                    Admin (01731214379)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIdentifier("01712345678");
                      setPassword("demo1234");
                      setErrorMessage(null);
                    }}
                    className="px-3.5 py-1.5 bg-[#FAF8F5] hover:bg-[#0D3B37] hover:text-white rounded-xl text-xs font-bold text-[#0D3B37] transition-all cursor-pointer"
                  >
                    Customer (01712345678)
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Sign In Form & Tabs */}
            <div className="lg:col-span-6 order-1 lg:order-2 bg-white rounded-3xl p-7 sm:p-10 shadow-[0_2px_14px_rgba(0,0,0,0.03)]">
              {/* Header Tabs */}
              <div className="flex items-center gap-8 mb-8 text-base">
                <span className="font-bold text-[#0D3B37] border-b-2 border-[#0D3B37] pb-1.5 cursor-default">
                  Sign in —
                </span>
                <Link
                  href="/register"
                  className="font-medium text-gray-400 hover:text-[#0D3B37] transition-colors pb-1.5"
                >
                  Create account
                </Link>
              </div>

              {/* Title & Subtitle */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D3B37] leading-tight mb-2">
                Welcome back.
              </h1>
              <p className="text-sm sm:text-base text-gray-500 font-normal mb-6">
                Sign in with your phone number or email address.
              </p>

              {/* Error Message Alert */}
              {errorMessage && (
                <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#0D3B37] uppercase tracking-wider block mb-1.5">
                    Email address or Phone number *
                  </label>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="01731214379 or you@example.com"
                    className="w-full h-11 px-4 bg-[#FAF8F5] border border-gray-200 focus:border-[#E0592A] focus:bg-white rounded-xl text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0D3B37] uppercase tracking-wider block mb-1.5">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••"
                      className="w-full h-11 px-4 pr-11 bg-[#FAF8F5] border border-gray-200 focus:border-[#E0592A] focus:bg-white rounded-xl text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0D3B37] cursor-pointer"
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
                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-[#0D3B37] rounded-md focus:ring-[#0D3B37]"
                    />
                    <span>Keep me signed in</span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      alert("Password reset assistance: Please contact support at shoilpikkabbo@gmail.com or 01731214379.")
                    }
                    className="hover:text-[#0D3B37] font-semibold cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-[#0D3B37] hover:bg-[#E0592A] text-white text-sm font-bold rounded-xl inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-75"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying credentials...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign in</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Security Advisory */}
                <div className="flex items-center gap-2 text-xs text-gray-400 font-normal pt-2">
                  <Lock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>Secure SSL authenticated session. We never share your credentials.</span>
                </div>
              </form>

              {/* Guest Checkout Alternative */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-xs sm:text-sm text-gray-500 mb-3">
                  Just placing an order? You can check out as a guest.
                </p>
                <Link
                  href="/shop"
                  className="h-11 px-6 bg-[#FAF8F5] hover:bg-[#F3EFE7] text-[#0D3B37] text-sm font-bold rounded-xl inline-flex items-center gap-2 transition-colors cursor-pointer w-fit"
                >
                  <span>Continue shopping</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <StorefrontLayout>
          <div className="min-h-[500px] flex items-center justify-center bg-[#F7F4EE]">
            <Loader2 className="w-8 h-8 text-[#143527] animate-spin" />
          </div>
        </StorefrontLayout>
      }
    >
      <LoginContent />
    </React.Suspense>
  );
}

