import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  getAllRepairBrandswithSeriesModal,
  getAllRepairBrandswithSeriesModalInventory,
} from "@/actions/repair";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { Inventory } from "./repair-section";

export default async function InventoryPage() {
  // const brands = await getAllRepairBrandswithSeriesModalInventory();
  // const safeBrands = brands ?? [];
  return (
    <div>
      <p className="p-4 font-bold text-xl text-primary-foreground">INVENTORY</p>
      <Suspense fallback={<Loader2 className="animate-spin" />}>
        <Inventory />
      </Suspense>
    </div>
  );
}
