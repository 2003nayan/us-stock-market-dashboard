import { DashboardHeader } from "@/components/dashboard-header";
import { DatePickerWithRange } from "@/components/date-range-picker";
import { StockPriceChart } from "@/components/stock-price-chart";
import { StockHeatmap } from "@/components/stock-heatmap";
import { SectorGrowthChart } from "@/components/sector-growth-chart";
import { MarketSentimentChart } from "@/components/market-sentiment-chart";
import { TopPerformers } from "@/components/top-performers";
import { IndicesOverview } from "@/components/indices-overview";
import { StockTable } from "@/components/stock-table";

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen w-[98.5vw]">
      <DashboardHeader />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <DatePickerWithRange />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <IndicesOverview />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <StockPriceChart />
          </div>
          <div className="col-span-3">
            <StockHeatmap />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <SectorGrowthChart />
          </div>
          <div className="col-span-3">
            <MarketSentimentChart />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <TopPerformers />
          <StockTable />
        </div>
      </div>
    </div>
  );
}
