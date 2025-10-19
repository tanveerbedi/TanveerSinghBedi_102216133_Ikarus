"use client"

import { useState, useMemo } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"

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

interface DataTableProps {
  data: Product[]
}

export default function DataTable({ data }: DataTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product
    direction: "asc" | "desc"
  } | null>(null)

  const itemsPerPage = 10

  const sortedData = useMemo(() => {
    const sorted = [...data]
    if (sortConfig) {
      sorted.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }
    return sorted
  }, [data, sortConfig])

  const displayData = useMemo(() => {
    return sortedData.slice(0, itemsPerPage)
  }, [sortedData])

  const handleSort = (key: keyof Product) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        }
      }
      return { key, direction: "asc" }
    })
  }

  const SortIcon = ({ column }: { column: keyof Product }) => {
    if (sortConfig?.key !== column) {
      return <div className="w-4 h-4" />
    }
    return sortConfig.direction === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />
  }

  const columns: (keyof Product)[] = ["uniq_id", "title", "brand", "price", "country_of_origin", "color", "material"]

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border border-border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-muted border-b border-border">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  onClick={() => handleSort(column)}
                  className="px-4 py-3 text-left font-semibold text-foreground cursor-pointer hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {column.replace(/_/g, " ").toUpperCase()}
                    <SortIcon column={column} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayData.map((product, idx) => (
              <tr
                key={product.uniq_id}
                className={`border-b border-border hover:bg-muted/50 transition-colors ${
                  idx % 2 === 0 ? "bg-background" : "bg-muted/20"
                }`}
              >
                {columns.map((column) => (
                  <td key={`${product.uniq_id}-${column}`} className="px-4 py-3 text-foreground">
                    <div className="max-w-xs truncate">
                      {column === "price"
                        ? `$${Number.parseFloat(product[column] as any).toFixed(2)}`
                        : String(product[column] || "-")}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing first {displayData.length} of {sortedData.length} products
      </p>
    </div>
  )
}
