"use client";

import * as React from "react";
import { Users, Search, Phone, Mail, MapPin } from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  ordersCount: number;
  totalSpent: number;
  joinedDate: string;
}

const MOCK_CUSTOMERS: CustomerRecord[] = [
  {
    id: "cust-1",
    name: "Tanvir Ahmed",
    phone: "01712345678",
    email: "tanvir.ahmed@example.com",
    city: "Dhaka (Banani)",
    ordersCount: 3,
    totalSpent: 8250,
    joinedDate: "2026-08-14",
  },
  {
    id: "cust-2",
    name: "Dr. Farhana Yasmin",
    phone: "01898765432",
    email: "dr.farhana@example.com",
    city: "Dhaka (Bashundhara)",
    ordersCount: 2,
    totalSpent: 6470,
    joinedDate: "2026-09-02",
  },
  {
    id: "cust-3",
    name: "Kamrul Hassan",
    phone: "01911223344",
    email: "kamrul.h@example.com",
    city: "Chattogram",
    ordersCount: 1,
    totalSpent: 1630,
    joinedDate: "2026-10-01",
  },
  {
    id: "cust-4",
    name: "Sabrina Rahman",
    phone: "01811443322",
    email: "sabrina.r@hospitality.com",
    city: "Sylhet",
    ordersCount: 4,
    totalSpent: 14200,
    joinedDate: "2026-06-20",
  },
];

export default function AdminCustomersPage() {
  const [search, setSearch] = React.useState("");

  const filtered = MOCK_CUSTOMERS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayoutShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-charcoal-900 font-heading">
            Customer Directory
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            View customer order histories, contact details, and lifetime spending.
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-brand-border bg-white shadow-xs">
          <div className="relative max-w-sm">
            <Input
              placeholder="Search by customer name, phone, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
            <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-charcoal-400" />
          </div>
        </div>

        <div className="rounded-2xl border border-brand-border bg-white shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-sand/40 text-[10px] font-bold uppercase tracking-wider text-charcoal-700 border-b border-brand-border">
              <tr>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Phone & Email</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-sand/20 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-charcoal-900">
                    {c.name}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="text-charcoal-800 font-semibold">{c.phone}</p>
                    <p className="text-[10px] text-charcoal-400">{c.email}</p>
                  </td>
                  <td className="py-3.5 px-4 text-charcoal-700">{c.city}</td>
                  <td className="py-3.5 px-4 font-bold text-charcoal-800">
                    {c.ordersCount} orders
                  </td>
                  <td className="py-3.5 px-4 font-black text-forest-900">
                    {formatPrice(c.totalSpent)}
                  </td>
                  <td className="py-3.5 px-4 text-charcoal-500">{c.joinedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayoutShell>
  );
}
