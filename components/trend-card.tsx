"use client"

import React from "react"
import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare, Heart, Share2, Eye } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { PlatformBadge } from "@/components/platform-badge"
import { SentimentBadge } from "@/components/sentiment-badge"
import { TrendItem, Platform } from "@/types"

interface TrendCardProps {
  trend: TrendItem
  index?: number
}

export function TrendCard({ trend, index = 0 }: TrendCardProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown date";
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Unknown date";
    }
  };

  const formatNumber = (num: number | undefined) => {
    if (num === undefined) return "";
    if (num < 1000) return num;
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
    return `${(num / 1000000).toFixed(1)}M`;
  };

  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        <div className="p-4">
          <div className="flex items-start gap-4">
            {/* Platform and Author */}
            <div className="flex-shrink-0">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" alt={trend.author} />
                <AvatarFallback>{getInitials(trend.author)}</AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-2 mb-1">
                <PlatformBadge platform={trend.platform} />
                {trend.sentiment && <SentimentBadge sentiment={trend.sentiment} />}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <span className="font-medium truncate">{trend.author}</span>
                <span className="text-xs">•</span>
                <span className="text-xs">{formatDate(trend.date)}</span>
              </div>
              
              {/* Content */}
              <div className="mb-3">
                {trend.title && (
                  <h3 className="text-lg font-semibold leading-tight mb-1">{trend.title}</h3>
                )}
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {trend.content || "No content available"}
                </p>
              </div>
              
              {/* Engagement Metrics */}
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                {trend.engagement?.likes !== undefined && (
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{formatNumber(trend.engagement.likes)}</span>
                  </div>
                )}
                {trend.engagement?.comments !== undefined && (
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{formatNumber(trend.engagement.comments)}</span>
                  </div>
                )}
                {trend.engagement?.shares !== undefined && (
                  <div className="flex items-center gap-1">
                    <Share2 className="h-4 w-4" />
                    <span>{formatNumber(trend.engagement.shares)}</span>
                  </div>
                )}
                {trend.engagement?.views !== undefined && (
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{formatNumber(trend.engagement.views)}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Thumbnail for YouTube */}
            {trend.platform === "youtube" && trend.thumbnailUrl && (
              <div className="hidden sm:block w-24 h-16 flex-shrink-0">
                <img 
                  src={trend.thumbnailUrl} 
                  alt={trend.title || "Video thumbnail"} 
                  className="w-full h-full object-cover rounded"
                />
              </div>
            )}
          </div>
        </div>
        
        {trend.url && (
          <a 
            href={trend.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block text-center py-2 border-t text-sm font-medium text-primary hover:bg-secondary transition-colors"
          >
            View Original
          </a>
        )}
      </Card>
    </motion.div>
  )
}