"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/shared/Logo";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
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
              Create an Account
            </h1>
            <p className="text-xs text-charcoal-500">
              Register to track your deliveries, save shipping addresses, and receive special offers.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal-800">
                Full Name *
              </label>
              <Input
                required
                placeholder="e.g. Tanvir Ahmed"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal-800">
                Phone Number *
              </label>
              <Input
                required
                type="tel"
                placeholder="017XXXXXXXX"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal-800">
                Email Address (Optional)
              </label>
              <Input
                type="email"
                placeholder="yourname@gmail.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal-800">
                Password *
              </label>
              <Input
                required
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full shadow-md"
            >
              Register Account
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>

          <div className="border-t border-sand pt-4 text-center text-xs text-charcoal-600">
            <span>Already have an account? </span>
            <Link
              href="/login"
              className="font-bold text-forest-800 hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
