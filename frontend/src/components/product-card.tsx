"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart } from "lucide-react"
import { useState } from "react"

interface Product {
  id: string
  name: string
  description: string
  price: string
  category: string
  style: string
  image: string
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border-primary/10 bg-card/50 backdrop-blur hover:border-primary/30 p-0">
  {/* Image Section - Flush to Top */}
  <div className="relative h-48 bg-muted overflow-hidden group">
    <img
      src={product.image || "/placeholder.svg"}
      alt={product.name}
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
    />
    
    <div className="absolute top-2 right-2 flex gap-2">
      <Button
        size="icon"
        variant="secondary"
        className="rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => setIsFavorited(!isFavorited)}
      >
        <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
      </Button>
    </div>
  </div>

  {/* Content Section */}
  <div className="p-4 flex-1 flex flex-col gap-3">
    <div>
      {/* Title and Vendor */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="font-semibold text-sm md:text-base text-foreground line-clamp-2">
          {product.name}
        </h3>
      </div>

      {/* Vendor */}
      <span className="text-xs text-muted-foreground mb-2 block">Sold by: <span className="font-medium text-foreground">{ "Amazon"}</span></span>

      {/* Tags */}
      <div className="flex gap-2 mb-2">
        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{product.category}</span>
        <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">{product.style}</span>
      </div>
    </div>

    {/* Description — larger height */}
    <p className="text-sm text-muted-foreground line-clamp-5 flex-1">
      {product.description}
    </p>

    {/* Price */}
    <div className="flex items-center justify-between pt-2 border-t border-border">
      <span className="font-bold text-lg text-primary">
        {product.price.toLocaleString()}
      </span>
    </div>
  </div>
</Card>

  )
}
