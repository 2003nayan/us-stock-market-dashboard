"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useStockData } from "@/lib/data-service";

export function StockHeatmap() {
  const { filteredData } = useStockData();
  const [topStocks, setTopStocks] = useState<
    { name: string; volume: number }[]
  >([]);

  useEffect(() => {
    if (filteredData.length) {
      // Calculate total volume for each stock within the date range
      const volumeFields = Object.keys(filteredData[0]).filter((key) =>
        key.includes("Vol")
      );

      const stockVolumes = volumeFields.map((field) => {
        // Get the corresponding stock name
        const stockName = field.replace("_Vol.", "").replace("_Vol", "");

        // Calculate total volume within date range
        const totalVolume = filteredData.reduce((sum, item) => {
          const volume =
            typeof item[field] === "number"
              ? item[field]
              : Number.parseFloat(item[field]);

          return sum + (isNaN(volume) ? 0 : volume);
        }, 0);

        return {
          name: stockName,
          volume: totalVolume,
        };
      });

      // Sort by volume and get top 16
      const top16 = stockVolumes
        .sort((a, b) => b.volume - a.volume)
        .slice(0, 16);

      setTopStocks(top16);
    }
  }, [filteredData]);

  // Calculate color intensity based on volume
  const getColorIntensity = (volume: number) => {
    const maxVolume = Math.max(...topStocks.map((stock) => stock.volume));
    const minVolume = Math.min(...topStocks.map((stock) => stock.volume));
    const normalizedVolume = (volume - minVolume) / (maxVolume - minVolume);

    // Return a color from blue (low) to red (high)
    return `hsl(${Math.floor(220 - normalizedVolume * 220)}, 70%, ${Math.max(
      40,
      70 - normalizedVolume * 30
    )}%)`;
  };

  if (!topStocks.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trading Volume Heatmap</CardTitle>
          <CardDescription>Loading trading volume data...</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">
            Loading heatmap data...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trading Volume Heatmap</CardTitle>
        <CardDescription>
          Top 16 most-traded stocks by total volume in selected period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2 h-[550px]">
          {topStocks.map((stock, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-2 rounded-md text-center transition-colors"
              style={{
                backgroundColor: getColorIntensity(stock.volume),
                color:
                  stock.volume > topStocks[0].volume / 2 ? "white" : "black",
              }}
            >
              <div className="font-medium text-sm">{stock.name}</div>
              <div className="text-xs mt-1">
                {/* {stock.volume >= 1000000
                  ? `${(stock.volume / 1000000).toFixed(1)}M`
                  : stock.volume >= 1000
                  ? `${(stock.volume / 1000).toFixed(1)}K`
                  : stock.volume.toFixed(0)} */}
                {stock.volume >= 1000000000
                  ? `${(stock.volume / 1000000000).toFixed(1)}B`
                  : stock.volume >= 1000000
                  ? `${(stock.volume / 1000000).toFixed(1)}M`
                  : stock.volume >= 1000
                  ? `${(stock.volume / 1000).toFixed(1)}K`
                  : stock.volume.toFixed(0)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
