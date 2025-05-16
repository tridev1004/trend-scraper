"use client"

import React from "react"
import { YoutubeIcon, MessageSquareIcon, TwitterIcon } from "lucide-react"
import { Platform } from "@/types"
import { cn } from "@/lib/utils"

interface PlatformIconProps {
  platform: Platform
  size?: number
  className?: string
}

export function PlatformIcon({ platform, size = 24, className }: PlatformIconProps) {
  const platformColors = {
    youtube: "text-red-600",
    reddit: "text-orange-500",
    twitter: "text-blue-400"
  }

  switch (platform) {
    case "youtube":
      return <YoutubeIcon size={size} className={cn(platformColors.youtube, className)} />
    case "reddit":
      return <MessageSquareIcon size={size} className={cn(platformColors.reddit, className)} />
    case "twitter":
      return <TwitterIcon size={size} className={cn(platformColors.twitter, className)} />
    default:
      return null
  }
}