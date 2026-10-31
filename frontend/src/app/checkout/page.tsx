"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, Check, ShieldCheck, AlertCircle, Loader2, Tag } from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { useCart, defaultInitialItems } from "@/context/CartContext";
import { useSettings } from "@/context/SettingsContext";
import { useAuth } from "@/context/AuthContext";
import { CLIENT_INFO } from "@/data/mock-data";

// All 64 Districts of Bangladesh
export const BANGLADESH_DISTRICTS = [
  { en: "Dhaka", bn: "ঢাকা" },
  { en: "Chattogram", bn: "চট্টগ্রাম" },
  { en: "Gazipur", bn: "গাজীপুর" },
  { en: "Narayanganj", bn: "নারায়ণগঞ্জ" },
  { en: "Sylhet", bn: "সিলেট" },
  { en: "Rajshahi", bn: "রাজশাহী" },
  { en: "Khulna", bn: "খুলনা" },
  { en: "Barishal", bn: "বরিশাল" },
  { en: "Rangpur", bn: "রংপুর" },
  { en: "Mymensingh", bn: "ময়মনসিংহ" },
  { en: "Cumilla", bn: "কুমিল্লা" },
  { en: "Bogura", bn: "বগুড়া" },
  { en: "Cox's Bazar", bn: "কক্সবাজার" },
  { en: "Bagerhat", bn: "বাগেরহাট" },
  { en: "Bandarban", bn: "বান্দরবান" },
  { en: "Barguna", bn: "বরগুনা" },
  { en: "Bhola", bn: "ভোলা" },
  { en: "Brahmanbaria", bn: "ব্রাহ্মণবাড়িয়া" },
  { en: "Chandpur", bn: "চাঁদপুর" },
  { en: "Chapainawabganj", bn: "চাঁপাইনবাবগঞ্জ" },
  { en: "Chuadanga", bn: "চুয়াডাঙ্গা" },
  { en: "Dinajpur", bn: "দিনাজপুর" },
  { en: "Faridpur", bn: "ফরিদপুর" },
  { en: "Feni", bn: "ফেনী" },
  { en: "Gaibandha", bn: "গাইবান্ধা" },
  { en: "Gopalganj", bn: "গোপালগঞ্জ" },
  { en: "Habiganj", bn: "হবিগঞ্জ" },
  { en: "Jamalpur", bn: "জামালপুর" },
  { en: "Jashore", bn: "যশোর" },
  { en: "Jhalokathi", bn: "ঝালকাঠি" },
  { en: "Jhenaidah", bn: "ঝিনাইদহ" },
  { en: "Joypurhat", bn: "জয়পুরহাট" },
  { en: "Khagrachhari", bn: "খাগড়াছড়ি" },
  { en: "Kishoreganj", bn: "কিশোরগঞ্জ" },
  { en: "Kurigram", bn: "কুড়িগ্রাম" },
  { en: "Kushtia", bn: "কুষ্টিয়া" },
  { en: "Lakshmipur", bn: "লক্ষ্মীপুর" },
  { en: "Lalmonirhat", bn: "লালমনিরহাট" },
  { en: "Madaripur", bn: "মাদারীপুর" },
  { en: "Magura", bn: "মাগুরা" },
  { en: "Manikganj", bn: "মানিকগঞ্জ" },
  { en: "Meherpur", bn: "মেহেরপুর" },
  { en: "Moulvibazar", bn: "মৌলভীবাজার" },
  { en: "Munshiganj", bn: "মুন্সীগঞ্জ" },
  { en: "Naogaon", bn: "নওগাঁ" },
  { en: "Narail", bn: "নড়াইল" },
  { en: "Narsingdi", bn: "নরসিংদী" },
  { en: "Natore", bn: "নাটোর" },
  { en: "Netrokona", bn: "নেত্রকোণা" },
  { en: "Nilphamari", bn: "নীলফামারী" },
  { en: "Noakhali", bn: "নোয়াখালী" },
  { en: "Pabna", bn: "পাবনা" },
  { en: "Panchagarh", bn: "পঞ্চগড়" },
  { en: "Patuakhali", bn: "পটুয়াখালী" },
  { en: "Pirojpur", bn: "পিরোজপুর" },
  { en: "Rajbari", bn: "রাজবাড়ী" },
  { en: "Rangamati", bn: "রাঙ্গামাটি" },
  { en: "Satkhira", bn: "সাতক্ষীরা" },
  { en: "Shariatpur", bn: "শরীয়তপুর" },
  { en: "Sherpur", bn: "শেরপুর" },
  { en: "Sirajganj", bn: "সিরাজগঞ্জ" },
  { en: "Sunamganj", bn: "সুনামগঞ্জ" },
  { en: "Tangail", bn: "টাঙ্গাইল" },
  { en: "Thakurgaon", bn: "ঠাকুরগাঁও" },
];

