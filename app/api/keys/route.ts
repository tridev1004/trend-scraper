import { NextRequest, NextResponse } from 'next/server';
import { getApiConfig, updateApiConfig } from '@/lib/config';
import { ApiKeyConfig } from '@/types';

// Get current API keys configuration
export async function GET() {
  try {
    const config = getApiConfig();
    
    // Mask sensitive data for security
    const maskedConfig = {
      youtube: config.youtube ? process.env.YOUTUBE_API_KEY : undefined,
      reddit: config.reddit ? {
        clientId: config.reddit.clientId ? '********' : undefined,
        clientSecret: config.reddit.clientSecret ? '********' : undefined,
      } : undefined,
      twitter: config.twitter ? {
        apiKey: config.twitter.apiKey ? process.env.TWITTER_API_KEY : undefined,
        apiKeySecret: config.twitter.apiKeySecret ? process.env.TWITTER_API_SECRET : undefined,
        bearerToken: config.twitter.bearerToken ? '' : undefined,
      } : undefined,
    };
    
    return NextResponse.json({ 
      config: maskedConfig,
      keysConfigured: {
        youtube: !!config.youtube,
        reddit: !!(config.reddit?.clientId && config.reddit?.clientSecret),
        twitter: !!(config.twitter?.bearerToken || (config.twitter?.apiKey && config.twitter?.apiKeySecret)),
      }
    });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json({ error: 'Failed to fetch API keys configuration' }, { status: 500 });
  }
}

// Update API keys
export async function POST(request: NextRequest) {
  try {
    const body: Partial<ApiKeyConfig> = await request.json();
    
    // Validate the request body
    if (!body) {
      return NextResponse.json({ error: 'Request body is required' }, { status: 400 });
    }
    
    // Update the API configuration
    updateApiConfig(body);
    
    return NextResponse.json({ success: true, message: 'API keys updated successfully' });
  } catch (error) {
    console.error('Error updating API keys:', error);
    return NextResponse.json({ error: 'Failed to update API keys' }, { status: 500 });
  }
}