"use client";
import { useState, useEffect } from "react";
import {
  BarChart3,
  Cpu,
  Bitcoin,
  TrendingUp,
  Gem,
  Building2,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function DashboardSidebar() {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setIsOpen(false); // Auto-close on navigation
  }, [pathname]);

  return (
    <Sidebar className="bg-background">
      <SidebarHeader className="flex px-4 py-2">
        <Link
          href="/"
          className="flex flex-row gap-2 p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <BarChart3 className="h-6 w-6" />
          <span className="text-lg font-bold">Stock Dashboard</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="flex flex-col gap-2">
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/"}>
              <Link href="/" className="p-5" onClick={() => setIsOpen(false)}>
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/tech-stocks"}>
              <Link
                href="/tech-stocks"
                className="p-5"
                onClick={() => setIsOpen(false)}
              >
                <Cpu className="h-5 w-5" />
                <span>Tech Stocks</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/cryptocurrency"}
            >
              <Link
                href="/cryptocurrency"
                className="p-5"
                onClick={() => setIsOpen(false)}
              >
                <Bitcoin className="h-5 w-5" />
                <span>Cryptocurrency</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/indices"}>
              <Link
                href="/indices"
                className="p-5"
                onClick={() => setIsOpen(false)}
              >
                <TrendingUp className="h-5 w-5" />
                <span>Indices</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/commodities"}>
              <Link
                href="/commodities"
                className="p-5"
                onClick={() => setIsOpen(false)}
              >
                <Gem className="h-5 w-5" />
                <span>Commodities</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/banking-finance"}
            >
              <Link
                href="/banking-finance"
                className="p-5"
                onClick={() => setIsOpen(false)}
              >
                <Building2 className="h-5 w-5" />
                <span>Banking & Finance</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
