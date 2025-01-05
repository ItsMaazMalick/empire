import { getAllRepairBrandswithSeriesModal } from "@/actions/repair";
import { EditRepair } from "./edit-repair";

export default async function EditRepairPage() {
  const repairBrands = await getAllRepairBrandswithSeriesModal();
  const safeBrands = repairBrands ?? [];
  return <EditRepair brands={safeBrands} />;
}
