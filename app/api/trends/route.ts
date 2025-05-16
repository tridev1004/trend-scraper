
import { NextRequest, NextResponse } from 'next/server';
import { scrapeTrends } from '@/lib/puppeteer';
import { applySentimentAnalysis } from '@/lib/sentiment';
import { generateTrendSummary } from '@/lib/summary';
import { getCachedData, setCachedData } from '@/lib/redis';
import { SearchQuery, AggregatedTrends, TrendItem, Platform } from '@/types';
import { cacheTTL } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    const { query, platforms, limit = 10, sentiment = 'all', sortBy = 'relevance' }: SearchQuery = await request.json();
    
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }
    
    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json({ error: 'At least one platform must be selected' }, { status: 400 });
    }
    
    // Generate cache key
    const cacheKey = `trends:${query}:${platforms.join(',')}:${limit}:${sentiment}:${sortBy}`;
    
    // Try to get from cache first
    const cachedResult = await getCachedData(cacheKey);
    if (cachedResult) {
      return NextResponse.json(cachedResult);
    }
    
    // Scrape trends from selected platforms
    const allTrends = await scrapeTrends(query, platforms as Platform[], limit);
    
    // Apply sentiment analysis
    const trendsWithSentiment = applySentimentAnalysis(allTrends);
    
    // Filter by sentiment if needed
    const filteredTrends = sentiment === 'all' 
      ? trendsWithSentiment 
      : trendsWithSentiment.filter(item => item.sentiment === sentiment);
    
    // Sort results based on sortBy parameter
    let sortedTrends = [...filteredTrends];
    
    if (sortBy === 'date') {
      sortedTrends.sort((a, b) => {
        // Handle missing dates by putting them at the end
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    } else if (sortBy === 'engagement') {
      sortedTrends.sort((a, b) => {
        const aEngagement = (a.engagement?.likes || 0) + (a.engagement?.comments || 0) + (a.engagement?.shares || 0);
        const bEngagement = (b.engagement?.likes || 0) + (b.engagement?.comments || 0) + (b.engagement?.shares || 0);
        return bEngagement - aEngagement;
      });
    }
    
    // Group by platform
    const platformResults: Record<Platform, TrendItem[]> = {
      youtube: [],
      reddit: [],
      twitter: [],
    };
    
    sortedTrends.forEach(item => {
      if (platformResults[item.platform as Platform]) {
        platformResults[item.platform as Platform].push(item);
      }
    });
    
    // Generate summary
    const summary = generateTrendSummary(sortedTrends);
    
    // Create final response
    const response: AggregatedTrends = {
      query,
      timestamp: new Date().toISOString(),
      items: sortedTrends,
      summary,
      platforms: platformResults,
    };
    

    console.log(response)
    // Cache the result
    await setCachedData(cacheKey, response, cacheTTL.search);
    
    return NextResponse.json(response);
  } catch (error) {

    console.error('Error processing trend request:', error);
    return NextResponse.json({ error: 'Failed to fetch trends' }, { status: 500 });
  }
}