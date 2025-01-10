import DateRangePicker from "./date-range-picker";
import { FinanceMetrics } from "./finance-matrics";

export default function FinancesPage() {
  return (
    <div className="min-h-screen bg-[#0B1121] p-6">
      {/* Date Range Picker */}
      <div className="mb-8">
        <DateRangePicker />
      </div>

      {/* Finance Metrics */}
      <FinanceMetrics />
    </div>
  );
}
