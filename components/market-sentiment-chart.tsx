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
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface MarketSentimentChartProps {
  techOnly?: boolean;
  cryptoOnly?: boolean;
  indicesOnly?: boolean;
  commoditiesOnly?: boolean;
  financeOnly?: boolean;
}

export function MarketSentimentChart({
  techOnly = false,
  cryptoOnly = false,
  indicesOnly = false,
  commoditiesOnly = false,
  financeOnly = false,
}: MarketSentimentChartProps) {
  const { filteredData } = useStockData();
  const [sentimentData, setSentimentData] = useState<
    { name: string; value: number }[]
  >([]);
  const [sentimentConfig, setSentimentConfig] = useState<
    Record<string, { label: string; color: string }>
  >({});

  useEffect(() => {
    if (filteredData.length) {
      // Define stock categories
      const techStocks = [
        "Apple_Price",
        "Microsoft_Price",
        "Google_Price",
        "Nvidia_Price",
        "Amazon_Price",
        "Meta_Price",
        "Netflix_Price",
        "Tesla_Price",
      ];
      const cryptoStocks = ["Bitcoin_Price", "Ethereum_Price"];
      const indicesStocks = ["S&P_500_Price", "Nasdaq_100_Price"];
      const commoditiesStocks = [
        "Gold_Price",
        "Silver_Price",
        "Platinum_Price",
        "Copper_Price",
        "Crude_oil_Price",
        "Natural_Gas_Price",
      ];
      const financeStocks = ["Berkshire_Price"];

      // Determine which stocks to analyze based on props
      let stocksToAnalyze: string[] = [];
      if (techOnly) stocksToAnalyze = techStocks;
      else if (cryptoOnly) stocksToAnalyze = cryptoStocks;
      else if (indicesOnly) stocksToAnalyze = indicesStocks;
      else if (commoditiesOnly) stocksToAnalyze = commoditiesStocks;
      else if (financeOnly) stocksToAnalyze = financeStocks;
      else
        stocksToAnalyze = [
          ...techStocks,
          ...cryptoStocks,
          ...indicesStocks,
          ...commoditiesStocks,
          ...financeStocks,
        ];

      // Count positive and negative price movements
      let positive = 0;
      let negative = 0;
      let neutral = 0;

      stocksToAnalyze.forEach((field) => {
        const lastValue = Number.parseFloat(filteredData[0][field]);
        const firstValue = Number.parseFloat(
          filteredData[filteredData.length - 1][field]
        );

        if (isNaN(firstValue) || isNaN(lastValue) || firstValue === 0) return;

        const change = ((lastValue - firstValue) / firstValue) * 100;

        if (change > 1) positive++;
        else if (change < -1) negative++;
        else neutral++;
      });

      const sentiment = [
        { name: "Positive", value: positive },
        { name: "Negative", value: negative },
        { name: "Neutral", value: neutral },
      ];

      setSentimentData(sentiment);

      // Create config for chart
      const config: Record<string, { label: string; color: string }> = {
        Positive: {
          label: "Positive",
          color: "hsl(143, 85%, 40%)",
        },
        Negative: {
          label: "Negative",
          color: "hsl(346, 85%, 40%)",
        },
        Neutral: {
          label: "Neutral",
          color: "hsl(220, 15%, 60%)",
        },
      };

      setSentimentConfig(config);
    }
  }, [
    filteredData,
    techOnly,
    cryptoOnly,
    indicesOnly,
    commoditiesOnly,
    financeOnly,
  ]);

  if (!sentimentData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Sentiment</CardTitle>
          <CardDescription>Loading market sentiment data...</CardDescription>
        </CardHeader>
        <CardContent className="h-[500px] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">
            Loading chart data...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Sentiment</CardTitle>
        <CardDescription>
          {techOnly
            ? "Tech stocks sentiment"
            : cryptoOnly
            ? "Cryptocurrency sentiment"
            : indicesOnly
            ? "Market indices sentiment"
            : commoditiesOnly
            ? "Commodities sentiment"
            : financeOnly
            ? "Financial stocks sentiment"
            : "Distribution of positive and negative price movements"}
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <ChartContainer config={sentimentConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {sentimentData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={sentimentConfig[entry.name].color}
                  />
                ))}
              </Pie>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    valueFormatter={(value) => `${value} stocks`}
                  />
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
