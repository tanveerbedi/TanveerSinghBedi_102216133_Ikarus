"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Send, Loader2 } from "lucide-react"
import { ChatMessage } from "@/components/chat-message"
import { LoadingSkeleton } from "@/components/loading-skeletons"
import { ProductCard } from "@/components/product-card"
import { LandingHero } from "@/components/landing-hero"
import Papa from "papaparse"
import Fuse from "fuse.js"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  products?: Product[]
  isLoading?: boolean
}

interface Product {
  id: string
  name: string
  description: string
  price: string
  category: string
  style: string
  image?: string
  color?: string
  material?: string
  brand?: string
  
}

export default function RecommendationPage() {
  const [hasStartedChat, setHasStartedChat] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Welcome to FurnAIture! I'm your personal furniture recommendation assistant. Tell me about your space, style preferences, and budget, and I'll suggest the perfect furniture pieces for you.",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 🧩 Load CSV once
  useEffect(() => {
    fetch("/dataset_with_ids.csv")
      .then((res) => res.text())
      .then((csvText) => {
        const parsed = Papa.parse(csvText, { header: true })
        const data: Product[] = parsed.data.map((item: any, index: number) => ({
          id: item.uniq_id || index.toString(),
          name: item.title || "Unknown",
          description: item.description || "",
          price: item.price || "0",
          category: item.categories || "Unknown",
          style: item.style || "Unknown",   // <-- ensure style exists
          image: parseImage(item.images) || "background7.jpg",  // <-- ensure image exists
        }))

        setAllProducts(data)
      })
  }, [])

  const parseImage = (imgField: string) => {
    try {
      const arr = JSON.parse(imgField.replace(/'/g, '"'))
      return arr[0]?.trim() || ""
    } catch {
      return ""
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      const newHeight = Math.min(textareaRef.current.scrollHeight, 100)
      textareaRef.current.style.height = `${newHeight}px`
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    if (!hasStartedChat) {
      setHasStartedChat(true)
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    setTimeout(() => {
      const fuse = new Fuse(allProducts, {
        keys: ["name", "description", "category", "color", "material", "brand"],
        threshold: 0.4,
      })
      const res = fuse.search(input)
      const topResults = res.slice(0, 6).map((r) => r.item)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          topResults.length > 0
            ? "Based on your preferences, here are some items that might suit your taste and style:"
            : "I couldn’t find an exact match, but try describing your preferences differently (e.g., 'modern black chair', 'doormat','tv tray', 'folding computer table').",
        products: topResults,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1200)
  }

  if (!hasStartedChat) {
    return <LandingHero onStartChat={() => setHasStartedChat(true)} />
  }

  return (
    <main className="h-full bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 py-8">
        <div className="flex flex-col h-[calc(100vh-130px)] gap-6 items-center w-auto">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((message) => (
              <div key={message.id} className="animate-fade-in-up">
                <ChatMessage message={message} />
                {message.products && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {message.products.map((product) => (
                      <ProductCard key={product.id} product={product as any} />
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && <LoadingSkeleton />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Card */}
          <Card className="p-2 rounded-3xl border-primary/20 bg-card/50 backdrop-blur max-w-5xl min-w-xl ">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaChange}
                placeholder="Tell me what you're looking for ..."
                disabled={isLoading}
                rows={3}
                className="flex-1 bg-background/50 rounded-2xl px-2 py-4 border border-primary/30 focus:border-primary focus:outline-none transition-colors resize-none max-h-[200px] font-medium text-foreground placeholder:text-muted-foreground"
              />

              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="gap-2 rounded-full px-6 py-3 hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </main>
  )
}
