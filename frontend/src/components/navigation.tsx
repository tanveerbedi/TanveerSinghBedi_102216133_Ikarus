"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function Navigation() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isRecommendation = pathname === "/"
  const isAnalytics = pathname === "/analytics"

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-lg text-primary">
              FurniAI
            </Link>
            <div className="hidden md:flex gap-6">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors ${
                  isRecommendation ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Recommendations
              </Link>
              <Link
                href="/analytics"
                className={`text-sm font-medium transition-colors ${
                  isAnalytics ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Analytics
              </Link>
            </div>
          </div>
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
