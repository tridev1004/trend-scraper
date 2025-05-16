export interface ApiKeyConfig {
  youtube?: string;
  reddit?: {
    clientId: string;
    clientSecret: string;
  };
  twitter?: {
    apiKey: string;
    apiKeySecret: string;
    bearerToken: string;
  };
}

export interface SearchQuery {
  query: string;
  platforms: Platform[];
  limit?: number;
  sentiment?: Sentiment;
  sortBy?: SortOption;
}

export type Platform = 'youtube' | 'reddit' | 'twitter';
export type Sentiment = 'positive' | 'negative' | 'neutral' | 'all';
export type SortOption = 'relevance' | 'date' | 'engagement';

export interface TrendItem {
  id: string;
  platform: Platform;
  title: string;
  content: string;
  url: string;
  author: string;
  date: string;
  engagement: {
    likes?: number;
    comments?: number;
    shares?: number;
    views?: number;
  };
  sentiment?: Sentiment;
  thumbnailUrl?: string;
}

export interface TrendSummary {
  keyTakeaways: string[];
  sentimentBreakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
  topEngagement: {
    mostLiked?: TrendItem;
    mostCommented?: TrendItem;
    mostShared?: TrendItem;
  };
}

export interface AggregatedTrends {
  query: string;
  timestamp: string;
  items: TrendItem[];
  summary?: TrendSummary;
  platforms: {
    youtube: TrendItem[];
    reddit: TrendItem[];
    twitter: TrendItem[];
  };
}