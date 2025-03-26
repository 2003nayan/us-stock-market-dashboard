import { DashboardHeader } from "@/components/dashboard-header";
import { DatePickerWithRange } from "@/components/date-range-picker";
import { StockPriceChart } from "@/components/stock-price-chart";
import { StockTable } from "@/components/stock-table";
import { FinanceOverview } from "@/components/finance-overview";
import { MarketSentimentChart } from "@/components/market-sentiment-chart";

export default function BankingFinancePage() {
  return (
    <div className="flex flex-col min-h-screen w-[98.5vw]">
      <DashboardHeader />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Banking & Finance
          </h2>
          <div className="flex items-center space-x-2">
            <DatePickerWithRange />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
          <FinanceOverview />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <StockPriceChart financeOnly={true} />
          <MarketSentimentChart financeOnly={true} />
        </div>
        <div className="grid gap-4">
          <StockTable financeOnly={true} />
        </div>
      </div>
    </div>
  );
}
