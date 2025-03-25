"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useStockData } from "@/lib/data-service"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StockSearch } from "@/components/stock-search"

interface StockTableProps {
  techOnly?: boolean
  cryptoOnly?: boolean
  indicesOnly?: boolean
  commoditiesOnly?: boolean
  financeOnly?: boolean
}

interface StockTableData {
  name: string
  price: number
  change: number
  volume: number
}

export function StockTable({
  techOnly = false,
  cryptoOnly = false,
  indicesOnly = false,
  commoditiesOnly = false,
  financeOnly = false,
}: StockTableProps) {
  const { filteredData } = useStockData()
  const [tableData, setTableData] = useState<StockTableData[]>([])
  const [sorting, setSorting] = useState<SortingState>([])

  useEffect(() => {
    if (filteredData.length) {
      // Define stock categories with correct volume field mappings
      const techStocks = [
        { price: "Apple_Price", volume: "Apple_Vol", name: "Apple" },
        { price: "Microsoft_Price", volume: "Microsoft_Vol", name: "Microsoft" },
        { price: "Google_Price", volume: "Google_Vol", name: "Google" },
        { price: "Nvidia_Price", volume: "Nvidia_Vol", name: "Nvidia" },
        { price: "Amazon_Price", volume: "Amazon_Vol", name: "Amazon" },
        { price: "Meta_Price", volume: "Meta_Vol", name: "Meta" },
        { price: "Netflix_Price", volume: "Netflix_Vol", name: "Netflix" },
        { price: "Tesla_Price", volume: "Tesla_Vol", name: "Tesla" },
      ]

      const cryptoStocks = [
        { price: "Bitcoin_Price", volume: "Bitcoin_Vol.", name: "Bitcoin" },
        { price: "Ethereum_Price", volume: "Ethereum_Vol.", name: "Ethereum" },
      ]

      const indicesStocks = [
        { price: "S&P_500_Price", volume: "", name: "S&P 500" },
        { price: "Nasdaq_100_Price", volume: "Nasdaq_100_Vol.", name: "Nasdaq 100" },
      ]

      const commoditiesStocks = [
        { price: "Gold_Price", volume: "Gold_Vol.", name: "Gold" },
        { price: "Silver_Price", volume: "Silver_Vol.", name: "Silver" },
        { price: "Platinum_Price", volume: "Platinum_Vol.", name: "Platinum" },
        { price: "Copper_Price", volume: "Copper_Vol.", name: "Copper" },
        { price: "Crude_oil_Price", volume: "Crude_oil_Vol.", name: "Crude Oil" },
        { price: "Natural_Gas_Price", volume: "Natural_Gas_Vol.", name: "Natural Gas" },
      ]

      const financeStocks = [{ price: "Berkshire_Price", volume: "Berkshire_Vol", name: "Berkshire Hathaway" }]

      // Determine which stocks to display based on props
      let displayStocks: { price: string; volume: string; name: string }[] = []
      if (techOnly) displayStocks = techStocks
      else if (cryptoOnly) displayStocks = cryptoStocks
      else if (indicesOnly) displayStocks = indicesStocks
      else if (commoditiesOnly) displayStocks = commoditiesStocks
      else if (financeOnly) displayStocks = financeStocks
      else displayStocks = [...techStocks, ...cryptoStocks, ...indicesStocks, ...commoditiesStocks, ...financeStocks]

      // Format data for table
      const data = displayStocks.map((stock) => {
        // Calculate percentage change
        const firstValue = Number.parseFloat(filteredData[0][stock.price])
        const lastValue = Number.parseFloat(filteredData[filteredData.length - 1][stock.price])
        const change =
          firstValue && !isNaN(firstValue) && !isNaN(lastValue) ? ((lastValue - firstValue) / firstValue) * 100 : 0

        // Calculate average volume
        let volume = 0
        if (stock.volume) {
          volume =
            filteredData.reduce((sum, item) => {
              const itemVolume =
                typeof item[stock.volume] === "number"
                  ? item[stock.volume]
                  : Number.parseFloat(item[stock.volume] || "0")

              return sum + (isNaN(itemVolume) ? 0 : itemVolume)
            }, 0) / filteredData.length
        }

        return {
          name: stock.name,
          price: lastValue,
          change,
          volume,
        }
      })

      setTableData(data)
    }
  }, [filteredData, techOnly, cryptoOnly, indicesOnly, commoditiesOnly, financeOnly])

  const columns: ColumnDef<StockTableData>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const price = Number.parseFloat(row.getValue("price"))
        return <div>${price.toLocaleString()}</div>
      },
    },
    {
      accessorKey: "change",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Change
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const change = Number.parseFloat(row.getValue("change"))
        return (
          <div className={change >= 0 ? "text-green-500" : "text-red-500"}>
            {change >= 0 ? "+" : ""}
            {change.toFixed(2)}%
          </div>
        )
      },
    },
    {
      accessorKey: "volume",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Volume
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const volume = Number.parseFloat(row.getValue("volume"))
        if (isNaN(volume) || volume === 0) return <div>-</div>
        return (
          <div>
            {volume >= 1000000
              ? `${(volume / 1000000).toFixed(1)}M`
              : volume >= 1000
                ? `${(volume / 1000).toFixed(1)}K`
                : volume.toFixed(0)}
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
    },
  })

  if (!tableData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Stock Data</CardTitle>
          <CardDescription>Loading stock data...</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading table data...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-2">
          <CardTitle>Stock Data</CardTitle>
          <CardDescription>
            {techOnly
              ? "Tech stocks data"
              : cryptoOnly
                ? "Cryptocurrency data"
                : indicesOnly
                  ? "Market indices data"
                  : commoditiesOnly
                    ? "Commodities data"
                    : financeOnly
                      ? "Financial stocks data"
                      : "Detailed stock information"}
          </CardDescription>
          <StockSearch />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

