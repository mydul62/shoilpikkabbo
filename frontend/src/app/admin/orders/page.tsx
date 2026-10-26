"use client";

import * as React from "react";
import {
  ShoppingCart,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  Filter,
} from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { MOCK_ORDERS, Order } from "@/data/mock-data";
import { formatPrice } from "@/lib/utils";

export default function AdminOrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>(MOCK_ORDERS);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === "ALL" || o.orderStatus === statusFilter;
    const matchQuery =
      !search.trim() ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search);
    return matchStatus && matchQuery;
  });

  const handleUpdateStatus = (
    orderId: string,
    newStatus: Order["orderStatus"]
  ) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
    }
  };

  return (
    <AdminLayoutShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-charcoal-900 font-heading">
            Order Management & Dispatch
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Process incoming orders, track fulfillment states, and update nationwide delivery status.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl border border-brand-border bg-white shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Input
              placeholder="Search by order #, phone, or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
            <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-charcoal-400" />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {["ALL", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                  statusFilter === st
                    ? "bg-forest-800 text-white"
                    : "bg-sand/40 text-charcoal-700 hover:bg-sand"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="rounded-2xl border border-brand-border bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand/40 text-[10px] font-bold uppercase tracking-wider text-charcoal-700 border-b border-brand-border">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer & Phone</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {filtered.map((ord) => (
                  <tr key={ord.id} className="hover:bg-sand/20 transition-colors">
                    <td className="py-3 px-4 font-black text-forest-900">
                      {ord.orderNumber}
                      <span className="block text-[10px] font-normal text-charcoal-400">
                        {ord.createdAt}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-charcoal-900">{ord.customerName}</p>
                      <p className="text-[10px] text-charcoal-500">{ord.customerPhone}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-charcoal-800 block">
                        {ord.city}
                      </span>
                      <span className="text-[10px] text-charcoal-500 line-clamp-1">
                        {ord.shippingAddress}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-charcoal-800 block">
                        {ord.paymentMethod}
                      </span>
                      <Badge
                        variant={ord.paymentStatus === "PAID" ? "success" : "warning"}
                        className="text-[10px] py-0"
                      >
                        {ord.paymentStatus}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-black text-forest-900">
                      {formatPrice(ord.finalAmount)}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) =>
                          handleUpdateStatus(ord.id, e.target.value as any)
                        }
                        className="h-8 px-2 rounded-lg border border-brand-border bg-white text-xs font-bold text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-forest-800/20"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelectedOrder(ord)}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Modal */}
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order Details: ${selectedOrder?.orderNumber}`}
          description={`Placed on ${selectedOrder?.createdAt}`}
          maxWidth="xl"
        >
          {selectedOrder && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-sand/30 border border-brand-border">
                <div>
                  <span className="text-charcoal-500 block">Customer</span>
                  <p className="font-bold text-charcoal-900 text-sm">
                    {selectedOrder.customerName}
                  </p>
                  <p className="text-charcoal-600">{selectedOrder.customerPhone}</p>
                </div>
                <div>
                  <span className="text-charcoal-500 block">Delivery Address</span>
                  <p className="font-bold text-charcoal-900">{selectedOrder.city}</p>
                  <p className="text-charcoal-600">{selectedOrder.shippingAddress}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-charcoal-900 uppercase tracking-wider text-[11px] mb-2">
                  Line Items ({selectedOrder.items.length})
                </h4>
                <div className="border border-brand-border rounded-xl overflow-hidden divide-y divide-sand">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 flex justify-between items-center bg-white"
                    >
                      <div>
                        <p className="font-bold text-charcoal-900">
                          {item.productName}
                        </p>
                        <p className="text-charcoal-500 text-[11px]">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <span className="font-black text-forest-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-sand/30 border border-brand-border flex justify-between font-bold text-sm">
                <span>Total Amount</span>
                <span className="text-forest-900">
                  {formatPrice(selectedOrder.finalAmount)}
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-sand">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AdminLayoutShell>
  );
}
