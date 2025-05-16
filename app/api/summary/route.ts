import { NextRequest, NextResponse } from 'next/server';
import { getCachedData, setCachedData } from '@/lib/redis';
import { generateTrendSummary } from '@/lib/summary';
import { TrendItem } from '@/types';
import { cacheTTL } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    const { items }: { items: TrendItem[] } = await request.json();
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Items array is required' }, { status: 400 });
    }
    
    // Generate cache key based on item IDs
    const itemIds = items.map(item => item.id).sort().join(',');
    const cacheKey = `summary:${itemIds}`;
    
    // Try to get from cache first
    const cachedSummary = await getCachedData(cacheKey);
    if (cachedSummary) {
      return NextResponse.json(cachedSummary);
    }
    
    // Generate summary
    const summary = generateTrendSummary(items);
    
    // Cache the summary
    await setCachedData(cacheKey, summary, cacheTTL.summary);
    
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}