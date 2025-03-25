"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStockData } from "@/lib/data-service"
import { TrendingUp, TrendingDown } from "lucide-react"

export function CryptoOverview() {
  const { filteredData } = useStockData()
  const [cryptoData, setCryptoData] = useState<{ name: string; price: number; change: number }[]>([])

  useEffect(() => {
    if (filteredData.length) {
      // Define crypto assets
      const cryptoAssets = [
        { field: "Bitcoin_Price", name: "Bitcoin" },
        { field: "Ethereum_Price", name: "Ethereum" },
      ]

      // Calculate data for each crypto
      const data = cryptoAssets.map((crypto) => {
        const firstValue = Number.parseFloat(filteredData[0][crypto.field])
        const lastValue = Number.parseFloat(filteredData[filteredData.length - 1][crypto.field])
        const change =
          firstValue && !isNaN(firstValue) && !isNaN(lastValue) ? ((lastValue - firstValue) / firstValue) * 100 : 0

        return {
          name: crypto.name,
          price: lastValue,
          change,
        }
      })

      // Sort by change (best performers first)
      const sortedData = data.sort((a, b) => b.change - a.change)

      setCryptoData(sortedData)
    }
  }, [filteredData])

  if (!cryptoData.length) {
    return (
      <>
        {[1, 2].map((i) => (
          <Card key={i} className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-6 w-24 bg-muted rounded animate-pulse"></div>
              <div className="h-4 w-16 bg-muted rounded animate-pulse mt-2"></div>
            </CardContent>
          </Card>
        ))}
      </>
    )
  }

  return (
    <>
      {cryptoData.map((crypto, index) => (
        <Card key={index} className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{crypto.name}</CardTitle>
            {crypto.change >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${crypto.price.toLocaleString()}</div>
            <p className={`text-xs ${crypto.change >= 0 ? "text-green-500" : "text-red-500"}`}>
              {crypto.change >= 0 ? "+" : ""}
              {crypto.change.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

