import { TrendItem, TrendSummary } from '@/types';

// Function to generate dummy summary for trends (in production, this would use OpenAI API)
export function generateTrendSummary(items: any[]): any {
  if (!items || items.length === 0) {
    return {
      keyTakeaways: ['No trends found to summarize.'],
      sentimentBreakdown: {
        positive: 0,
        negative: 0,
        neutral: 0,
      },
      topEngagement: {},
    };
  }
  
  // Count sentiment types
  const sentimentCounts = {
    positive: 0,
    negative: 0,
    neutral: 0,
  };
  

  
  // Find most engaged items
  let mostLiked: TrendItem | undefined;
  let mostCommented: TrendItem | undefined;
  let mostShared: TrendItem | undefined;
  
  items.forEach(item => {
    if (!mostLiked || (item.engagement?.likes && mostLiked.engagement?.likes && item.engagement.likes > mostLiked.engagement.likes)) {
      mostLiked = item;
    }
    
    if (!mostCommented || (item.engagement?.comments && mostCommented.engagement?.comments && item.engagement.comments > mostCommented.engagement.comments)) {
      mostCommented = item;
    }
    
    if (!mostShared || (item.engagement?.shares && mostShared.engagement?.shares && item.engagement.shares > mostShared.engagement.shares)) {
      mostShared = item;
    }
  });
  
  // Generate key takeaways (simplified for this example)
  const platforms = [...new Set(items.map(item => item.platform))as any ];
  const platformCounts: Record<string, number> = {};
  platforms.forEach(platform => {
    platformCounts[platform] = items.filter(item => item.platform === platform).length;
  });
  
  const dominantSentiment = Object.entries(sentimentCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  
  const keyTakeaways = [
    `Found ${items.length} discussions across ${platforms.length} platforms: ${platforms.join(', ')}.`,
    `Most content comes from ${Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0][0]}.`,
    `The overall sentiment is predominantly ${dominantSentiment}.`,
    mostLiked ? `Most liked content: "${mostLiked.title || mostLiked.content.substring(0, 50)}..."` : '',
    mostCommented ? `Most commented content: "${mostCommented.title || mostCommented.content.substring(0, 50)}..."` : '',
  ].filter(Boolean);
  
  return {
    keyTakeaways,
    sentimentBreakdown: sentimentCounts,
    topEngagement: {
      mostLiked,
      mostCommented,
      mostShared,
    },
  };
}