import Link from "next/link";
import { RepairDevices } from "./repair-section";
import { Button } from "@/components/ui/button";
import { getAllRepairBrandswithSeriesModal } from "@/actions/repair";

export default async function CreateRepair() {
  const brands = await getAllRepairBrandswithSeriesModal();
  const safeBrands = brands ?? [];
  return (
    <div>
      <div className="flex items-center justify-end pt-4 pr-4">
        <Button asChild>
          <Link href={`/123/edit-repair`}>Manage repair & services</Link>
        </Button>
      </div>
      <RepairDevices brands={safeBrands} />
    </div>
  );
}
