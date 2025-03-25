"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStockData } from "@/lib/data-service"
import { TrendingUp, TrendingDown } from "lucide-react"

export function FinanceOverview() {
  const { filteredData } = useStockData()
  const [financeData, setFinanceData] = useState<{ name: string; price: number; change: number }[]>([])

  useEffect(() => {
    if (filteredData.length) {
      // Define finance stocks
      const financeStocks = [{ field: "Berkshire_Price", name: "Berkshire Hathaway" }]

      // Calculate data for each finance stock
      const data = financeStocks.map((stock) => {
        const firstValue = Number.parseFloat(filteredData[0][stock.field].toString())
        const lastValue = Number.parseFloat(filteredData[filteredData.length - 1][stock.field].toString())
        const change =
          firstValue && !isNaN(firstValue) && !isNaN(lastValue) ? ((lastValue - firstValue) / firstValue) * 100 : 0

        return {
          name: stock.name,
          price: lastValue,
          change,
        }
      })

      // Sort by change (best performers first)
      const sortedData = data.sort((a, b) => b.change - a.change)

      setFinanceData(sortedData)
    }
  }, [filteredData])

  if (!financeData.length) {
    return (
      <Card className="col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-6 w-24 bg-muted rounded animate-pulse"></div>
          <div className="h-4 w-16 bg-muted rounded animate-pulse mt-2"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {financeData.map((stock, index) => (
        <Card key={index} className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stock.name}</CardTitle>
            {stock.change >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stock.price.toLocaleString()}</div>
            <p className={`text-xs ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`}>
              {stock.change >= 0 ? "+" : ""}
              {stock.change.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

