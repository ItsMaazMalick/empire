"use client";

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OrderSidebar({ order }: any) {
  return (
    <div className="space-y-6">
      {/* Order Information */}
      <div className="bg-[#1A2337] rounded-lg border border-gray-700 p-6">
        <h2 className="text-lg font-semibold mb-4">Order information</h2>

        <div className="space-y-4">
          <div>
            <span className="text-gray-400 block text-sm">
              Order created by
            </span>
            <span>{order.customer.name}</span>
          </div>

          <div>
            <span className="text-gray-400 block text-sm">Location</span>
            <span>Empire</span>
          </div>

          <div>
            <span className="text-gray-400 block text-sm">Date</span>
            <span>{order.createdAt.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Customer */}
      <div className="bg-[#1A2337] rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Customer</h2>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <Pencil className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-1 mb-6">
          <span className="text-lg">{order.customer.name}</span>
        </div>

        <h3 className="text-gray-400 text-sm mb-2">Contact information</h3>
        <div className="space-y-1">
          <p>{order.customer.phone}</p>
          <p className="text-gray-400">{order.customer.email}</p>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-[#1A2337] rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Notes</h2>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <Pencil className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-gray-400">
          {order.orderNotes ?? "No notes added yet"}
        </p>
      </div>
    </div>
  );
}
