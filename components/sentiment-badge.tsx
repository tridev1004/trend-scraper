"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, ThumbsDown, Minus } from "lucide-react"
import { Sentiment } from "@/types"

interface SentimentBadgeProps {
  sentiment: Sentiment
  className?: string
}

export function SentimentBadge({ sentiment, className }: SentimentBadgeProps) {
  // Sentiment-specific styles
  const sentimentStyles = {
    positive: "bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-950 dark:text-green-300 dark:hover:bg-green-900",
    negative: "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900",
    neutral: "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
    all: "bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
  }

  const SentimentIcon = () => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp size={14} />;
      case 'negative':
        return <ThumbsDown size={14} />;
      case 'neutral':
        return <Minus size={14} />;
      default:
        return null;
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={`flex items-center gap-1 font-normal ${sentimentStyles[sentiment]} ${className}`}
    >
      <SentimentIcon />
      {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
    </Badge>
  )
}