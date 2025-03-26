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
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StockPriceChartProps {
  techOnly?: boolean;
  cryptoOnly?: boolean;
  indicesOnly?: boolean;
  commoditiesOnly?: boolean;
  financeOnly?: boolean;
}

export function StockPriceChart({
  techOnly = false,
  cryptoOnly = false,
  indicesOnly = false,
  commoditiesOnly = false,
  financeOnly = false,
}: StockPriceChartProps) {
  const { filteredData, selectedStocks, setSelectedStocks } = useStockData();
  const [chartData, setChartData] = useState<any[]>([]);
  const [stockConfig, setStockConfig] = useState<
    Record<string, { label: string; color: string }>
  >({});

  // Define stock categories
  const techStocks = [
    { field: "Apple_Price", name: "Apple" },
    { field: "Microsoft_Price", name: "Microsoft" },
    { field: "Google_Price", name: "Google" },
    { field: "Nvidia_Price", name: "Nvidia" },
    { field: "Amazon_Price", name: "Amazon" },
    { field: "Meta_Price", name: "Meta" },
    { field: "Netflix_Price", name: "Netflix" },
    { field: "Tesla_Price", name: "Tesla" },
  ];

  const cryptoStocks = [
    { field: "Bitcoin_Price", name: "Bitcoin" },
    { field: "Ethereum_Price", name: "Ethereum" },
  ];

  const indicesStocks = [
    { field: "S&P_500_Price", name: "S&P 500" },
    { field: "Nasdaq_100_Price", name: "Nasdaq 100" },
  ];

  const commoditiesStocks = [
    { field: "Gold_Price", name: "Gold" },
    { field: "Silver_Price", name: "Silver" },
    { field: "Platinum_Price", name: "Platinum" },
    { field: "Copper_Price", name: "Copper" },
    { field: "Crude_oil_Price", name: "Crude Oil" },
    { field: "Natural_Gas_Price", name: "Natural Gas" },
  ];

  const financeStocks = [
    { field: "Berkshire_Price", name: "Berkshire Hathaway" },
  ];

  // Initialize with indices by default
  useEffect(() => {
    if (
      !techOnly &&
      !cryptoOnly &&
      !indicesOnly &&
      !commoditiesOnly &&
      !financeOnly
    ) {
      setSelectedStocks(["S&P_500_Price", "Nasdaq_100_Price"]);
    }
  }, [
    techOnly,
    cryptoOnly,
    indicesOnly,
    commoditiesOnly,
    financeOnly,
    setSelectedStocks,
  ]);

  useEffect(() => {
    if (!filteredData.length) return;

    // Determine which stocks to display based on props
    let displayStocks: string[] = [];
    if (techOnly) displayStocks = techStocks.map((s) => s.field);
    else if (cryptoOnly) displayStocks = cryptoStocks.map((s) => s.field);
    else if (indicesOnly) displayStocks = indicesStocks.map((s) => s.field);
    else if (commoditiesOnly)
      displayStocks = commoditiesStocks.map((s) => s.field);
    else if (financeOnly) displayStocks = financeStocks.map((s) => s.field);
    else displayStocks = selectedStocks;

    // Create color mapping for stocks
    const colors = [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
      "hsl(var(--chart-5))",
      "hsl(var(--chart-6))",
      "hsl(var(--chart-7))",
      "hsl(var(--chart-8))",
    ];

    const newStockConfig: Record<string, { label: string; color: string }> = {};
    displayStocks.forEach((stock, index) => {
      const stockName = stock.replace("_Price", "");
      newStockConfig[stock] = {
        label: stockName,
        color: colors[index % colors.length],
      };
    });
    setStockConfig(newStockConfig);

    // Format data for chart - sort by date in ascending order
    const formattedData = filteredData
      .slice()
      .sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime())
      .map((item) => {
        const dataPoint: any = {
          date: new Date(item.Date).toLocaleDateString(),
        };

        displayStocks.forEach((stock) => {
          dataPoint[stock] = Number.parseFloat(item[stock]);
        });

        return dataPoint;
      });

    setChartData(formattedData);
  }, [
    filteredData,
    selectedStocks,
    techOnly,
    cryptoOnly,
    indicesOnly,
    commoditiesOnly,
    financeOnly,
    setSelectedStocks,
  ]);

  const handleAddStock = (stockField: string) => {
    if (!selectedStocks.includes(stockField)) {
      setSelectedStocks([...selectedStocks, stockField]);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 border rounded shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!chartData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Stock Price Comparison</CardTitle>
          <CardDescription>Loading stock price data...</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">
            Loading chart data...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="mb-2">Stock Price Comparison</CardTitle>
          <CardDescription>
            {techOnly
              ? "Tech stock prices"
              : cryptoOnly
              ? "Cryptocurrency prices"
              : indicesOnly
              ? "Market indices"
              : commoditiesOnly
              ? "Commodity prices"
              : financeOnly
              ? "Financial stock prices"
              : "Compare stock prices over time"}
          </CardDescription>
        </div>
        {!techOnly &&
          !cryptoOnly &&
          !indicesOnly &&
          !commoditiesOnly &&
          !financeOnly && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Stock
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 h-[400px] overflow-y-auto">
                <DropdownMenuLabel>Add Stock to Chart</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Indices
                  </DropdownMenuLabel>
                  {indicesStocks.map((stock) => (
                    <DropdownMenuItem
                      key={stock.field}
                      onClick={() => handleAddStock(stock.field)}
                      disabled={selectedStocks.includes(stock.field)}
                    >
                      {stock.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Tech Stocks
                  </DropdownMenuLabel>
                  {techStocks.map((stock) => (
                    <DropdownMenuItem
                      key={stock.field}
                      onClick={() => handleAddStock(stock.field)}
                      disabled={selectedStocks.includes(stock.field)}
                    >
                      {stock.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Cryptocurrency
                  </DropdownMenuLabel>
                  {cryptoStocks.map((stock) => (
                    <DropdownMenuItem
                      key={stock.field}
                      onClick={() => handleAddStock(stock.field)}
                      disabled={selectedStocks.includes(stock.field)}
                    >
                      {stock.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Commodities
                  </DropdownMenuLabel>
                  {commoditiesStocks.map((stock) => (
                    <DropdownMenuItem
                      key={stock.field}
                      onClick={() => handleAddStock(stock.field)}
                      disabled={selectedStocks.includes(stock.field)}
                    >
                      {stock.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Banking & Finance
                  </DropdownMenuLabel>
                  {financeStocks.map((stock) => (
                    <DropdownMenuItem
                      key={stock.field}
                      onClick={() => handleAddStock(stock.field)}
                      disabled={selectedStocks.includes(stock.field)}
                    >
                      {stock.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
      </CardHeader>
      <CardContent className="">
        <ChartContainer config={stockConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={30}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {Object.keys(stockConfig).map((stock) => (
                <Line
                  key={stock}
                  type="monotone"
                  dataKey={stock}
                  name={stockConfig[stock].label}
                  stroke={stockConfig[stock].color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
