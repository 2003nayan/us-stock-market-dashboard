"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useStockData } from "@/lib/data-service"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function SectorGrowthChart() {
  const { filteredData } = useStockData()
  const [sectorData, setSectorData] = useState<{ name: string; growth: number }[]>([])
  const [sectorConfig, setSectorConfig] = useState<Record<string, { label: string; color: string }>>({})

  useEffect(() => {
    if (filteredData.length) {
      // Define sectors and their corresponding stocks
      const sectors = {
        Tech: [
          "Apple_Price",
          "Microsoft_Price",
          "Google_Price",
          "Nvidia_Price",
          "Amazon_Price",
          "Meta_Price",
          "Netflix_Price",
          "Tesla_Price",
        ],
        Crypto: ["Bitcoin_Price", "Ethereum_Price"],
        Financial: ["Berkshire_Price"],
        Indices: ["S&P_500_Price", "Nasdaq_100_Price"],
        Commodities: [
          "Gold_Price",
          "Silver_Price",
          "Platinum_Price",
          "Copper_Price",
          "Crude_oil_Price",
          "Natural_Gas_Price",
        ],
      }

      // Calculate growth for each sector
      const sectorGrowthData = Object.entries(sectors).map(([sector, stocks]) => {
        // Calculate average growth across all stocks in the sector
        const sectorGrowth =
          stocks.reduce((sum, stock) => {
            // Calculate percentage change for this stock
            const firstValue = Number.parseFloat(filteredData[0][stock])
            const lastValue = Number.parseFloat(filteredData[filteredData.length - 1][stock])

            if (isNaN(firstValue) || isNaN(lastValue) || firstValue === 0) return sum

            const change = ((lastValue - firstValue) / firstValue) * 100
            return sum + change
          }, 0) / stocks.length

        return {
          name: sector,
          growth: sectorGrowth,
        }
      })

      setSectorData(sectorGrowthData)

      // Create config for chart with colors based on growth
      const config: Record<string, { label: string; color: string }> = {}

      sectorGrowthData.forEach((sector) => {
        config[sector.name] = {
          label: sector.name,
          color: sector.growth >= 0 ? "hsl(143, 85%, 40%)" : "hsl(346, 85%, 40%)",
        }
      })

      setSectorConfig(config)
    }
  }, [filteredData])

  if (!sectorData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sector-wise Growth</CardTitle>
          <CardDescription>Loading sector growth data...</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading chart data...</div>
        </CardContent>
      </Card>
    )
  }

  // Format data for chart
  const chartData = sectorData.map((sector) => ({
    name: sector.name,
    growth: sector.growth,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sector-wise Growth</CardTitle>
        <CardDescription>Performance comparison across market sectors</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ChartContainer config={sectorConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value.toFixed(0)}%`}
              />
              <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={100} />
              <ChartTooltip content={<ChartTooltipContent valueFormatter={(value) => `${value.toFixed(2)}%`} />} />
              <Bar
                dataKey="growth"
                radius={4}
                barSize={30}
                fill="var(--color-growth)"
                // Use dynamic fill color based on value
                fillOpacity={0.9}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

