"use client";

import { Fragment, useState } from "react";
import { ChevronDown, ChevronRight, Edit, Plus } from "lucide-react";
import { AddBrandModal } from "./add-brand-modal";
import { AddSeriesModal } from "./add-series-modal";
import { AddModelModal } from "./add-model-modal";
import { Brand } from "@/types/repair-brand";
import { Button } from "@/components/ui/button";

interface EditRepairProps {
  brands: Brand[];
}

export function EditRepair({ brands }: EditRepairProps) {
  const [expandedBrands, setExpandedBrands] = useState<string[]>(
    brands.length > 0 ? [brands[0]?.id] : []
  );
  const [expandedSeries, setExpandedSeries] = useState<string[]>(
    brands.length > 0 && brands[0]?.repairSeries?.length > 0
      ? [brands[0]?.repairSeries[0]?.id]
      : []
  );

  const toggleBrand = (brandId: string) => {
    setExpandedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  const toggleSeries = (seriesId: string) => {
    setExpandedSeries((prev) =>
      prev.includes(seriesId)
        ? prev.filter((id) => id !== seriesId)
        : [...prev, seriesId]
    );
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">Menu Items</h1>
          <AddBrandModal>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Brand
            </Button>
          </AddBrandModal>
        </div>

        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleBrand(brand.id)}
                  className="flex items-center space-x-2 hover:text-blue-400"
                >
                  {expandedBrands.includes(brand.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <span>{brand.name}</span>
                </button>

                <AddBrandModal brand={brand}>
                  <div className="flex items-center gap-2 text-xs cursor-pointer">
                    Edit {brand.name}
                    <Edit className="size-3" />
                  </div>
                </AddBrandModal>

                <AddSeriesModal brandId={brand.id}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Series Line
                  </Button>
                </AddSeriesModal>
              </div>

              {expandedBrands.includes(brand.id) && (
                <div className="ml-4 space-y-2">
                  {brand.repairSeries.map((series) => (
                    <div key={series.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => toggleSeries(series.id)}
                          className="flex items-center space-x-2 hover:text-blue-400"
                        >
                          {expandedSeries.includes(series.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          <span>{series.name}</span>
                        </button>
                        <AddSeriesModal brandId={brand.id} series={series}>
                          <div className="flex items-center gap-2 text-xs cursor-pointer">
                            Edit {series.name}
                            <Edit className="size-3" />
                          </div>
                        </AddSeriesModal>
                        <AddModelModal seriesId={series.id}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Model
                          </Button>
                        </AddModelModal>
                      </div>

                      {expandedSeries.includes(series.id) && (
                        <div className="ml-4 space-y-2">
                          {series.models.map((model) => (
                            <div
                              key={model.id}
                              className="flex items-center gap-4"
                            >
                              <div className="pl-6 py-1 hover:bg-blue-900/20 rounded transition-colors">
                                {model.name}
                              </div>
                              <AddModelModal seriesId={series.id} model={model}>
                                <div className="flex items-center gap-2 text-xs cursor-pointer">
                                  <Edit className="size-3" />
                                </div>
                              </AddModelModal>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
