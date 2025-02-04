"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Sample data - replace with your actual data source

interface OrdersTableProps {
  orders: any;
  activeTab: string;
  searchQuery: string;
  store: { id: string };
}

export function OrdersTable({
  orders,
  activeTab,
  searchQuery,
  store,
}: OrdersTableProps) {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const router = useRouter();

  // Filter orders based on active tab and search query
  const filteredOrders = orders.filter((order: any) => {
    const matchesTab = activeTab === "all" || order.orderStatus === activeTab;
    const matchesSearch =
      searchQuery === "" ||
      Object.values(order).some((value) =>
        value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    // return matchesSearch;
    return matchesTab && matchesSearch;
  });

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleAllOrders = () => {
    setSelectedOrders((prev) =>
      prev.length === filteredOrders.length
        ? []
        : filteredOrders.map((order: any) => order.id)
    );
  };

  return (
    <div className="rounded-md border border-gray-700">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-700 hover:bg-[#1A2337]">
            <TableHead className="w-12">
              <Checkbox
                checked={selectedOrders.length === filteredOrders.length}
                onCheckedChange={toggleAllOrders}
              />
            </TableHead>
            <TableHead>No.</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            {/* <TableHead>Order</TableHead> */}
            <TableHead>Phone Number</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Invoice By</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders?.map((order: any, index: number) => (
            <TableRow
              key={order.id}
              className="border-gray-700 hover:bg-[#1A2337] cursor-pointer"
              onClick={() => router.push(`/${store.id}/orders/${order.id}`)}
            >
              <TableCell>
                <Checkbox
                  checked={selectedOrders.includes(order.id)}
                  onCheckedChange={() => toggleOrderSelection(order.id)}
                />
              </TableCell>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{order.customer?.name}</TableCell>
              <TableCell>{order.createdAt.toLocaleString()}</TableCell>
              {/* <TableCell>
                <Link href={`/123/orders/${order.id}`}>{order.id}</Link>
              </TableCell> */}
              <TableCell>{order.customer?.phone}</TableCell>
              <TableCell>{order.price}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    order.orderStatus === "PAID"
                      ? "border-green-500 text-green-500"
                      : "border-yellow-500 text-yellow-500"
                  }
                >
                  {order.orderStatus.charAt(0).toUpperCase() +
                    order.orderStatus.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                {order.orderItems?.length + order.orderProducts?.length}
              </TableCell>
              <TableCell>{order.customer?.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-center py-4 border-t border-gray-700">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
