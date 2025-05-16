"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Wand2 } from "lucide-react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { toast } from "sonner"
import { PlatformIcon } from "@/components/platform-icon"
import { Platform, Sentiment, SortOption } from "@/types"

interface SearchFormProps {
  onSearch: (query: string, platforms: Platform[], sentiment: Sentiment, sortBy: SortOption) => Promise<void>
  isLoading?: boolean
}

export function SearchForm({ onSearch, isLoading = false }: SearchFormProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [platforms, setPlatforms] = useState<Platform[]>(["youtube", "reddit", "twitter"])
  const [sentiment, setSentiment] = useState<Sentiment>("all")
  const [sortBy, setSortBy] = useState<SortOption>("relevance")
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!query.trim()) {
      toast.error("Please enter a search query")
      return
    }
    
    if (platforms.length === 0) {
      toast.error("Please select at least one platform")
      return
    }
    
    await onSearch(query, platforms, sentiment, sortBy)
  }

  const handlePlatformToggle = (value: string[]) => {
    if (value.length === 0) {
      toast.warning("At least one platform must be selected")
      return
    }
    setPlatforms(value as Platform[])
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search for any topic or product..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-10 h-12"
            />
            <Search className="absolute right-3 top-3 h-5 w-5 text-muted-foreground pointer-events-none" />
          </div>
          <Button type="submit" className="h-12 px-6" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Wand2 className="h-4 w-4 animate-pulse" />
                Analyzing...
              </span>
            ) : (
              "Analyze Trends"
            )}
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
          <div className="flex-1 w-full sm:w-auto">
            <Label htmlFor="platforms" className="text-sm font-medium mb-1.5 block">
              Platforms
            </Label>
            <ToggleGroup
              type="multiple"
              value={platforms}
              onValueChange={handlePlatformToggle}
              className="flex justify-start gap-1"
            >
              <ToggleGroupItem value="youtube" aria-label="YouTube" className="flex items-center gap-1">
                <PlatformIcon platform="youtube" size={16} />
                <span className="hidden sm:inline">YouTube</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="reddit" aria-label="Reddit" className="flex items-center gap-1">
                <PlatformIcon platform="reddit" size={16} />
                <span className="hidden sm:inline">Reddit</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="twitter" aria-label="Twitter" className="flex items-center gap-1">
                <PlatformIcon platform="twitter" size={16} />
                <span className="hidden sm:inline">Twitter</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="flex-1 w-full sm:w-auto">
            <Label htmlFor="sentiment" className="text-sm font-medium mb-1.5 block">
              Sentiment
            </Label>
            <Select defaultValue={sentiment} onValueChange={(value) => setSentiment(value as Sentiment)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by sentiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sentiments</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 w-full sm:w-auto">
            <Label htmlFor="sortBy" className="text-sm font-medium mb-1.5 block">
              Sort By
            </Label>
            <Select defaultValue={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort results" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="engagement">Engagement</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </form>
    </motion.div>
  )
}