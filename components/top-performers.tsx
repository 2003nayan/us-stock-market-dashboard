"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getTopPerformers, useStockData } from "@/lib/data-service"
import { ArrowUpRight } from "lucide-react"

export function TopPerformers() {
  const { filteredData } = useStockData()
  const [topStocks, setTopStocks] = useState<{ name: string; change: number }[]>([])

  useEffect(() => {
    if (filteredData.length) {
      setTopStocks(getTopPerformers(filteredData, 5))
    }
  }, [filteredData])

  if (!topStocks.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
          <CardDescription>Loading top performing stocks...</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading data...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performers</CardTitle>
        <CardDescription>Best performing stocks in the selected period</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topStocks.map((stock, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <ArrowUpRight className={`h-5 w-5 ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`} />
                </div>
                <div>
                  <div className="font-medium">{stock.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {stock.change >= 0 ? "Increased" : "Decreased"} over period
                  </div>
                </div>
              </div>
              <div className={`text-lg font-bold ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                {stock.change.toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

