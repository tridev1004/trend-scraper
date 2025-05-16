"use client"

import React from "react"
import Link from "next/link"
import { LineChart, BarChart3, Home, Settings } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { ApiKeysDialog } from "@/components/api-keys-dialog"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex gap-2 items-center mr-4">
          <LineChart className="h-6 w-6" />
          <Link href="/" className="hidden md:block font-bold text-xl">
            TrendPulse
          </Link>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden md:inline-block">Home</span>
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden md:inline-block">Dashboard</span>
            </Button>
          </Link>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <ApiKeysDialog />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}