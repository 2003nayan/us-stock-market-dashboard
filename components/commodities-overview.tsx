"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStockData } from "@/lib/data-service";
import { TrendingUp, TrendingDown } from "lucide-react";

export function CommoditiesOverview() {
  const { filteredData } = useStockData();
  const [commoditiesData, setCommoditiesData] = useState<
    { name: string; price: number; change: number }[]
  >([]);

  useEffect(() => {
    if (filteredData.length) {
      // Define commodities
      const commodities = [
        { field: "Gold_Price", name: "Gold" },
        { field: "Silver_Price", name: "Silver" },
        { field: "Crude_oil_Price", name: "Crude Oil" },
        { field: "Natural_Gas_Price", name: "Natural Gas" },
        { field: "Platinum_Price", name: "Platinum" },
        { field: "Copper_Price", name: "Copper" },
      ];

      // Calculate data for each commodity
      const data = commodities.map((commodity) => {
        const lastValue = Number.parseFloat(filteredData[0][commodity.field]);
        const firstValue = Number.parseFloat(
          filteredData[filteredData.length - 1][commodity.field]
        );
        const change =
          firstValue && !isNaN(firstValue) && !isNaN(lastValue)
            ? ((lastValue - firstValue) / firstValue) * 100
            : 0;

        return {
          name: commodity.name,
          price: firstValue,
          change,
        };
      });

      // Sort by change (best performers first)
      const sortedData = data.sort((a, b) => b.change - a.change).slice(0, 4);

      setCommoditiesData(sortedData);
    }
  }, [filteredData]);

  if (!commoditiesData.length) {
    return (
      <>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
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
    );
  }

  return (
    <>
      {commoditiesData.map((commodity, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {commodity.name}
            </CardTitle>
            {commodity.change >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${commodity.price.toLocaleString()}
            </div>
            <p
              className={`text-xs ${
                commodity.change >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {commodity.change >= 0 ? "+" : ""}
              {commodity.change.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
