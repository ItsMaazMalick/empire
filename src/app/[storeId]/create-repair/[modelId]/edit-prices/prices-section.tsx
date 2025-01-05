"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight, Pencil, Trash2, Plus } from "lucide-react";
import { EditPriceModal } from "./edit-price-modal";

interface RepairItem {
  name: string;
  stock: number;
  cost: number;
  price: number;
}

interface RepairCategory {
  name: string;
  items: RepairItem[];
}

const initialCategories: RepairCategory[] = [
  {
    name: "LCD Screen",
    items: [
      { name: "Incell", stock: 0, cost: 0, price: 0 },
      { name: "Hard Oled", stock: 0, cost: 0, price: 0 },
      { name: "Soft Oled", stock: 0, cost: 0, price: 0 },
      { name: "Refurbished", stock: 0, cost: 0, price: 0 },
      { name: "Genuine (OEM)", stock: 0, cost: 0, price: 0 },
    ],
  },
  { name: "Charging Port", items: [] },
  { name: "Battery", items: [] },
  { name: "Back Glass", items: [] },
  { name: "Housing", items: [] },
  { name: "Cameras", items: [] },
];

export function PricesSection({ services }: any) {
  const [categories, setCategories] = useState(services);
  const [expandedCategory, setExpandedCategory] = useState("LCD Screen");

  const calculateProfit = (cost: number, price: number) => {
    return price - cost;
  };

  const calculateMargin = (cost: number, price: number) => {
    if (cost === 0 || price === 0) return "0%";
    return `${Math.round(((price - cost) / price) * 100)}%`;
  };
  console.log(services);

  return (
    <div className="space-y-2 max-h-[calc(100dvh-190px)] overflow-y-auto [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-track]:bg-card [&::-webkit-scrollbar-thumb]:bg-primary [&::-webkit-scrollbar-thumb]:rounded-full text-xs relative">
      <div className="flex items-center text-sm pl-6 sticky top-0 left-0 z-[1000] bg-card">
        <p className="font-semibold w-[40%]">Name</p>
        <p className="font-semibold w-[20%]">Stock</p>
        <p className="font-semibold w-[20%]">Cost</p>
        <p className="font-semibold w-[20%]">Price</p>
        <p className="font-semibold w-[20%]">Profit</p>
        <p className="font-semibold w-[20%]">Margin</p>
        <p className="font-semibold w-[20%]"></p>
      </div>
      {categories.repairServiceType.map((category: any) => (
        <Collapsible
          key={category.name}
          open={expandedCategory === category.name}
          onOpenChange={() => setExpandedCategory(category.name)}
        >
          <CollapsibleTrigger className="flex items-center w-full p-2 hover:bg-primary rounded-sm group">
            <ChevronRight
              className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                expandedCategory === category.name ? "rotate-90" : ""
              }`}
            />
            <span className="ml-2">{category.name}</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-6">
            <div className="space-y-2">
              {category.repairServices.map((item: any, index: any) => (
                <div key={item.name} className="flex items-center">
                  <span className="text-sm w-[40%]">{item.name}</span>
                  <span className="text-sm w-[20%]">{item.stock}</span>
                  <span className="text-sm w-[20%]">{item.cost}</span>
                  <span className="text-sm w-[20%]">{item.price}</span>
                  <span className="text-sm w-[20%]">
                    ${calculateProfit(item.cost, item.price).toFixed(2)}
                  </span>
                  <span className="text-sm w-[20%]">
                    {calculateMargin(item.cost, item.price)}
                  </span>
                  <div className="flex items-center gap-2">
                    <EditPriceModal item={item} />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 pt-2">
                <Button variant="ghost" size="sm" className="h-8">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}
