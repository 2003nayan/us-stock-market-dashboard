"\"use client"

import { create } from "zustand"
import Papa from "papaparse"

export interface StockData {
  "Sr. No.": string
  Date: string
  Natural_Gas_Price: string
  "Natural_Gas_Vol.": string
  Crude_oil_Price: string
  "Crude_oil_Vol.": string
  Copper_Price: string
  "Copper_Vol.": string
  Bitcoin_Price: string
  "Bitcoin_Vol.": string
  Platinum_Price: string
  "Platinum_Vol.": string
  Ethereum_Price: string
  "Ethereum_Vol.": string
  "S&P_500_Price": string
  Nasdaq_100_Price: string
  "Nasdaq_100_Vol.": number
  Apple_Price: string
  Apple_Vol: number
  Tesla_Price: string
  Tesla_Vol: number
  Microsoft_Price: string
  Microsoft_Vol: number
  Silver_Price: number
  "Silver_Vol.": string
  Google_Price: string
  Google_Vol: number
  Nvidia_Price: string
  Nvidia_Vol: number
  Berkshire_Price: number
  Berkshire_Vol: string
  Netflix_Price: string
  Netflix_Vol: number
  Amazon_Price: string
  Amazon_Vol: number
  Meta_Price: string
  Meta_Vol: number
  Gold_Price: string
  "Gold_Vol.": string
  [key: string]: any
}

export interface DateRange {
  from: Date
  to: Date
}

interface StockDataState {
  data: StockData[]
  filteredData: StockData[]
  isLoading: boolean
  error: string | null
  dateRange: DateRange
  selectedStocks: string[]
  fetchData: () => Promise<void>
  setDateRange: (range: DateRange) => void
  setSelectedStocks: (stocks: string[]) => void
  searchStock: (query: string) => void
}

const DEFAULT_DATE_RANGE = {
  from: new Date("2020-01-02"),
  to: new Date("2024-02-02"),
}

const DEFAULT_SELECTED_STOCKS = ["S&P_500_Price", "Nasdaq_100_Price"]

export const useStockData = create<StockDataState>((set, get) => ({
  data: [],
  filteredData: [],
  isLoading: false,
  error: null,
  dateRange: DEFAULT_DATE_RANGE,
  selectedStocks: DEFAULT_SELECTED_STOCKS,

  fetchData: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/updated_us_stock_market_dataset-fWyfkX7daztK809ROSj2aKD8yOtNNI.csv",
      )
      const csvText = await response.text()

      const { data } = Papa.parse<StockData>(csvText, {
        header: true,
        skipEmptyLines: true,
      })

      // Convert date strings to Date objects for easier filtering
      const processedData = data.map((row) => ({
        ...row,
        Date: row.Date,
        dateObj: new Date(row.Date),
      }))

      set({
        data: processedData,
        filteredData: filterDataByDateRange(processedData, get().dateRange),
      })
    } catch (error) {
      set({ error: (error as Error).message })
    } finally {
      set({ isLoading: false })
    }
  },

  setDateRange: (range) => {
    set({
      dateRange: range,
      filteredData: filterDataByDateRange(get().data, range),
    })
  },

  setSelectedStocks: (stocks) => {
    set({ selectedStocks: stocks })
  },

  searchStock: (query) => {
    if (!query) {
      set({ filteredData: filterDataByDateRange(get().data, get().dateRange) })
      return
    }

    const lowerQuery = query.toLowerCase()
    const filtered = get().data.filter((item) => {
      // Filter by date range first
      const itemDate = new Date(item.Date)
      if (itemDate < get().dateRange.from || itemDate > get().dateRange.to) {
        return false
      }

      // Then filter by search query
      return Object.keys(item).some((key) => {
        if (typeof item[key] === "string" && key.includes("Price")) {
          return key.toLowerCase().includes(lowerQuery)
        }
        return false
      })
    })

    set({ filteredData: filtered })
  },
}))

// Helper function to filter data by date range
function filterDataByDateRange(data: StockData[], range: DateRange) {
  return data.filter((item) => {
    const itemDate = new Date(item.Date)
    return itemDate >= range.from && itemDate <= range.to
  })
}

// Initialize data fetching
if (typeof window !== "undefined") {
  useStockData.getState().fetchData()
}

export const calculatePercentageChange = (data: StockData[], field: string): number => {
  const firstValue = Number.parseFloat(data[0][field])
  const lastValue = Number.parseFloat(data[data.length - 1][field])
  return firstValue && !isNaN(firstValue) && !isNaN(lastValue) ? ((lastValue - firstValue) / firstValue) * 100 : 0
}

export const calculatePointChange = (data: StockData[], field: string): number => {
  const firstValue = Number.parseFloat(data[0][field])
  const lastValue = Number.parseFloat(data[data.length - 1][field])
  return lastValue - firstValue
}

export const getTopPerformers = (data: StockData[], count: number): { name: string; change: number }[] => {
  const stocks = [
    { field: "Apple_Price", name: "Apple" },
    { field: "Microsoft_Price", name: "Microsoft" },
    { field: "Google_Price", name: "Google" },
    { field: "Nvidia_Price", name: "Nvidia" },
    { field: "Amazon_Price", name: "Amazon" },
    { field: "Meta_Price", name: "Meta" },
    { field: "Netflix_Price", name: "Netflix" },
    { field: "Tesla_Price", name: "Tesla" },
    { field: "Bitcoin_Price", name: "Bitcoin" },
    { field: "Ethereum_Price", name: "Ethereum" },
    { field: "S&P_500_Price", name: "S&P 500" },
    { field: "Nasdaq_100_Price", name: "Nasdaq 100" },
    { field: "Gold_Price", name: "Gold" },
    { field: "Silver_Price", name: "Silver" },
    { field: "Platinum_Price", name: "Platinum" },
    { field: "Copper_Price", name: "Copper" },
    { field: "Crude_oil_Price", name: "Crude Oil" },
    { field: "Natural_Gas_Price", name: "Natural Gas" },
    { field: "Berkshire_Price", name: "Berkshire Hathaway" },
  ]

  const changes = stocks.map((stock) => {
    const firstValue = Number.parseFloat(data[0][stock.field])
    const lastValue = Number.parseFloat(data[data.length - 1][stock.field])
    const change =
      firstValue && !isNaN(firstValue) && !isNaN(lastValue) ? ((lastValue - firstValue) / firstValue) * 100 : 0

    return {
      name: stock.name,
      change: change,
    }
  })

  return changes.sort((a, b) => b.change - a.change).slice(0, count)
}

