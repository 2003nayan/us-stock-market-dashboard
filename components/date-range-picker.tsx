"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import {
  format,
  startOfDay,
  endOfDay,
  subDays,
  startOfMonth,
  startOfYear,
} from "date-fns";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStockData } from "@/lib/data-service";

export function DatePickerWithRange() {
  const dateRange = useStockData((state) => state.dateRange);
  const setDateRange = useStockData((state) => state.setDateRange);

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: dateRange.from,
    to: dateRange.to,
  });

  // Set min and max dates for the date picker
  const minDate = new Date("2020-01-02");
  const maxDate = new Date("2024-02-02");

  // Predefined date ranges
  const predefinedRanges = {
    "Last 7 Days": {
      from: startOfDay(subDays(maxDate, 6)),
      to: endOfDay(maxDate),
    },
    "Last 30 Days": {
      from: startOfDay(subDays(maxDate, 29)),
      to: endOfDay(maxDate),
    },
    "This Month": {
      from: startOfMonth(maxDate),
      to: endOfDay(maxDate),
    },
    "Last Month": {
      from: startOfDay(
        new Date(maxDate.getFullYear(), maxDate.getMonth() - 1, 1)
      ),
      to: endOfDay(new Date(maxDate.getFullYear(), maxDate.getMonth(), 0)),
    },
    "Year to Date": {
      from: startOfYear(maxDate),
      to: endOfDay(maxDate),
    },
    "All Time": {
      from: minDate,
      to: maxDate,
    },
  };

  const handleDateChange = (range: DateRange | undefined) => {
    if (range?.from) {
      // If only from date is selected, use it for both from and to
      const newRange = {
        from: startOfDay(range.from),
        to: range.to ? endOfDay(range.to) : endOfDay(range.from),
      };

      setDate(newRange);
      setDateRange(newRange);
    }
  };

  const handlePredefinedRangeChange = (value: string) => {
    const range = predefinedRanges[value as keyof typeof predefinedRanges];
    if (range) {
      setDate(range);
      setDateRange(range);
    }
  };

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full md:w-auto justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-background border-border"
          align="start"
        >
          <div className="flex flex-col sm:flex-row">
            <div className="p-3 border-b sm:border-b-0 sm:border-r">
              <Select onValueChange={handlePredefinedRangeChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(predefinedRanges).map((rangeName) => (
                    <SelectItem key={rangeName} value={rangeName}>
                      {rangeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateChange}
              numberOfMonths={2}
              fromDate={minDate}
              toDate={maxDate}
              classNames={{
                months:
                  "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                nav_button:
                  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell:
                  "text-muted-foreground rounded-md w-9 font-medium text-[0.8rem] uppercase tracking-wider py-2",
                row: "flex w-full mt-2",
                cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
                day_selected:
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle:
                  "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
              styles={{
                months: {
                  gap: "1rem",
                },
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
