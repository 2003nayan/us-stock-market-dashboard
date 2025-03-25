"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useStockData } from "@/lib/data-service";

interface DateRangePickerProps {
  className?: string;
}

export function DateRangePicker({ className }: DateRangePickerProps) {
  const { dateRange, setDateRange } = useStockData();
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: dateRange.from,
    to: dateRange.to,
  });

  const DATE_CONSTRAINTS = {
    min: new Date("2020-01-02"),
    max: new Date("2024-02-02"),
  } as const;

  const formatDateRange = (range: DateRange) => {
    const { from, to } = range;
    if (!from) return "Pick a date range";
    if (!to) return format(from, "LLL dd, y");
    return `${format(from, "LLL dd, y")} - ${format(to, "LLL dd, y")}`;
  };

  const handleDateChange = (range: DateRange | undefined) => {
    if (!range?.from || !range?.to) return;
    setDate(range);
    setDateRange({ from: range.from, to: range.to });
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date && formatDateRange(date)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
            fromDate={DATE_CONSTRAINTS.min}
            toDate={DATE_CONSTRAINTS.max}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
