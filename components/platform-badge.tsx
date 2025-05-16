"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Platform } from "@/types"
import { PlatformIcon } from "@/components/platform-icon"

interface PlatformBadgeProps {
  platform: Platform
  className?: string
}

export function PlatformBadge({ platform, className }: PlatformBadgeProps) {
  // Platform-specific styles
  const platformStyles = {
    youtube: "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900",
    reddit: "bg-orange-100 text-orange-600 hover:bg-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:hover:bg-orange-900",
    twitter: "bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
  }

  // Platform display names
  const platformNames = {
    youtube: "YouTube",
    reddit: "Reddit",
    twitter: "Twitter"
  }

  return (
    <Badge 
      variant="outline" 
      className={`flex items-center gap-1 font-normal ${platformStyles[platform]} ${className}`}
    >
      <PlatformIcon platform={platform} size={14} />
      {platformNames[platform]}
    </Badge>
  )
}