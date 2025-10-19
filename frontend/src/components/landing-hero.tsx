"use client"

import { useState, useEffect } from "react"
import { ChevronRight } from "lucide-react"

const FURNITURE_MESSAGES = [
  {
    title: "Find your perfect sofa",
    description: "Describe your living room and get personalized sofa recommendations",
  },
  {
    title: "Design your workspace",
    description: "Create an inspiring home office with AI-curated furniture suggestions",
  },
  {
    title: "Transform your bedroom",
    description: "Discover bedroom furniture that matches your style and comfort needs",
  },
  {
    title: "Organize your space",
    description: "Get smart storage solutions tailored to your room dimensions",
  },
  {
    title: "Mix and match styles",
    description: "Blend different furniture styles to create your unique aesthetic",
  },
]

const BACKGROUND_IMAGES = [
  "url('/background1.jpg')",
  "url('/background4.jpg')",
  "url('/background5.jpg')",
  "url('/background6.jpg')",
  "url('/background7.jpg')",
  
]

interface LandingHeroProps {
  onStartChat: () => void
}

export function LandingHero({ onStartChat }: LandingHeroProps) {
  const [currentBgIndex, setCurrentBgIndex] = useState(0)
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

  useEffect(() => {
    const bgInterval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length)
    }, 3500)
    return () => clearInterval(bgInterval)
  }, [])

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % FURNITURE_MESSAGES.length)
    }, 3500)
    return () => clearInterval(msgInterval)
  }, [])

  const currentMessage = FURNITURE_MESSAGES[currentMessageIndex]

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: BACKGROUND_IMAGES[currentBgIndex],
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(2px)",
          opacity: 0.6,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/70 to-primary/10" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8 animate-fade-in-up">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground text-balance">
              Your AI Furniture{" "}
              <span className="bg-gradient-to-r  from-primary via-pink-500 to-red-600 bg-clip-text text-transparent">Stylist</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground text-balance">
              Discover furniture that perfectly matches your space and style
            </p>
          </div>

          <div className="min-h-[120px] flex flex-col items-center justify-center">
            <div className="space-y-3 animate-fade-in-up">
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground transition-all duration-500">
                {currentMessage.title}
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground transition-all duration-500">
                {currentMessage.description}
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={onStartChat}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary  to-red-900 text-primary-foreground rounded-full font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Start Exploring
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="flex justify-center gap-2 pt-4">
            {BACKGROUND_IMAGES.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentBgIndex ? "w-8 bg-primary" : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
