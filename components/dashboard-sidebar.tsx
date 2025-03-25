"use client"

import { BarChart3, Cpu, Bitcoin, TrendingUp, Gem, Building2, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center px-4 py-2">
        <Link href="/" className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          <span className="text-lg font-bold">Stock Dashboard</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/"}>
              <Link href="/">
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/tech-stocks"}>
              <Link href="/tech-stocks">
                <Cpu className="h-5 w-5" />
                <span>Tech Stocks</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/cryptocurrency"}>
              <Link href="/cryptocurrency">
                <Bitcoin className="h-5 w-5" />
                <span>Cryptocurrency</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/indices"}>
              <Link href="/indices">
                <TrendingUp className="h-5 w-5" />
                <span>Indices</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/commodities"}>
              <Link href="/commodities">
                <Gem className="h-5 w-5" />
                <span>Commodities</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/banking-finance"}>
              <Link href="/banking-finance">
                <Building2 className="h-5 w-5" />
                <span>Banking & Finance</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

