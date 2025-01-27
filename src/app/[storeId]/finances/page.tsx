import { getFinances } from "@/actions/order";
import DateRangePicker from "./date-range-picker";
import { FinanceMetrics } from "./finance-matrics";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { getStoreFromSession, getUserFromSession } from "@/actions/session";
import { redirect } from "next/navigation";

export default async function FinancesPage() {
  const user = await getUserFromSession();
  const store = await getStoreFromSession();
  if (!user || user.role !== "MANAGER") {
    return redirect(`/${store?.id}/dashboard`);
  }
  const metrics = await getFinances();
  return (
    <div className="min-h-screen bg-[#0B1121] p-6">
      {/* Date Range Picker */}
      <div className="mb-8">
        <DateRangePicker />
      </div>

      {/* Finance Metrics */}
      <Suspense fallback={<Loader2 className="animate-spin" />}>
        <FinanceMetrics metrics={metrics} />
      </Suspense>
    </div>
  );
}
