"use client"

import type React from "react"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useStockData } from "@/lib/data-service"
import { useState } from "react"

export function StockSearch() {
  const { searchStock } = useStockData()
  const [query, setQuery] = useState("")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    searchStock(value)
  }

  return (
    <div className="relative w-full">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search stocks..."
        className="w-full pl-8"
        value={query}
        onChange={handleSearch}
      />
    </div>
  )
}

