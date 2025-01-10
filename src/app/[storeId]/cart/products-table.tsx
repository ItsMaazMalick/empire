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
import { Edit } from "lucide-react";
import { useCartStore } from "@/store";

// Sample data - replace with your actual data source

interface OrdersTableProps {
  products: any;
  activeTab: string;
  searchQuery: string;
  vendors?: any;
  categories?: any;
}

export function ProductsTable({
  products,
  activeTab,
  searchQuery,
  vendors,
  categories,
}: OrdersTableProps) {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const { addServices } = useCartStore();

  // Filter orders based on active tab and search query
  const filteredOrders = products.filter((order: any) => {
    const matchesTab = activeTab === "all" || order.status === activeTab;
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

  const handleAddToCart = (product: any) => {
    const orderServices = [
      {
        name: product.title,
        quantity: 1,
        repairStatus: "PENDING" as const,
        serviceId: product.id,
        price: product.price,
        type: "PRODUCT",
      },
    ];
    addServices(orderServices);
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
            <TableHead>Product</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Inventory</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Vendor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders?.map((order: any, index: number) => (
            <TableRow
              key={order.id}
              className="border-gray-700 hover:bg-[#1A2337]"
            >
              <TableCell>
                <Checkbox
                  checked={selectedOrders.includes(order.id)}
                  onCheckedChange={() => toggleOrderSelection(order.id)}
                />
              </TableCell>
              <TableCell>{index + 1}</TableCell>
              <TableCell
                onClick={() => handleAddToCart(order)}
                className="cursor-pointer"
              >
                {order.title}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    order.status === "ACTIVE"
                      ? "border-green-500 text-green-500"
                      : "border-yellow-500 text-yellow-500"
                  }
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>{order.inStock}</TableCell>
              <TableCell>{order.price}</TableCell>
              <TableCell>{order.cost}</TableCell>
              <TableCell>{order.category.name}</TableCell>
              <TableCell>{order.vendor.name}</TableCell>
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
