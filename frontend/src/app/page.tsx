"use client";

import * as React from "react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { ClientMockupHome } from "@/components/home/ClientMockupHome";

export default function HomePage() {
  React.useEffect(() => {
    // Disable browser automatic scroll restoration so page reload always begins at the top hero section
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, []);

  return (
    <StorefrontLayout>
      <ClientMockupHome />
    </StorefrontLayout>
  );
}
