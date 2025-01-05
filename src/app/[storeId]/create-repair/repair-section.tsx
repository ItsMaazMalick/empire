"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Brand, Series, Model } from "@/types/repair-brand";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface RepairDevicesProps {
  brands: Brand[];
}

export function RepairDevices({ brands }: RepairDevicesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(brands[0]?.id || "");

  const filterDevices = (models: Model[]) => {
    return models.filter((model) =>
      model.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const selectedBrandData = useMemo(() => {
    return brands.find((brand) => brand.id === selectedBrand);
  }, [selectedBrand, brands]);

  return (
    <div className="min-h-screen p-4 lg:px-10">
      {/* Brand Navigation */}
      <ScrollArea className="w-full border-b border-blue-900/50 pb-4">
        <div className="flex space-x-6">
          {brands?.map((brand) => (
            <button
              key={brand.id}
              className={`whitespace-nowrap text-sm transition-colors p-2 rounded-md ${
                selectedBrand === brand.id
                  ? "text-white font-medium bg-secondary"
                  : "text-blue-400 hover:text-blue-300"
              }`}
              onClick={() => setSelectedBrand(brand.id)}
            >
              {brand.name}
            </button>
          ))}
        </div>
      </ScrollArea>

      {/* Search Bar */}
      <div className="relative my-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search for a device"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#132f4c] border-blue-900/50 pl-10 text-white placeholder:text-gray-400"
        />
      </div>

      {/* Device Series Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {selectedBrandData?.repairSeries?.map((series) => (
          <div key={series.id} className="space-y-4 ">
            <h3 className="text-blue-400 font-medium">{series.name}</h3>
            <ScrollArea className="max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-track]:bg-card [&::-webkit-scrollbar-thumb]:bg-primary [&::-webkit-scrollbar-thumb]:rounded-full pr-4">
              <div className="space-y-2">
                {filterDevices(series.models).map((model) => (
                  <Button
                    variant={"link"}
                    asChild
                    key={model.id}
                    className="w-full text-left text-xs text-gray-300 hover:text-white hover:bg-blue-900/30 p-1 rounded transition-colors"
                  >
                    <Link href={`/123/create-repair/${model.id}`}>
                      {model.name}
                    </Link>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        ))}
      </div>
    </div>
  );
}
