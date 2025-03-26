"use client";

import type React from "react";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useStockData } from "@/lib/data-service";
import { useState, useEffect } from "react";
import { debounce } from "lodash";

export function StockSearch() {
  const { searchStock } = useStockData();
  const [query, setQuery] = useState("");

  const debouncedSearch = debounce((query: string) => searchStock(query), 300);

  useEffect(() => {
    debouncedSearch(query);
    return () => debouncedSearch.cancel();
  }, [query]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

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
  );
}
