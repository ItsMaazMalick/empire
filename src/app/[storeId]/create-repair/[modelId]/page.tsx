import { getRepairServicesByModelId } from "@/actions/repair";
import { DisplayRepairServicesModal } from "./display-repair-services-modal";
import { AllServices } from "./all-services";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function CreateRepairModel({
  params,
}: {
  params: Promise<{ modelId: string }>;
}) {
  const modelId = await (await params)?.modelId;
  const services = await getRepairServicesByModelId(modelId);

  return (
    <div>
      <div className="pt-4 pl-4">
        <Button>
          <Link href={`/123/create-repair/${modelId}/edit-prices`}>
            Edit Repair Prices
          </Link>
        </Button>
      </div>
      <AllServices services={services} />
    </div>
  );
}
