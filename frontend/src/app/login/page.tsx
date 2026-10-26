"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Phone, ArrowRight, ShieldCheck } from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/shared/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/account");
    }, 800);
  };

  return (
    <StorefrontLayout>
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md p-8 rounded-3xl border border-brand-border bg-white shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center pb-2">
              <Logo showTagline={false} />
            </div>
            <h1 className="font-heading font-black text-2xl text-charcoal-900">
              Welcome Back
            </h1>
            <p className="text-xs text-charcoal-500">
              Sign in with your phone number to access your order history and saved addresses.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal-800">
                Phone Number
              </label>
              <Input
                required
                type="tel"
                placeholder="017XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-xs font-bold text-charcoal-800">
                  Password
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("A password reset SMS will be sent to your verified mobile number.");
                  }}
                  className="text-[11px] text-forest-800 hover:underline font-semibold"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full shadow-md"
            >
              Sign In
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>

          {/* Quick Demo Fill */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                setPhone("01712345678");
                setPassword("demo1234");
              }}
              className="text-xs text-gold-700 hover:underline font-semibold cursor-pointer"
            >
              Click to autofill sample customer credentials
            </button>
          </div>

          <div className="border-t border-sand pt-4 text-center text-xs text-charcoal-600">
            <span>Don't have an account yet? </span>
            <Link
              href="/register"
              className="font-bold text-forest-800 hover:underline"
            >
              Create Account
            </Link>
          </div>

          {/* Admin shortcut */}
          <div className="pt-2 border-t border-sand text-center">
            <Link
              href="/admin"
              className="text-[11px] text-charcoal-500 hover:text-forest-900 font-semibold"
            >
              Staff & Operations Login ➔
            </Link>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
