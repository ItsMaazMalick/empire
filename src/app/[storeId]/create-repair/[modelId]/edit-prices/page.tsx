import { getRepairServicesByModelId } from "@/actions/repair";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PricesSection } from "./prices-section";

export default async function EditRepairPrices({
  params,
}: {
  params: Promise<{ modelId: string }>;
}) {
  const modelId = await (await params)?.modelId;
  const services = await getRepairServicesByModelId(modelId);
  console.log(services);

  return (
    <div className="grid grid-cols-2 gap-4 p-4 lg:px-10">
      <div className="p-4 lg:p-10 rounded-lg bg-card">
        <div className="my-4">
          <Label>Device Model</Label>
          <Input readOnly value={services?.name} />
        </div>
        <div className="my-4">
          <Label>Device brand parent</Label>
          <Input readOnly value={services?.series.brand.name} />
        </div>
        <div className="my-4">
          <Label>Device series line</Label>
          <Input readOnly value={services?.series.name} />
        </div>
      </div>
      <div className="p-4  rounded-lg bg-card">
        <PricesSection services={services} />
      </div>
    </div>
  );
}
