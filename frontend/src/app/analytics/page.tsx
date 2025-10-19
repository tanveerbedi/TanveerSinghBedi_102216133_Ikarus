"use client"

import { useState, useEffect } from "react"
import Papa from "papaparse"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Github } from "lucide-react"
import DataTable from "@/components/data-table"

interface Product {
  title: string
  brand: string
  description: string
  price: number
  categories: string
  images: string
  manufacturer: string
  package_dimensions: string
  country_of_origin: string
  material: string
  color: string
  uniq_id: string
}

export default function AnalyticsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [countryData, setCountryData] = useState<any[]>([])
  const [brandData, setBrandData] = useState<any[]>([])
  const [colorData, setColorData] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalProducts: 0,
  })

  useEffect(() => {
    const loadCSV = async () => {
      try {
        const response = await fetch("/dataset_with_ids.csv")
        const csvText = await response.text()

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results: any) => {
            const data = results.data as Product[]
            setProducts(data)
            processData(data)
            setLoading(false)
          },
          error: (error: any) => {
            console.error("CSV parsing error:", error)
            setLoading(false)
          },
        })
      } catch (error) {
        console.error("Error loading CSV:", error)
        setLoading(false)
      }
    }

    loadCSV()
  }, [])

  const processData = (data: Product[]) => {
    setStats({
      totalProducts: data.length,
    })

    const countryMap: Record<string, number> = {}
    data.forEach((p) => {
      const country = p.country_of_origin || "Unknown"
      countryMap[country] = (countryMap[country] || 0) + 1
    })
    const countryArray = Object.entries(countryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    const top5Countries = countryArray.slice(0, 5)
    const othersCount = countryArray.slice(5).reduce((sum, item) => sum + item.value, 0)

    if (othersCount > 0) {
      top5Countries.push({ name: "Others", value: othersCount })
    }
    setCountryData(top5Countries)

    // Brand distribution
    const brandMap: Record<string, number> = {}
    data.forEach((p) => {
      const brand = p.brand || "Unknown"
      brandMap[brand] = (brandMap[brand] || 0) + 1
    })
    const brandArray = Object.entries(brandMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)
    setBrandData(brandArray)

    // Color distribution
    const colorMap: Record<string, number> = {}
    data.forEach((p) => {
      const color = p.color || "Unknown"
      colorMap[color] = (colorMap[color] || 0) + 1
    })
    const colorArray = Object.entries(colorMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)
    setColorData(colorArray)
  }

  const COLORS = [
    "#FF6B6B", // Bright Red
    "#4ECDC4", // Bright Teal
    "#FFE66D", // Bright Yellow
    "#95E1D3", // Bright Mint
    "#FF8B94", // Bright Pink
    "#A8E6CF", // Bright Green
    "#FFD3B6", // Bright Orange
    "#FFAAA5", // Bright Coral
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Product Analytics</h1>
              <p className="text-muted-foreground mt-2">Comprehensive analysis of product dataset</p>
            </div>
            <a
              href="https://github.com/Pranav07Duggal/Ikarus_3D/blob/main/notebooks/Ikarus_Data_Analysis.ipynb"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              <Github size={20} />
              <span>View Python Analytics</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.totalProducts.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Country Distribution */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Products by Country</CardTitle>
              <CardDescription>Top 5 countries of origin (Others grouped)</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  value: {
                    label: "Products",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={countryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="var(--color-chart-2)"
                      dataKey="value"
                    >
                      {countryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Brand Distribution */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Top Brands</CardTitle>
              <CardDescription>Product count by brand</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  value: {
                    label: "Products",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={brandData} layout="vertical" margin={{ top: 5, right: 30, left: 200, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis type="number" stroke="var(--color-muted-foreground)" />
                    <YAxis dataKey="name" type="category" width={190} stroke="var(--color-muted-foreground)" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="#4ECDC4" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Color Distribution */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Color Distribution</CardTitle>
              <CardDescription>Top product colors</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  value: {
                    label: "Products",
                    color: "hsl(var(--chart-4))",
                  },
                }}
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={colorData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="var(--color-chart-4)"
                      dataKey="value"
                    >
                      {colorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <CardTitle>Product Data</CardTitle>
            <CardDescription>First 10 products from dataset</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable data={products} />
          </CardContent>
        </Card>

        {/* GitHub Link Section */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github size={24} />
              Detailed Python Analytics
            </CardTitle>
            <CardDescription>
              For more in-depth analysis and statistical insights, check out the Jupyter notebook on GitHub
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href="https://github.com/Pranav07Duggal/Ikarus_3D/blob/main/notebooks/Ikarus_Data_Analysis.ipynb"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              <Github size={20} />
              View Jupyter Notebook on GitHub
            </a>
            <p className="text-sm text-muted-foreground mt-4">
              The notebook includes advanced statistical analysis, machine learning models, and detailed visualizations
              that go beyond this dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