// Comprehensive Real Areas & Thanas inside Dhaka
export const DHAKA_AREAS = [
  "Adabor (আদাবর)",
  "Agargaon (আগারগাঁও)",
  "Airport / Kawla (এয়ারপোর্ট / কাওলা)",
  "Ashulia (আশুলিয়া)",
  "Azimpur (আজিমপুর)",
  "Badda (বাড্ডা)",
  "Bakshibazar (বকশীবাজার)",
  "Banani (বনানী)",
  "Banani DOHS (বনানী ডিওএইচএস)",
  "Banasree (বনশ্রী)",
  "Banglamotor (বাংলামোটর)",
  "Baridhara (বারিধারা)",
  "Baridhara DOHS (বারিধারা ডিওএইচএস)",
  "Basabo (বাসাবো)",
  "Bashundhara R/A (বসুন্ধরা আ/এ)",
  "Cantonment (সেনানিবাস)",
  "Chawkbazar (চকবাজার)",
  "Demra (ডেমরা)",
  "Dhanmondi (ধানমন্ডি)",
  "Dhamrai (ধামরাই)",
  "Elephant Road (এলিফ্যান্ট রোড)",
  "Eskaton (ইস্কাটন)",
  "Farmgate (ফার্মগেট)",
  "Gandaria (গেন্ডারিয়া)",
  "Gulshan 1 (গুলশান ১)",
  "Gulshan 2 (গুলশান ২)",
  "Hazaribagh (হাজারীবাগ)",
  "Jatrabari (যাত্রাবাড়ী)",
  "Kalyanpur (কল্যাণপুর)",
  "Kamrangirchar (কামরাঙ্গীরচর)",
  "Kafrul (কাফরুল)",
  "Kazipara (কাজীপাডা)",
  "Keraniganj (কেরানীগঞ্জ)",
  "Khilgaon (খিলগাঁও)",
  "Khilkhet (খিলক্ষেত)",
  "Kotwali (কোতোয়ালী)",
  "Lalbagh (লালবাগ)",
  "Lalmatia (লালমাটিয়া)",
  "Malibagh (মালিবাগ)",
  "Mirpur 1 (মিরপুর ১)",
  "Mirpur 2 (মিরপুর ২)",
  "Mirpur 6 (মিরপুর ৬)",
  "Mirpur 10 (মিরপুর ১০)",
  "Mirpur 11 (মিরপুর ১১)",
  "Mirpur 12 (মিরপুর ১২)",
  "Mirpur 14 (মিরপুর ১৪)",
  "Mirpur DOHS (মিরপুর ডিওএইচএস)",
  "Moghbazar (মগবাজার)",
  "Mohakhali (মহাখালী)",
  "Mohakhali DOHS (মহাখালী ডিওএইচএস)",
  "Mohammadpur (মোহাম্মদপুর)",
  "Motijheel (মতিঝিল)",
  "New Market (নিউ মার্কেট)",
  "Niketan (নিকেতন)",
  "Nikunja (নিকুঞ্জ)",
  "Pallabi (পল্লবী)",
  "Panthapath (পান্থপথ)",
  "Paltan (পল্টন)",
  "Purbachal (পূর্বাচল)",
  "Rampura (রামপুরা)",
  "Rayer Bazar (রায়েরবাজার)",
  "Rajarbagh (রাজারবাগ)",
  "Sadarghat (সদরঘাট)",
  "Savar (সাভার)",
  "Segunbagicha (সেগুনবাগিচা)",
  "Shahbagh (শাহবাগ)",
  "Shantinagar (শান্তিনগর)",
  "Shewrapara (শেওড়াপাড়া)",
  "Shyamoli (শ্যামলী)",
  "Sutrapur (সূত্রাপুর)",
  "Tejgaon (তেজগাঁও)",
  "Tejgaon Industrial Area (তেজগাঁও শিল্প এলাকা)",
  "Uttara Sector 1-10 (উত্তরা সেক্টর ১-১০)",
  "Uttara Sector 11-18 (উত্তরা সেক্টর ১১-১৮)",
  "Uttarkhan / Dakshinkhan (উত্তরখান / দক্ষিণখান)",
  "Vatara (ভাটারা)",
  "Wari (ওয়ারী)",
  "Other Area (অন্যান্য এলাকা)",
];

