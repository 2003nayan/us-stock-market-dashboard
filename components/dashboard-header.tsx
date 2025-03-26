"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function DashboardHeader() {
  const pathname = usePathname();
  const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0 });
  const navRef = useRef<HTMLDivElement>(null);

  const links = [
    { href: "/", label: "Dashboard" },
    { href: "/tech-stocks", label: "Tech" },
    { href: "/cryptocurrency", label: "Cryptocurrency" },
    { href: "/indices", label: "Indices" },
    { href: "/commodities", label: "Commodities" },
    { href: "/banking-finance", label: "Finance" },
  ];

  useEffect(() => {
    const activeLink = document.querySelector(".active-link");
    if (activeLink && navRef.current) {
      const { width, left } = activeLink.getBoundingClientRect();
      const navLeft = navRef.current.getBoundingClientRect().left;

      setUnderlineStyle({
        width: width,
        left: left - navLeft,
      });
    }
  }, [pathname]);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex flex-1 items-center justify-between">
        {/* Navbar */}
        <nav ref={navRef} className="relative flex gap-10 ml-3">
          {/* Moving Underline */}
          <div
            className="absolute bottom-[-4px] h-[2px] bg-white transition-all duration-300"
            style={{
              width: `${underlineStyle.width}px`,
              transform: `translateX(${underlineStyle.left}px)`,
            }}
          />

          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`relative text-xl font-semibold ${
                pathname === href ? "text-white active-link" : "text-gray-400"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
