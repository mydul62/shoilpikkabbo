"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Lock, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, user, isLoading: authLoading } = useAuth();

  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
  });

  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // If already logged in, redirect
  React.useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      if (user.role === "ADMIN" || user.role === "STAFF") {
        router.push("/admin");
      } else {
        router.push("/account");
      }
    }
  }, [authLoading, isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.password) {
      setErrorMessage("Please complete all required fields (Name, Phone number, and Password).");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter carefully.");
      return;
    }

    if (!formData.agreedToTerms) {
      setErrorMessage("Please confirm you agree to the Terms and Privacy policy.");
      return;
    }

    setIsLoading(true);
    const res = await register({
      name: formData.fullName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || undefined,
      password: formData.password,
    });
    setIsLoading(false);

    if (res.success) {
      router.push("/account");
    } else {
      setErrorMessage(res.message || "Registration could not be completed. Please try again.");
    }
  };

  return (
    <StorefrontLayout>
      <div className="bg-[#FAF8F5] min-h-[calc(100vh-280px)] py-10 sm:py-16">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
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
            </div>

            {/* Right Column: Register Form & Tabs */}
            <div className="lg:col-span-6 order-1 lg:order-2 bg-white rounded-3xl p-7 sm:p-10 shadow-[0_2px_14px_rgba(0,0,0,0.03)]">
              {/* Header Tabs */}
              <div className="flex items-center gap-8 mb-8 text-base">
                <Link
                  href="/login"
                  className="font-medium text-gray-400 hover:text-[#0D3B37] transition-colors pb-1.5"
                >
                  Sign in
                </Link>
                <span className="font-bold text-[#0D3B37] border-b-2 border-[#0D3B37] pb-1.5 cursor-default">
                  Create account —
                </span>
              </div>

              {/* Title & Subtitle */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D3B37] leading-tight mb-2">
                A considered beginning.
              </h1>
              <p className="text-sm sm:text-base text-gray-500 font-normal mb-6">
                A few details to create your customer account.
              </p>

              {/* Error Alert */}
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
                    Full name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full h-11 px-4 bg-[#FAF8F5] border border-gray-200 focus:border-[#E0592A] focus:bg-white rounded-xl text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0D3B37] uppercase tracking-wider block mb-1.5">
                    Phone number (11 digits) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="01XXXXXXXXX"
                    className="w-full h-11 px-4 bg-[#FAF8F5] border border-gray-200 focus:border-[#E0592A] focus:bg-white rounded-xl text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0D3B37] uppercase tracking-wider block mb-1.5">
                    Email address (optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="you@example.com"
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
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="Minimum 6 characters"
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

                <div>
                  <label className="text-xs font-bold text-[#0D3B37] uppercase tracking-wider block mb-1.5">
                    Confirm password *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    placeholder="Re-enter your password"
                    className="w-full h-11 px-4 bg-[#FAF8F5] border border-gray-200 focus:border-[#E0592A] focus:bg-white rounded-xl text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all"
                  />
                </div>

                {/* Terms Checkbox */}
                <label className="flex items-start gap-2.5 pt-1 text-xs sm:text-sm text-gray-600 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={formData.agreedToTerms}
                    onChange={(e) =>
                      setFormData({ ...formData, agreedToTerms: e.target.checked })
                    }
                    className="mt-0.5 w-4 h-4 text-[#0D3B37] rounded-md focus:ring-[#0D3B37]"
                  />
                  <span>I agree to the Terms of Service and Privacy policy.</span>
                </label>

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
                        <span>Registering account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create account</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Verification Notice */}
                <div className="flex items-center gap-2 text-xs text-gray-400 font-normal pt-2">
                  <Lock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>Your account details are securely encrypted and stored.</span>
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
