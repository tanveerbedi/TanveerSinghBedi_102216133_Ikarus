"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

interface ChatMessageProps {
  message: {
    role: "user" | "assistant"
    content: string
  }
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [displayedContent, setDisplayedContent] = useState("")
  const isUser = message.role === "user"

  useEffect(() => {
    if (isUser) {
      setDisplayedContent(message.content)
      return
    }

    // Typewriter effect for assistant messages
    let index = 0
    const interval = setInterval(() => {
      if (index < message.content.length) {
        setDisplayedContent(message.content.slice(0, index + 1))
        index++
      } else {
        clearInterval(interval)
      }
    }, 20)

    return () => clearInterval(interval)
  }, [message.content, isUser])

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <Card
        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 ${
          isUser
            ? "bg-primary text-primary-foreground rounded-3xl rounded-tr-sm"
            : "bg-card border-primary/20 rounded-3xl rounded-tl-sm"
        }`}
      >
        <p className="text-sm md:text-base leading-relaxed text-pretty">
          {displayedContent}
          {!isUser && displayedContent.length < message.content.length && <span className="animate-pulse">▌</span>}
        </p>
      </Card>
    </div>
  )
}
