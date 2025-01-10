"use client";

import { useState } from "react";
import { ArrowLeft, Download, Plus, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersTable } from "./orders-table";

const tabs = [
  { value: "PENDING_PAYMENT", label: "Pending payment" },
  { value: "PARTIALLY_PAID", label: "Partially paid" },
  { value: "PAID", label: "Paid" },
  { value: "CLOSED", label: "Closed" },
  { value: "all", label: "All Orders" }, // "all" can be a special case
];

export function Orders({ orders }: any) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#0B1121] text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:text-gray-300">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-semibold">Orders</h1>
        </div>
        <div className="flex gap-3">
          {/* <Button variant="outline" className="text-white border-gray-600">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button> */}
          <Button className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link href={`/123/cart`}>
              <Plus className="w-4 h-4 mr-2" />
              Create Order
            </Link>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <Input
            placeholder="Search orders id"
            // placeholder="Search orders by IMEI, Order No, Customer, etc"
            className="pl-10 bg-[#1A2337] border-gray-700 text-white placeholder:text-gray-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-[#1A2337] p-1">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-gray-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Table */}
      <OrdersTable
        orders={orders}
        activeTab={activeTab}
        searchQuery={searchQuery}
      />
    </div>
  );
}
