import { ApiKeyConfig } from '@/types';

// Default API configuration - to be overridden by user-provided keys
export const defaultApiConfig: ApiKeyConfig = {
  youtube: process.env.YOUTUBE_API_KEY,
  reddit: {
    clientId: process.env.REDDIT_CLIENT_ID || '',
    clientSecret: process.env.REDDIT_CLIENT_SECRET || '',
  },
  twitter: {
    apiKey: process.env.TWITTER_API_KEY || '',
    apiKeySecret: process.env.TWITTER_API_SECRET || '',
    bearerToken: process.env.TWITTER_BEARER_TOKEN || '',
  },
};

// User can override these keys through the UI
let userApiConfig: ApiKeyConfig = {};

// Get the current API configuration (merges default with user-provided)
export function getApiConfig(): ApiKeyConfig {
  return {
    youtube: userApiConfig.youtube || defaultApiConfig.youtube,
    reddit: {
      clientId: userApiConfig.reddit?.clientId || defaultApiConfig.reddit?.clientId || '',
      clientSecret: userApiConfig.reddit?.clientSecret || defaultApiConfig.reddit?.clientSecret || '',
    },
    twitter: {
      apiKey: userApiConfig.twitter?.apiKey || defaultApiConfig.twitter?.apiKey || '',
      apiKeySecret: userApiConfig.twitter?.apiKeySecret || defaultApiConfig.twitter?.apiKeySecret || '',
      bearerToken: userApiConfig.twitter?.bearerToken || defaultApiConfig.twitter?.bearerToken || '',
    },
  };
}

// Update API configuration with user-provided keys
export function updateApiConfig(newConfig: Partial<ApiKeyConfig>): void {
  userApiConfig = {
    ...userApiConfig,
    ...newConfig,
    // Handle nested objects properly
    reddit: {
      ...userApiConfig.reddit,
      ...newConfig.reddit,
    },
    twitter: {
      ...userApiConfig.twitter,
      ...newConfig.twitter,
    },
  };
}

// Platform-specific colors for UI
export const platformColors = {
  youtube: '#FF0000',
  reddit: '#FF4500',
  twitter: '#1DA1F2',
};

// Cache TTL (time to live) settings in seconds
export const cacheTTL = {
  search: 3600, // Cache search results for 1 hour
  trends: 1800, // Cache trending topics for 30 minutes
  summary: 86400, // Cache AI summaries for 24 hours
};