export const POPULAR_DISTRICT_AREAS: Record<string, string[]> = {
  Chattogram: [
    "Agrabad (আগ্রাবাদ)",
    "GEC Circle (জিইসি মোড়)",
    "Nasirabad (নাসিরাবাদ)",
    "Khulshi (খুলশী)",
    "Halishahar (হালিশহর)",
    "Chawkbazar (চকবাজার)",
    "Kotwali (কোতোয়ালী)",
    "Panchlaish (পাঁচলাইশ)",
    "Chandgaon (চান্দগাঁও)",
    "Muradpur (মুরাদপুর)",
    "Bahaddarhat (বহদ্দারহাট)",
    "Patenga (পতেঙ্গা)",
    "Pahartali (পাহাড়তলী)",
    "Hathazari (হাটহাজারী)",
    "Sitakunda (সীতাকুণ্ড)",
    "Other Area (অন্যান্য)",
  ],
  Gazipur: [
    "Gazipur Sadar (গাজীপুর সদর)",
    "Tongi (টঙ্গী)",
    "Board Bazar (বোর্ড বাজার)",
    "Chowrasta (চৌরাস্তা)",
    "Konabari (কোনাবাড়ী)",
    "Kashimpur (কাশিমপুর)",
    "Kaliakair (কালিয়াকৈর)",
    "Sreepur (শ্রীপুর)",
    "Kapasia (কাপাসিয়া)",
    "Other Area (অন্যান্য)",
  ],
  Narayanganj: [
    "Narayanganj Sadar (নারায়ণগঞ্জ সদর)",
    "Chashara (চাষাঢ়া)",
    "Fatullah (ফতুল্লা)",
    "Siddhirganj (সিদ্ধিরগঞ্জ)",
    "Bandar (বন্দর)",
    "Sonargaon (সোনারগাঁও)",
    "Rupganj (রূপগঞ্জ)",
    "Araihazar (আড়াইহাজার)",
    "Other Area (অন্যান্য)",
  ],
  Sylhet: [
    "Zindabazar (জিন্দাবাজার)",
    "Amberkhana (আম্বরখানা)",
    "Subidbazar (সুবিদবাজার)",
    "Upashahar (উপশহর)",
    "Shahi Eidgah (শাহী ঈদগাহ)",
    "Kumarpara (কুমারপাড়া)",
    "Mirabazar (মিরাবাজার)",
    "South Surma (দক্ষিণ সুরমা)",
    "Sylhet Sadar (সিলেট সদর)",
    "Other Area (অন্যান্য)",
  ],
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const orderNumberParam = searchParams.get("orderNumber");

  const { settings } = useSettings();
  const { user, isAuthenticated } = useAuth();
  const {
    items,
    subtotal,
    discount,
    deliveryCharge,
    total,
    shippingCity,
    setShippingCity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();

  const displayItems = items;
  const displaySubtotal = subtotal;
  const displayDiscount = discount;
  const displayDelivery = deliveryCharge;
  const displayTotal = total;

  // Coupon state & handlers
  const [couponInput, setCouponInput] = React.useState("");
  const [couponFeedback, setCouponFeedback] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleApplyCoupon = () => {
    const clean = couponInput.trim().toUpperCase();
    if (!clean) return;
    const res = applyCoupon(clean);
    if (res.success) {
      setCouponFeedback({ type: "success", message: res.message });
      setCouponInput("");
    } else {
      setCouponFeedback({ type: "error", message: res.message });
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponFeedback(null);
  };

  // Form states initialized empty for actual customers (1-click location + single address field)
  const [formData, setFormData] = React.useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    district: shippingCity === "Outside Dhaka" ? "Outside Dhaka" : "Dhaka",
    area: shippingCity === "Outside Dhaka" ? "Outside Dhaka" : "Inside Dhaka",
    customArea: "",
    deliveryNotes: "",
    paymentMethod: (settings.codEnabled !== false ? "COD" : "SSLCommerz") as "SSLCommerz" | "COD",
    agreedToTerms: true,
  });

  // Switch payment method dynamically based on store settings and payment redirects
  React.useEffect(() => {
    if (errorParam) {
      setFormData((prev) => ({ ...prev, paymentMethod: "COD" }));
    } else if (settings.codEnabled === false && formData.paymentMethod === "COD") {
      setFormData((prev) => ({ ...prev, paymentMethod: "SSLCommerz" }));
    } else if (settings.sslcommerzEnabled === false && formData.paymentMethod === "SSLCommerz") {
      setFormData((prev) => ({ ...prev, paymentMethod: "COD" }));
    }
  }, [errorParam, settings.sslcommerzEnabled, settings.codEnabled]);

  // Load draft from session storage so user details are preserved
  React.useEffect(() => {
    try {
      const saved = sessionStorage.getItem("sk_checkout_draft");
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({
          ...prev,
          fullName: prev.fullName || parsed.fullName || "",
          phone: prev.phone || parsed.phone || "",
          email: prev.email || parsed.email || "",
          address: prev.address || parsed.address || "",
          deliveryNotes: prev.deliveryNotes || parsed.deliveryNotes || "",
        }));
      }
    } catch {}
  }, []);

  // Save draft whenever user types
  React.useEffect(() => {
    try {
      if (formData.fullName || formData.phone || formData.address) {
        sessionStorage.setItem(
          "sk_checkout_draft",
          JSON.stringify({
            fullName: formData.fullName,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
            deliveryNotes: formData.deliveryNotes,
          })
        );
      }
    } catch {}
  }, [formData.fullName, formData.phone, formData.address, formData.email, formData.deliveryNotes]);

  // Automatically autofill contact info if customer is logged in
  React.useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        phone: prev.phone || user.phone || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Snapshot of order for confirmation screen
  const [completedOrder, setCompletedOrder] = React.useState<{
    orderNumber: string;
    placedDate: string;
    items: typeof items;
    subtotal: number;
    discount: number;
    deliveryCharge: number;
    total: number;
    fullName: string;
    address: string;
    district: string;
    area: string;
    phone: string;
    email: string;
    paymentMethod: string;
    appliedCouponCode?: string;
  } | null>(null);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanPhone = formData.phone.trim().replace(/\s+/g, "");

    if (!formData.fullName.trim() || !cleanPhone || !formData.address.trim()) {
      alert("অনুগ্রহ করে আপনার নাম, মোবাইল নম্বর এবং সম্পূর্ণ ডেলিভারি ঠিকানা পূরণ করুন।");
      return;
    }

    // Bangladeshi phone number validation
    if (!cleanPhone.match(/^(?:\+88|88)?01[3-9]\d{8}$/)) {
      alert("অনুগ্রহ করে সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর প্রদান করুন (যেমন: 017XXXXXXXX)।");
      return;
    }

    if (!formData.agreedToTerms) {
      alert("অর্ডার নিশ্চিত করতে অনুগ্রহ করে শর্তাবলী গ্রহণ করুন।");
      return;
    }

    setIsSubmitting(true);

    const paymentMap: Record<string, string> = {
      SSLCommerz: "ONLINE_GATEWAY",
      COD: "CASH_ON_DELIVERY",
    };

    let orderNum = `SK-${Date.now().toString().slice(-6)}`;
    const now = new Date();
    const placedDate = `${now.getDate()} ${now.toLocaleString("default", { month: "long" })} ${now.getFullYear()}`;
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://shoilpikkabbo.onrender.com/api/v1";

    try {
      // First try to fetch real product IDs from database
      let validProductIds: string[] = [];
      try {
        const prodRes = await fetch(`${API_BASE}/products?limit=50`);
        const prodData = await prodRes.json();
        if (prodData?.data && Array.isArray(prodData.data)) {
          validProductIds = prodData.data.map((p: any) => p.id).filter(Boolean);
        }
      } catch (e) {
        // use fallback
      }

      const defaultFallbackId = validProductIds[0] || "8ce7884f-c692-4787-a4ab-42df2d1de152";
      const activeItems = items.length > 0 ? items : displayItems;
      const orderPayload = {
        userId: user?.id,
        customerName: formData.fullName.trim(),
        customerPhone: cleanPhone,
        customerEmail: formData.email.trim() || undefined,
        shippingAddress: formData.address.trim(),
        city: shippingCity === "Dhaka" ? "Dhaka" : "Outside Dhaka",
        deliveryNotes: formData.deliveryNotes.trim() || undefined,
        paymentMethod: paymentMap[formData.paymentMethod] || "ONLINE_GATEWAY",
        transactionId: `TRX-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        couponCode: appliedCoupon?.code,
        items: activeItems.map((item) => {
          const isRealId = validProductIds.includes(item.product.id) || item.product.id?.length === 36;
          return {
            productId: isRealId ? item.product.id : defaultFallbackId,
            quantity: item.quantity,
          };
        }),
      };

      const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      const resJson = await res.json();

      if (!res.ok || !resJson.success) {
        throw new Error(resJson.message || "অর্ডার প্রক্রিয়াকরণে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
      }

      if (resJson.data?.orderNumber) {
        orderNum = resJson.data.orderNumber;
      }

      // If SSLCommerz Online Payment was selected and a gateway URL was returned, redirect immediately
      if (formData.paymentMethod === "SSLCommerz") {
        if (resJson.data?.paymentUrl) {
          // Note: Cart will be cleared on /checkout/success after verified callback
          window.location.href = resJson.data.paymentUrl;
          return;
        } else {
          alert(`আপনার অর্ডারটি (#${orderNum}) সিস্টেমে গ্রহণ করা হয়েছে, কিন্তু অনলাইন পেমেন্ট গেটওয়েতে সংযোগ করা যায়নি। আমাদের প্রতিনিধি আপনার সাথে শীঘ্রই যোগাযোগ করবেন।`);
        }
      }
    } catch (err: any) {
      console.error("Backend order creation error:", err);
      alert(err.message || "অর্ডার তৈরি করতে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।");
      setIsSubmitting(false);
      return;
    }

    setCompletedOrder({
      orderNumber: orderNum,
      placedDate,
      items: items.length > 0 ? [...items] : [...displayItems],
      subtotal: displaySubtotal,
      discount: displayDiscount,
      deliveryCharge: displayDelivery,
      total: displayTotal,
      fullName: formData.fullName.trim(),
      address: formData.address.trim(),
      district: shippingCity === "Dhaka" ? "Dhaka" : "Outside Dhaka",
      area: shippingCity === "Dhaka" ? "ঢাকার ভেতরে" : "ঢাকার বাইরে",
      phone: cleanPhone,
      email: formData.email.trim(),
      paymentMethod: formData.paymentMethod === "SSLCommerz" ? "অনলাইন পেমেন্ট (SSLCommerz)" : "ক্যাশ অন ডেলিভারি (Cash on Delivery)",
      appliedCouponCode: appliedCoupon?.code,
    });

    try {
      sessionStorage.removeItem("sk_checkout_draft");
    } catch {}
    clearCart();
    setIsSubmitting(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // If order is completed, show the architectural Order Confirmation screen
  if (completedOrder) {
    const firstName = completedOrder.fullName.split(" ")[0] || "Customer";
    return (
      <StorefrontLayout>
        <div className="bg-[#FAF8F5] min-h-[calc(100vh-280px)] py-10 sm:py-16">
          <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Top Tag & Checkmark */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-1 shadow-xs">
                <Check className="w-6 h-6 stroke-[2.4]" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#E0592A] uppercase tracking-wider block">
                  ORDER PLACED SUCCESSFULLY
                </span>
                <h1 className="text-3xl sm:text-4xl text-[#0D3B37] font-black tracking-tight mt-1 leading-tight">
                  Thank you, {firstName}!
                </h1>
                <p className="text-sm sm:text-base text-gray-600 font-normal mt-1.5">
                  Your order is received and our Dhaka artisan hub is preparing your package.
                </p>
              </div>
            </div>

            {/* Dark Green Summary Bar */}
            <div className="mt-8 bg-[#0D3B37] text-white rounded-3xl p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 shadow-[0_4px_20px_rgba(13,59,55,0.12)]">
              <div>
                <span className="text-[11px] text-white/70 uppercase tracking-wider block mb-1 font-semibold">
                  ORDER NO.
                </span>
                <span className="text-lg sm:text-xl text-white font-extrabold tracking-tight">
                  {completedOrder.orderNumber}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-white/70 uppercase tracking-wider block mb-1 font-semibold">
                  PLACED DATE
                </span>
                <span className="text-sm sm:text-base text-white font-medium">
                  {completedOrder.placedDate}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-white/70 uppercase tracking-wider block mb-1 font-semibold">
                  TOTAL AMOUNT
                </span>
                <span className="text-lg sm:text-xl text-[#F59E0B] font-black">
                  ৳{completedOrder.total.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-white/70 uppercase tracking-wider block mb-1 font-semibold">
                  PAYMENT METHOD
                </span>
                <span className="text-sm sm:text-base text-emerald-300 font-bold">
                  {completedOrder.paymentMethod}
                </span>
              </div>
            </div>

            {/* Two Column Content */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pt-2">
              {/* Left Column: Delivery destination details */}
              <div className="md:col-span-6 bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_14px_rgba(0,0,0,0.03)] space-y-4">
                <h2 className="text-xl sm:text-2xl text-[#0D3B37] font-bold">
                  Shipping Destination
                </h2>
                <div className="text-sm text-gray-700 leading-relaxed">
                  <p className="font-bold text-gray-900">{completedOrder.fullName}</p>
                  <p>{completedOrder.address}</p>
                  <p>
                    {completedOrder.district === "Dhaka" ? "ঢাকার ভেতরে (Inside Dhaka)" : "ঢাকার বাইরে (Outside Dhaka)"} · {completedOrder.phone}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="inline-block bg-emerald-50 text-emerald-800 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-200">
                    Estimated Delivery · {completedOrder.district === "Dhaka" ? (settings.deliveryTimeDhaka || "24 - 48 Hours") : (settings.deliveryTimeOutside || "3 - 5 Business Days")}
                  </span>
                </div>

                <p className="text-xs text-gray-500 font-normal pt-2 leading-relaxed">
                  অর্ডার সংক্রান্ত নোটিফিকেশন ও ডেলিভারি আপডেট{" "}
                  <strong className="text-gray-700">{completedOrder.phone}</strong> নম্বরে
                  {completedOrder.email ? (
                    <>
                      {" "}এবং <strong className="text-gray-700">{completedOrder.email}</strong> ঠিকানায়
                    </>
                  ) : null}{" "}
                  পাঠানো হবে।
                </p>

                {/* Buttons */}
                <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Link
                    href={`/track-order?order=${completedOrder.orderNumber}`}
                    className="h-11 px-6 bg-[#0D3B37] hover:bg-[#E0592A] text-white text-xs sm:text-sm font-bold rounded-xl inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <span>Track my order</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/shop"
                    className="h-11 px-6 bg-[#FAF8F5] hover:bg-[#F3EFE7] text-[#0D3B37] text-xs sm:text-sm font-bold rounded-xl inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Continue shopping</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Your Order Items */}
              <div className="md:col-span-6 bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_14px_rgba(0,0,0,0.03)]">
                <h2 className="text-xl sm:text-2xl font-bold text-[#0D3B37] mb-5">
                  Your Order Items
                </h2>

                <div className="space-y-4">
                  {completedOrder.items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-4 py-1"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#FAF8F5] shrink-0 p-2 border border-gray-100">
                        <Image
                          src={item.product.imageUrl || "/images/client-mockup/cat-handicrafts.png"}
                          alt={item.product.name}
                          fill
                          sizes="64px"
                          className="object-contain p-1"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-gray-500 font-normal mt-0.5">
                          Quantity: {item.quantity} · ৳{item.product.price.toLocaleString()} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 mt-6 pt-3 text-xs text-gray-500 font-normal">
                  <p>
                    Subtotal ৳{completedOrder.subtotal.toLocaleString()} · Discount -৳{completedOrder.discount.toLocaleString()} · Delivery ৳{completedOrder.deliveryCharge.toLocaleString()}
                  </p>
                  <p className="mt-2 text-gray-400 text-[11.5px]">
                    Need to make a change? Contact our client support team with your order number.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Support Bar */}
            <div className="border-t border-gray-200/60 mt-16 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-500 font-medium">
              <span>Have a question about your order? We're here to help.</span>
              <div className="flex items-center gap-4 text-xs">
                <a
                  href={settings.socialWhatsapp || `https://wa.me/${CLIENT_INFO.whatsapp || "8801731214379"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0D3B37] hover:text-[#E0592A] font-bold inline-flex items-center gap-1 transition-colors"
                >
                  <span>WhatsApp</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
                <span className="text-gray-300">·</span>
                <a
                  href={settings.socialMessenger || CLIENT_INFO.messengerUrl || "https://m.me/shoilpikkabbo"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0D3B37] hover:text-[#E0592A] font-bold inline-flex items-center gap-1 transition-colors"
                >
                  <span>Facebook Messenger</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </StorefrontLayout>
    );
  }

  if (items.length === 0) {
    if (errorParam) {
      return (
        <StorefrontLayout>
          <div className="bg-[#FAF8F5] min-h-[calc(100vh-280px)] py-16 flex items-center justify-center">
            <div className="max-w-lg mx-auto text-center px-6 py-8 bg-white rounded-3xl shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-amber-200/80">
              <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
                পেমেন্ট স্ট্যাটাস
              </span>
              <h2 className="text-2xl font-black text-[#0D3B37]">
                {errorParam === "payment_cancelled"
                  ? "অনলাইন পেমেন্টটি বাতিল করা হয়েছে"
                  : "অনলাইন পেমেন্ট সম্পন্ন হয়নি"}
              </h2>
              <p className="text-sm text-gray-600 mt-2.5 mb-6 leading-relaxed">
                {orderNumberParam
                  ? `আপনার অর্ডার নং #${orderNumberParam}-এর জন্য অনলাইন গেটওয়ে লেনদেন সম্পন্ন করা যায়নি। আপনি সরাসরি অর্ডার ট্র্যাক করতে পারেন অথবা কাস্টমার কেয়ারে যোগাযোগ করে ক্যাশ অন ডেলিভারিতে রূপান্তর করতে পারেন।`
                  : "আপনার অনলাইন পেমেন্টটি সম্পন্ন করা যায়নি। আপনি শপে ফিরে গিয়ে পুনরায় পছন্দের পণ্য অর্ডার করতে পারেন।"}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {orderNumberParam && (
                  <Link
                    href={`/track-order?order=${orderNumberParam}`}
                    className="w-full sm:w-auto h-11 px-6 bg-[#0D3B37] hover:bg-[#E0592A] text-white text-xs sm:text-sm font-bold rounded-xl inline-flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <span>অর্ডার ট্র্যাক করুন</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                )}
                <Link
                  href="/shop"
                  className="w-full sm:w-auto h-11 px-6 bg-[#FAF8F5] hover:bg-gray-100 text-gray-800 text-xs sm:text-sm font-bold rounded-xl inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <span>শপে ফিরে যান</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </StorefrontLayout>
      );
    }

    return (
      <StorefrontLayout>
        <div className="bg-[#FAF8F5] min-h-[calc(100vh-280px)] py-16 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center px-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-[#0D3B37] flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-[#0D3B37]">Your Bag is Empty</h2>
            <p className="text-sm text-gray-500 mt-2 mb-6">
              You haven't added any items to checkout yet. Browse our handcrafted artisanal collections to find something you love.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0D3B37] hover:bg-[#E0592A] text-white text-sm font-bold rounded-2xl transition-all shadow-md"
            >
              <span>Explore Products</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </StorefrontLayout>
    );
  }

  // Pre-order Checkout Form matching media_1793202314442.png
  return (
    <StorefrontLayout>
      <div className="bg-[#FAF8F5] min-h-[calc(100vh-280px)] py-8 sm:py-12">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Steps */}
          <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-6">
            <Link href="/cart" className="hover:text-[#E0592A] transition-colors">
              Shopping Bag
            </Link>
            <span className="text-gray-300">→</span>
            <span className="text-[#0D3B37] font-bold">Delivery & Payment</span>
            <span className="text-gray-300">→</span>
            <span className="text-gray-400">Confirmation</span>
          </nav>

          {/* Headline */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl text-[#0D3B37] font-black tracking-tight leading-tight">
              Checkout & Order Placement
            </h1>
            <p className="text-sm text-gray-600 font-normal mt-1">
              Please provide your recipient details to ensure prompt delivery across Bangladesh.
            </p>
          </div>

          {/* Payment Warning Banner if redirected back with error */}
          {errorParam && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-xs">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <p className="font-bold">
                  {errorParam === "payment_cancelled"
                    ? "অনলাইন পেমেন্টটি সম্পন্ন হয়নি বা বাতিল করা হয়েছে"
                    : "অনলাইন পেমেন্ট সম্পন্ন হতে ব্যর্থ হয়েছে"}
                  {orderNumberParam ? ` (পূর্বের অর্ডার #${orderNumberParam})` : ""}
                </p>
                <p className="text-amber-800 text-xs mt-0.5">
                  আপনি চাইলে নিচে "ক্যাশ অন ডেলিভারি (Cash on Delivery)" নির্বাচন করে কোনো অনলাইন পেমেন্ট ছাড়াই সরাসরি অর্ডার নিশ্চিত করতে পারেন, অথবা পুনরায় চেষ্টা করতে পারেন।
                </p>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmitOrder}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start"
          >
            {/* Left Column: Guest banner + 01 Contact + 02 Delivery + 03 Payment (7-8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Guest / Logged-in Notification Bar */}
              {isAuthenticated && user ? (
                <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm text-emerald-800 shadow-2xs gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>লগইন করা আছেন: <strong>{user.name}</strong> ({user.phone})</span>
                  </div>
                  <span className="text-xs text-emerald-700 font-semibold">ভেরিফাইড কাস্টমার</span>
                </div>
              ) : (
                <div className="bg-white rounded-2xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm text-gray-500 shadow-2xs gap-2">
                  <span>গেস্ট হিসেবে অর্ডার করছেন (Guest Checkout)</span>
                  <Link
                    href="/login"
                    className="text-[#0D3B37] hover:text-[#E0592A] font-semibold inline-flex items-center gap-1 transition-colors"
                  >
                    <span>অ্যাকাউন্ট আছে? লগইন করুন</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_14px_rgba(0,0,0,0.03)] space-y-8">
                {/* 01 Contact details */}
                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#0D3B37]/10 text-[#0D3B37] flex items-center justify-center font-bold text-xs">01</span>
                    <h2 className="text-xl sm:text-2xl text-[#0D3B37] font-bold">
                      Contact Details
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                        Full name *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="আপনার পূর্ণ নাম লিখুন"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className="w-full h-11 px-4 bg-[#FAF8F5] border border-gray-200 rounded-xl text-sm text-[#0D3B37] font-medium focus:outline-none focus:border-[#0D3B37] focus:bg-white transition-colors placeholder:text-gray-400 placeholder:font-normal"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                        Phone number *
                      </label>
                      <input
                        required
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full h-11 px-4 bg-[#FAF8F5] border border-gray-200 rounded-xl text-sm text-[#0D3B37] font-medium focus:outline-none focus:border-[#0D3B37] focus:bg-white transition-colors placeholder:text-gray-400 placeholder:font-normal"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                      Email address (ঐচ্ছিক)
                    </label>
                    <input
                      type="email"
                      placeholder="yourname@gmail.com (অর্ডার ও ইনভয়েস আপডেটের জন্য)"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full h-11 px-4 bg-[#FAF8F5] border border-gray-200 rounded-xl text-sm text-[#0D3B37] font-medium focus:outline-none focus:border-[#0D3B37] focus:bg-white transition-colors placeholder:text-gray-400 placeholder:font-normal"
                    />
                  </div>
                </section>

                {/* 02 Delivery address */}
                <section className="space-y-4 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#0D3B37]/10 text-[#0D3B37] flex items-center justify-center font-bold text-xs">
                      02
                    </span>
                    <div>
                      <h2 className="text-xl sm:text-2xl text-[#0D3B37] font-bold leading-tight">
                        Delivery Address
                      </h2>
                      <p className="text-xs text-gray-500 font-normal mt-0.5">
                        ডেলিভারি এলাকা নির্বাচন করুন এবং আপনার সম্পূর্ণ ঠিকানা লিখুন
                      </p>
                    </div>
                  </div>

                  {/* 1-Click Delivery Location Selector */}
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-2">
                      ডেলিভারি এলাকা নির্বাচন করুন * (Select Delivery Location)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Inside Dhaka */}
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, district: "Dhaka", area: "Inside Dhaka" }));
                          setShippingCity("Dhaka");
                        }}
                        className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          shippingCity === "Dhaka"
                            ? "border-2 border-[#0D3B37] bg-emerald-50/70 shadow-sm ring-1 ring-[#0D3B37]/20"
                            : "border-gray-200 bg-[#FAF8F5] hover:border-gray-300 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              shippingCity === "Dhaka"
                                ? "border-[#0D3B37] bg-[#0D3B37]"
                                : "border-gray-400 bg-white"
                            }`}
                          >
                            {shippingCity === "Dhaka" && (
                              <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </span>
                          <div>
                            <p className="text-sm font-bold text-[#0D3B37]">
                              ঢাকার ভেতরে (Inside Dhaka)
                            </p>
                            <p className="text-xs text-gray-500 font-normal mt-0.5">
                              {settings.deliveryTimeDhaka || "২৪ - ৪৮ ঘণ্টার মধ্যে ডেলিভারি"}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-extrabold text-[#0D3B37] shrink-0">
                          ৳{settings.deliveryDhaka ?? 70}
                        </span>
                      </button>

                      {/* Outside Dhaka */}
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, district: "Outside Dhaka", area: "Outside Dhaka" }));
                          setShippingCity("Outside Dhaka");
                        }}
                        className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          shippingCity === "Outside Dhaka"
                            ? "border-2 border-[#0D3B37] bg-emerald-50/70 shadow-sm ring-1 ring-[#0D3B37]/20"
                            : "border-gray-200 bg-[#FAF8F5] hover:border-gray-300 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              shippingCity === "Outside Dhaka"
                                ? "border-[#0D3B37] bg-[#0D3B37]"
                                : "border-gray-400 bg-white"
                            }`}
                          >
                            {shippingCity === "Outside Dhaka" && (
                              <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </span>
                          <div>
                            <p className="text-sm font-bold text-[#0D3B37]">
                              ঢাকার বাইরে (Outside Dhaka)
                            </p>
                            <p className="text-xs text-gray-500 font-normal mt-0.5">
                              {settings.deliveryTimeOutside || "৩ - ৫ কার্যদিবসের মধ্যে ডেলিভারি"}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-extrabold text-[#0D3B37] shrink-0">
                          ৳{settings.deliveryOutside ?? 130}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Single Delivery Address Textarea */}
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                      সম্পূর্ণ ডেলিভারি ঠিকানা (Full Delivery Address) *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="বাসা নং, রোড নং, এলাকা/উপজেলা, জেলা ও ল্যান্ডমার্কের নাম বিস্তারিত লিখুন..."
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full p-3.5 bg-[#FAF8F5] border border-gray-200 rounded-xl text-sm text-[#0D3B37] font-medium focus:outline-none focus:border-[#0D3B37] focus:bg-white transition-colors placeholder:text-gray-400 placeholder:font-normal resize-none"
                    />
                  </div>

                  {/* Optional Delivery Notes */}
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                      ডেলিভারির বিশেষ কোনো নির্দেশনা (ঐচ্ছিক)
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: বিকেল ৫টার পর ডেলিভারি দিন, বা বিশেষ কোনো নোট..."
                      value={formData.deliveryNotes}
                      onChange={(e) =>
                        setFormData({ ...formData, deliveryNotes: e.target.value })
                      }
                      className="w-full h-11 px-4 bg-[#FAF8F5] border border-gray-200 rounded-xl text-sm text-[#0D3B37] font-medium focus:outline-none focus:border-[#0D3B37] focus:bg-white transition-colors placeholder:text-gray-400 placeholder:font-normal"
                    />
                  </div>
                </section>

                {/* 03 Payment */}
                <section className="space-y-5 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#0D3B37]/10 text-[#0D3B37] flex items-center justify-center font-bold text-xs">03</span>
                    <h2 className="text-xl sm:text-2xl text-[#0D3B37] font-bold">
                      Payment
                    </h2>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      How would you like to pay?
                    </h3>
                    <p className="text-xs text-gray-500 font-normal mt-0.5">
                      Select a method. No card or wallet credentials are entered on this page.
                    </p>
                  </div>

                  {/* Payment Option Cards */}
                  <div className="space-y-3">
                    {/* 1. Cash on Delivery (COD) - Default & Recommended in Bangladesh */}
                    {settings.codEnabled !== false && (
                      <label
                        className={`block p-4 sm:p-5 rounded-2xl cursor-pointer transition-all ${
                          formData.paymentMethod === "COD"
                            ? "border-2 border-[#0D3B37] bg-emerald-50/70 shadow-sm"
                            : "border border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3.5">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="COD"
                              checked={formData.paymentMethod === "COD"}
                              onChange={() =>
                                setFormData({ ...formData, paymentMethod: "COD" })
                              }
                              className="w-4 h-4 text-[#0D3B37] accent-[#0D3B37] mt-1"
                            />
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-sm sm:text-base font-extrabold text-[#0D3B37]">
                                  ক্যাশ অন ডেলিভারি (Cash on Delivery)
                                </p>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-xs">
                                  সবচেয়ে সহজ ও নির্ভরযোগ্য
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 font-normal mt-1 leading-relaxed">
                                {settings.codNote ||
                                  "পণ্য হাতে পেয়ে দেখে ডেলিভারিম্যানকে ক্যাশ টাকা পরিশোধ করুন। কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই।"}
                              </p>
                            </div>
                          </div>

                          {formData.paymentMethod === "COD" && (
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full shrink-0">
                              Selected
                            </span>
                          )}
                        </div>

                        {formData.paymentMethod === "COD" && (
                          <div className="mt-3.5 pt-3 border-t border-emerald-200/80 text-xs text-charcoal-700 bg-white/90 p-3 rounded-xl flex items-center justify-between">
                            <span className="text-gray-600">
                              📦 ডেলিভারির সময় মোট পরিশোধ করতে হবে:
                            </span>
                            <span className="font-extrabold text-[#0D3B37] text-sm">
                              ৳{displayTotal.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </label>
                    )}

                    {/* 2. SSLCommerz Online Gateway */}
                    {settings.sslcommerzEnabled !== false && (
                      <label
                        className={`block p-4 sm:p-5 rounded-2xl cursor-pointer transition-all ${
                          formData.paymentMethod === "SSLCommerz"
                            ? "border-2 border-[#0D3B37] bg-emerald-50/70 shadow-sm"
                            : "border border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3.5">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="SSLCommerz"
                              checked={formData.paymentMethod === "SSLCommerz"}
                              onChange={() =>
                                setFormData({ ...formData, paymentMethod: "SSLCommerz" })
                              }
                              className="w-4 h-4 text-[#0D3B37] accent-[#0D3B37] mt-1"
                            />
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-sm sm:text-base font-extrabold text-[#0D3B37]">
                                  অনলাইন পেমেন্ট (SSLCommerz Gateway)
                                </p>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
                                  বিকাশ / নগদ / কার্ড
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 font-normal mt-1 leading-relaxed">
                                বিকাশ (bKash), নগদ (Nagad), রকেট, উপায়, ভিসা (Visa), মাস্টারকার্ড এবং ইন্টারনেট ব্যাংকিং দিয়ে স্বয়ংক্রিয় ইনস্ট্যান্ট পেমেন্ট।
                              </p>

                              {/* Supported Gateway Logos/Chips */}
                              <div className="flex items-center gap-2 flex-wrap mt-3 pt-2.5 border-t border-gray-100">
                                <span className="px-2.5 py-1 rounded-md bg-[#D12053] text-white text-[11px] font-black tracking-wide shadow-xs">
                                  bKash
                                </span>
                                <span className="px-2.5 py-1 rounded-md bg-[#F7931E] text-white text-[11px] font-black tracking-wide shadow-xs">
                                  Nagad
                                </span>
                                <span className="px-2.5 py-1 rounded-md bg-[#8C3494] text-white text-[11px] font-black tracking-wide shadow-xs">
                                  Rocket
                                </span>
                                <span className="px-2.5 py-1 rounded-md bg-[#1A1F71] text-white text-[11px] font-black tracking-wide shadow-xs">
                                  VISA
                                </span>
                                <span className="px-2.5 py-1 rounded-md bg-[#EB001B] text-white text-[11px] font-black tracking-wide shadow-xs">
                                  Mastercard
                                </span>
                                <span className="px-2 py-1 rounded-md bg-emerald-100 text-[#0D3B37] text-[10px] font-bold">
                                  + 30 More
                                </span>
                              </div>
                            </div>
                          </div>

                          {formData.paymentMethod === "SSLCommerz" && (
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full shrink-0">
                              Selected
                            </span>
                          )}
                        </div>

                        {formData.paymentMethod === "SSLCommerz" && (
                          <div className="mt-3.5 pt-3 border-t border-emerald-200/80 text-xs text-charcoal-700 bg-white/90 p-3 rounded-xl flex items-center justify-between">
                            <span className="text-gray-600">
                              {settings.sslcommerzIsSandbox
                                ? "🛡️ SSLCommerz Sandbox Test Mode সক্রিয় (নিরাপদ টেস্ট লেনদেন)"
                                : "🛡️ SSLCommerz 256-Bit SSL Secured (বাংলাদেশ ব্যাংক অনুমোদিত গেটওয়ে)"}
                            </span>
                            <span className="font-bold text-[#E0592A] text-[11px]">
                              ইনস্ট্যান্ট কনফার্মেশন
                            </span>
                          </div>
                        )}
                      </label>
                    )}
                  </div>

                  {/* Secure handoff banner */}
                  <div className="p-3.5 bg-[#FAF8F5] rounded-xl flex items-center gap-2.5 text-xs text-gray-600">
                    <ShieldCheck className="w-4 h-4 text-[#0D3B37] shrink-0" />
                    <span>
                      Secure handoff → authorize with your provider → return for confirmation. SHOILPIKKABBO does not store card details.
                    </span>
                  </div>

                  {/* Policy consent checkbox */}
                  <label className="flex items-start gap-2.5 pt-2 text-xs text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreedToTerms}
                      onChange={(e) =>
                        setFormData({ ...formData, agreedToTerms: e.target.checked })
                      }
                      className="mt-0.5 w-4 h-4 text-[#0D3B37] accent-[#0D3B37] rounded"
                    />
                    <span>
                      আমি ওয়েবসাইটটির{" "}
                      <Link href="/terms" target="_blank" className="font-semibold text-[#0D3B37] underline hover:text-[#E0592A]">
                        শর্তাবলী (Terms)
                      </Link>
                      ,{" "}
                      <Link href="/privacy" target="_blank" className="font-semibold text-[#0D3B37] underline hover:text-[#E0592A]">
                        গোপনীয়তা (Privacy)
                      </Link>
                      ,{" "}
                      <Link href="/shipping" target="_blank" className="font-semibold text-[#0D3B37] underline hover:text-[#E0592A]">
                        শিপিং
                      </Link>{" "}
                      এবং{" "}
                      <Link href="/refund" target="_blank" className="font-semibold text-[#0D3B37] underline hover:text-[#E0592A]">
                        রিটার্ন পলিসির
                      </Link>{" "}
                      সাথে একমত।
                    </span>
                  </label>
                </section>
              </div>
            </div>

            {/* Right Column: Order Summary Card (4 cols) */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_14px_rgba(0,0,0,0.03)] sticky top-24 space-y-4">
                <h2 className="text-xl sm:text-2xl text-[#0D3B37] font-bold leading-tight">
                  Your Order
                </h2>
                <p className="text-xs text-gray-400 font-medium">
                  {displayItems.reduce((acc, i) => acc + i.quantity, 0)} items · thoughtfully chosen
                </p>

                {/* Line Items Breakdown */}
                <div className="space-y-3 pt-3 text-sm border-t border-gray-100">
                  {displayItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex justify-between items-start text-gray-700"
                    >
                      <span className="pr-3 text-gray-600 font-normal line-clamp-1">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="font-semibold text-[#0D3B37] shrink-0">
                        ৳{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Promo / Coupon Code Input Box */}
                <div className="pt-3 border-t border-gray-100">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                          <Tag className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="font-extrabold text-[#0D3B37] text-xs tracking-wider">
                            {appliedCoupon.code}
                          </p>
                          <p className="text-[11px] text-emerald-700 font-medium">
                            {appliedCoupon.discountAmount
                              ? `৳${appliedCoupon.discountAmount} ছাড় কার্যকর হয়েছে`
                              : `${appliedCoupon.discountPercentage}% ছাড় প্রযোজ্য হয়েছে`}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-xs font-bold text-red-600 hover:text-red-800 hover:bg-red-100/70 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            placeholder="প্রোমো কোড (যেমন: WELCOME150)"
                            value={couponInput}
                            onChange={(e) => {
                              setCouponInput(e.target.value.toUpperCase());
                              setCouponFeedback(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleApplyCoupon();
                              }
                            }}
                            className="w-full h-10 pl-8 pr-3 bg-[#FAF8F5] border border-gray-200 rounded-xl text-xs font-bold text-[#0D3B37] placeholder:text-gray-400 placeholder:font-normal uppercase tracking-wider focus:outline-none focus:border-[#0D3B37] focus:bg-white transition-colors"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={!couponInput.trim()}
                          className="h-10 px-4 bg-[#0D3B37] hover:bg-[#E0592A] disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs"
                        >
                          Apply
                        </button>
                      </div>

                      {couponFeedback && (
                        <p
                          className={`text-xs pl-1 font-medium ${
                            couponFeedback.type === "success"
                              ? "text-emerald-700"
                              : "text-red-600"
                          }`}
                        >
                          {couponFeedback.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Subtotal & Delivery Row */}
                <div className="space-y-2.5 pt-3 border-t border-gray-100 text-sm">
                  <div className="flex justify-between text-gray-700">
                    <span className="font-normal text-gray-600">Subtotal</span>
                    <span className="font-semibold text-[#0D3B37]">
                      ৳{displaySubtotal.toLocaleString()}
                    </span>
                  </div>

                  {displayDiscount > 0 && (
                    <div className="flex justify-between items-center text-emerald-700 font-semibold bg-emerald-50/80 px-2.5 py-1.5 rounded-lg border border-emerald-100 text-xs">
                      <span className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-emerald-600" />
                        <span>ছাড় ({appliedCoupon?.code})</span>
                      </span>
                      <span>
                        -৳{displayDiscount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-700">
                    <span className="font-normal text-gray-600">
                      ডেলিভারি · {shippingCity === "Dhaka" ? "ঢাকার ভেতরে" : "ঢাকার বাইরে"}
                    </span>
                    <span className="font-semibold text-[#0D3B37]">
                      ৳{displayDelivery.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Total Row */}
                <div className="border-t border-gray-100 pt-4 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-gray-900">
                    Total · BDT
                  </span>
                  <span className="text-2xl sm:text-3xl text-[#0D3B37] font-black tracking-tight">
                    ৳{displayTotal.toLocaleString()}
                  </span>
                </div>

                {/* Continue / Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-[#0D3B37] hover:bg-[#E0592A] text-white text-sm font-bold rounded-xl inline-flex items-center justify-center gap-2 mt-4 transition-colors cursor-pointer disabled:opacity-75 shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>প্রক্রিয়াধীন রয়েছে...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {formData.paymentMethod === "SSLCommerz"
                          ? `Proceed to Payment (৳${displayTotal.toLocaleString()})`
                          : formData.paymentMethod === "COD"
                          ? "অর্ডার নিশ্চিত করুন (ক্যাশ অন ডেলিভারি)"
                          : "অর্ডার কনফার্ম করুন"}
                      </span>
                      <ArrowUpRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Disclaimer subtext */}
                <p className="text-[11px] text-gray-400 leading-relaxed font-normal text-center">
                  {formData.paymentMethod === "SSLCommerz"
                    ? "SSLCommerz গেটওয়েতে রিডাইরেক্ট হবে। বিকাশ/নগদ/কার্ড তথ্য সম্পূর্ণ সুরক্ষিত।"
                    : "পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন। কোনো সমস্যা হলে ৭ দিনের ভেতর রিটার্ন পলিসি প্রযোজ্য।"}
                </p>
              </div>

              {/* Note outside card matching client mockup */}
              <p className="text-xs text-gray-400 leading-relaxed mt-4 font-normal">
                Your order is confirmed only after payment is verified. A cancelled or unsuccessful payment can be retried from your order page.
              </p>
            </div>
          </form>
        </div>
      </div>
    </StorefrontLayout>
  );
}

function CheckoutLoading() {
  return (
    <StorefrontLayout>
      <div className="bg-[#FAF8F5] min-h-[calc(100vh-280px)] py-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#0D3B37] mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-500">লোডিং চেকআউট...</p>
        </div>
      </div>
    </StorefrontLayout>
  );
}

export default function CheckoutPage() {
  return (
    <React.Suspense fallback={<CheckoutLoading />}>
      <CheckoutContent />
    </React.Suspense>
  );
}
