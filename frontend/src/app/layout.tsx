import type { Metadata } from "next";
import { Inter, Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SHOILPIKKABBO | Delivery • Quality • Reliability",
  description:
    "Authentic Bangladeshi handicrafts, premium jute items, industrial products, lifestyle essentials, and custom corporate e-sheba solutions.",
  keywords: [
    "SHOILPIKKABBO",
    "Handicraft",
    "Jute Items",
    "Polymer",
    "Corporate Gifts",
    "Industrial Solutions",
    "Bangladesh E-Commerce",
    "Special E-Sheba",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-charcoal-900 font-sans selection:bg-forest-100 selection:text-forest-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
