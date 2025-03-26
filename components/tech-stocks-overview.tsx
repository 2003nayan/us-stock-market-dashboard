"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStockData } from "@/lib/data-service";
import { TrendingUp, TrendingDown } from "lucide-react";

export function TechStocksOverview() {
  const { filteredData } = useStockData();
  const [techData, setTechData] = useState<
    { name: string; price: number; change: number }[]
  >([]);

  useEffect(() => {
    if (filteredData.length) {
      // Define tech stocks
      const techStocks = [
        { field: "Apple_Price", name: "Apple" },
        { field: "Microsoft_Price", name: "Microsoft" },
        { field: "Google_Price", name: "Google" },
        { field: "Amazon_Price", name: "Amazon" },
        { field: "Nvidia_Price", name: "Nvidia" },
        { field: "Meta_Price", name: "Meta" },
        { field: "Netflix_Price", name: "Netflix" },
        { field: "Tesla_Price", name: "Tesla" },
      ];

      // Calculate data for each tech stock
      const data = techStocks.map((stock) => {
        const firstValue = Number.parseFloat(filteredData[0][stock.field]);
        const lastValue = Number.parseFloat(
          filteredData[filteredData.length - 1][stock.field]
        );
        const change =
          firstValue && !isNaN(firstValue) && !isNaN(lastValue)
            ? ((firstValue - lastValue) / lastValue) * 100
            : 0;

        return {
          name: stock.name,
          price: firstValue,
          change,
        };
      });

      // Sort by change (best performers first)
      const sortedData = data.sort((a, b) => b.change - a.change).slice(0, 4);

      setTechData(sortedData);
    }
  }, [filteredData]);

  if (!techData.length) {
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
      {techData.map((stock, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stock.name}</CardTitle>
            {stock.change >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stock.price.toLocaleString()}
            </div>
            <p
              className={`text-xs ${
                stock.change >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {stock.change >= 0 ? "+" : ""}
              {stock.change.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
