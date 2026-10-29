"use client";

import * as React from "react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { ClientMockupHome } from "@/components/home/ClientMockupHome";

export default function HomePage() {
  return (
    <StorefrontLayout>
      <ClientMockupHome />
    </StorefrontLayout>
  );
}
