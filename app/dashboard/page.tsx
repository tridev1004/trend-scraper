"use client"

import React, { useState } from "react"
import { Loader2 } from "lucide-react"
import { SearchForm } from "@/components/search-form"
import { TrendGrid } from "@/components/trend-grid"
import { SummarySection } from "@/components/summary-section"
import { Platform, Sentiment, SortOption, AggregatedTrends, TrendItem } from "@/types"
import { toast } from "sonner"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<AggregatedTrends | null>(null)
  
  const handleSearch = async (query: string, platforms: Platform[], sentiment: Sentiment, sortBy: SortOption) => {
    try {
      setIsLoading(true)
      
      const response = await fetch("/api/trends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          platforms,
          sentiment,
          sortBy,
        }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to fetch trends")
      }
      
      const data = await response.json()
      setSearchResults(data)
    } catch (error) {
      console.error("Error searching trends:", error)
      toast.error("Failed to fetch trends. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  
  // Prepare data for the trend grid component
  const prepareGridData = () => {
    if (!searchResults) {
      return {
        all: [],
        youtube: [],
        reddit: [],
        twitter: [],
      }
    }
    
    return {
      all: searchResults.items,
      youtube: searchResults.platforms.youtube,
      reddit: searchResults.platforms.reddit,
      twitter: searchResults.platforms.twitter,
    }
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold mb-2">Trend Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          Search for any topic to discover what people are saying across social platforms.
        </p>
        
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Analyzing trends...</span>
        </div>
      ) : searchResults ? (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <TrendGrid trends={prepareGridData()} />
          </div>
          <div className="md:col-span-1">
            <SummarySection summary={searchResults.summary!} />
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            Enter a search query above to see trending discussions.
          </p>
        </div>
      )}
      <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 text-sm p-3 rounded-md shadow-md max-w-xs z-50">
  <strong>Note:</strong> Reddit API is paid, and Twitter may block searches due to aggressive bot protection.
</div>

    </div>
  )
}