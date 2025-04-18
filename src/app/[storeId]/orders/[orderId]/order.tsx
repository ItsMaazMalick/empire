"use client";

import { ArrowLeft, HelpCircle, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrderDetails } from "./order-details";
import { OrderSidebar } from "./order-sidebar";

export function OrderPage({ order, baseUrl, storeId }: any) {
  return (
    <div className="min-h-screen  p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/123/orders" className="hover:text-gray-300">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            {order.id}
            <span className="px-2 py-0.5 text-sm bg-green-500/20 text-green-500 rounded-full">
              {order.orderStatus}
            </span>
          </h1>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="">
            Edit order
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="">
                More actions
                <MoreHorizontal className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className=" border-gray-700 ">
              <DropdownMenuItem>Delete order</DropdownMenuItem>
              <DropdownMenuItem>Mark as completed</DropdownMenuItem>
              <DropdownMenuItem>Change status</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-[1fr,350px] gap-6">
        <OrderDetails order={order} baseUrl={baseUrl} storeId={storeId} />
        <OrderSidebar order={order} />
      </div>
    </div>
  );
}
