import { DashboardHeader } from "@/components/dashboard-header"
import { DateRangePicker } from "@/components/date-range-picker"
import { StockPriceChart } from "@/components/stock-price-chart"
import { StockTable } from "@/components/stock-table"
import { TechStocksOverview } from "@/components/tech-stocks-overview"
import { MarketSentimentChart } from "@/components/market-sentiment-chart"

export default function TechStocksPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Tech Stocks</h2>
          <div className="flex items-center space-x-2">
            <DateRangePicker />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <TechStocksOverview />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <StockPriceChart techOnly={true} />
          <MarketSentimentChart techOnly={true} />
        </div>
        <div className="grid gap-4">
          <StockTable techOnly={true} />
        </div>
      </div>
    </div>
  )
}

