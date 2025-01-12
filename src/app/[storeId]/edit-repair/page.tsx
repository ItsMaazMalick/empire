import { getAllRepairBrandswithSeriesModal } from "@/actions/repair";
import { EditRepair } from "./edit-repair";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default async function EditRepairPage() {
  const repairBrands = await getAllRepairBrandswithSeriesModal();
  const safeBrands = repairBrands ?? [];
  return (
    <Suspense fallback={<Loader2 className="animate-spin" />}>
      <EditRepair brands={safeBrands} />
    </Suspense>
  );
}
