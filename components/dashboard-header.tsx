"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

export function DashboardHeader() {
  const pathname = usePathname()

  // Get the title based on the current path
  const getTitle = () => {
    switch (pathname) {
      case "/":
        return "Dashboard"
      case "/tech-stocks":
        return "Tech Stocks"
      case "/cryptocurrency":
        return "Cryptocurrency"
      case "/indices":
        return "Indices"
      case "/commodities":
        return "Commodities"
      case "/banking-finance":
        return "Banking & Finance"
      default:
        return "Dashboard"
    }
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <SidebarTrigger />
      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">{getTitle()}</h1>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

