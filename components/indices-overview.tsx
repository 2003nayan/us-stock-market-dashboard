"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { calculatePercentageChange, calculatePointChange, useStockData } from "@/lib/data-service"
import { TrendingUp, TrendingDown } from "lucide-react"

interface IndicesOverviewProps {
  fullWidth?: boolean
}

export function IndicesOverview({ fullWidth = false }: IndicesOverviewProps) {
  const { filteredData } = useStockData()
  const [spData, setSpData] = useState({ price: 0, change: 0, points: 0 })
  const [nasdaqData, setNasdaqData] = useState({ price: 0, change: 0, points: 0 })

  useEffect(() => {
    if (filteredData.length) {
      // Get the latest data point
      const latestData = filteredData[filteredData.length - 1]

      // Calculate percentage changes
      const spChange = calculatePercentageChange(filteredData, "S&P_500_Price")
      const nasdaqChange = calculatePercentageChange(filteredData, "Nasdaq_100_Price")

      // Calculate point changes
      const spPoints = calculatePointChange(filteredData, "S&P_500_Price")
      const nasdaqPoints = calculatePointChange(filteredData, "Nasdaq_100_Price")

      setSpData({
        price: Number.parseFloat(latestData["S&P_500_Price"]),
        change: spChange,
        points: spPoints,
      })

      setNasdaqData({
        price: Number.parseFloat(latestData["Nasdaq_100_Price"]),
        change: nasdaqChange,
        points: nasdaqPoints,
      })
    }
  }, [filteredData])

  const renderCard = (title: string, price: number, change: number, points: number) => (
    <Card className={fullWidth ? "col-span-1" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {change >= 0 ? (
          <TrendingUp className="h-4 w-4 text-green-500" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-500" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{price.toLocaleString()}</div>
        <div className="flex items-center space-x-2">
          <p className={`text-xs ${change >= 0 ? "text-green-500" : "text-red-500"}`}>
            {change >= 0 ? "+" : ""}
            {change.toFixed(2)}%
          </p>
          <p className="text-xs text-muted-foreground">
            {points >= 0 ? "+" : ""}
            {points.toFixed(0)} points
          </p>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <>
      {renderCard("S&P 500", spData.price, spData.change, spData.points)}
      {renderCard("Nasdaq 100", nasdaqData.price, nasdaqData.change, nasdaqData.points)}
    </>
  )
}

