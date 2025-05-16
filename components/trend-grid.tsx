"use client"

import React from "react"
import { TrendItem, Platform } from "@/types"
import { TrendCard } from "@/components/trend-card"
import { PlatformIcon } from "@/components/platform-icon"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface TrendGridProps {
  trends: {
    all: TrendItem[];
    youtube: TrendItem[];
    reddit: TrendItem[];
    twitter: TrendItem[];
  };
}

export function TrendGrid({ trends }: TrendGridProps) {
  const getPlatformCount = (platform: Platform) => {
    return trends[platform]?.length || 0;
  };

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="w-full justify-start mb-6">
        <TabsTrigger value="all" className="flex items-center gap-2">
          All
          <Badge variant="secondary" className="ml-1">
            {trends.all.length}
          </Badge>
        </TabsTrigger>
        
        <TabsTrigger value="youtube" className="flex items-center gap-2">
          <PlatformIcon platform="youtube" size={16} />
          YouTube
          <Badge variant="secondary" className="ml-1">
            {getPlatformCount("youtube")}
          </Badge>
        </TabsTrigger>
        
        <TabsTrigger value="reddit" className="flex items-center gap-2">
          <PlatformIcon platform="reddit" size={16} />
          Reddit
          <Badge variant="secondary" className="ml-1">
            {getPlatformCount("reddit")}
          </Badge>
        </TabsTrigger>
        
        <TabsTrigger value="twitter" className="flex items-center gap-2">
          <PlatformIcon platform="twitter" size={16} />
          Twitter
          <Badge variant="secondary" className="ml-1">
            {getPlatformCount("twitter")}
          </Badge>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-0">
        <div className="grid grid-cols-1 gap-4">
          {trends.all.length > 0 ? (
            trends.all.map((trend, index) => (
              <TrendCard key={trend.id} trend={trend} index={index} />
            ))
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No trends found. Try adjusting your search query.
            </div>
          )}
        </div>
      </TabsContent>
      
      {(["youtube", "reddit", "twitter"] as Platform[]).map((platform) => (
        <TabsContent key={platform} value={platform} className="mt-0">
          <div className="grid grid-cols-1 gap-4">
            {trends[platform].length > 0 ? (
              trends[platform].map((trend, index) => (
                <TrendCard key={trend.id} trend={trend} index={index} />
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                No {platform} trends found. Try adjusting your search query.
              </div>
            )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}