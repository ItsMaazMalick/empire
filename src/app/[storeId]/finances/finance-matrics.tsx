"use client";

import { formatCurrency } from "@/lib/format-currency";

interface MetricCardProps {
  title: string;
  value: string;
  description?: string;
}

interface Metrics {
  netSales: number;
  grossProfit: number;
  grossMargin: number;
  salesByType: {
    products: number;
    repairs: number;
  };
  salesByLocation: Record<string, number>;
}

const MetricCard = ({ title, value, description }: MetricCardProps) => (
  <div className="bg-[#0F1629] rounded-lg p-6">
    <h3 className="text-gray-400 mb-2">{title}</h3>
    <div className="text-3xl font-bold text-white mb-2">{value}</div>
    {description && <p className="text-sm text-gray-400">{description}</p>}
  </div>
);

type Props = {
  metrics: {
    success: boolean;
    data?: Metrics;
    error?: string;
  };
};

export function FinanceMetrics({ metrics }: Props) {
  if (!metrics.success) {
    return (
      <div className="text-white">Failed to load metrics: {metrics.error}</div>
    );
  }

  const data = metrics.data!;

  return (
    <div className="space-y-8">
      {/* Top Metrics */}
      <div className="grid md:grid-cols-3 gap-4">
        <MetricCard
          title="Net Sales"
          value={formatCurrency(data.netSales)}
          description="This is the total of all your sales including taxes and discounts added."
        />
        <MetricCard
          title="Gross Profit"
          value={formatCurrency(data.grossProfit)}
          description="Profit is reported only for products that had cost recorded at the time they were sold"
        />
        <MetricCard
          title="Gross Margin"
          value={`${data.grossMargin.toFixed(2)}%`}
        />
      </div>

      {/* Finances Breakdown */}
      <div>
        <h2 className="text-white text-xl mb-4">Finances breakdown</h2>
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Earnings by Payment Provider */}
          <div className="bg-[#0F1629] rounded-lg p-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-white">Earnings by payment provider</h3>
              <span className="text-gray-400">Amount</span>
            </div>
            <p className="text-gray-400">
              No Earnings by payment provider record for this store yet
            </p>
          </div>

          {/* Sales Breakdown */}
          <div className="space-y-4">
            {/* Sales by Type */}
            <div className="bg-[#0F1629] rounded-lg p-6">
              <div className="flex justify-between mb-4">
                <h3 className="text-white">Sales by type</h3>
                <span className="text-gray-400">Amount</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Products</span>
                  <span className="text-white">
                    {formatCurrency(data.salesByType.products)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Repairs</span>
                  <span className="text-white">
                    {formatCurrency(data.salesByType.repairs)}
                  </span>
                </div>
              </div>
            </div>

            {/* Sales by Location */}
            <div className="bg-[#0F1629] rounded-lg p-6">
              <div className="flex justify-between mb-4">
                <h3 className="text-white">Sales by location</h3>
                <span className="text-gray-400">Amount</span>
              </div>
              {Object.entries(data.salesByLocation).map(
                ([location, amount]) => (
                  <div key={location} className="flex justify-between">
                    <span className="text-gray-400">Empire</span>
                    <span className="text-white">{formatCurrency(amount)}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
