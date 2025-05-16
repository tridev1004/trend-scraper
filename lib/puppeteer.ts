import puppeteer, { Browser, Page } from 'puppeteer';
import { Platform, TrendItem } from '@/types';
import { getApiConfig } from './config';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';


let browser: Browser | null = null;

// Initialize puppeteer browser
async function getBrowser(): Promise<Browser> {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: 'new', 
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }as any);
  }
  return browser;
}

// Close browser - call this when shutting down
export async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
  }
}

// Scrape YouTube trends for a query
export async function scrapeYouTube(query: string, limit = 10): Promise<TrendItem[]> {
  const browser = await getBrowser();
  const page = await browser.newPage();
  
  try {
    // Navigate to YouTube search results
    await page.goto(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`);
    await page.waitForSelector('#contents');
    
    // Extract video information
    const videos = await page.evaluate((limit) => {
      const items: any[] = [];
      const videoElements = document.querySelectorAll('ytd-video-renderer, ytd-compact-video-renderer');
      
      for (let i = 0; i < Math.min(videoElements.length, limit); i++) {
        const video = videoElements[i];
        
        // Extract basic video info
        const titleElement = video.querySelector('#video-title, #title');
        const channelElement = video.querySelector('#channel-name, #byline');
        const thumbnailElement = video.querySelector('#thumbnail img');
        const metadataElement = video.querySelector('#metadata-line');
        
        if (titleElement && channelElement) {
          const href = titleElement.getAttribute('href') || '';
          const videoId = href.split('v=')[1]?.split('&')[0];
          
          items.push({
            id: videoId || `yt-${Date.now()}-${i}`,
            platform: 'youtube',
            title: titleElement.textContent?.trim() || '',
            content: '',  // YouTube doesn't show content in search results
            url: videoId ? `https://www.youtube.com/watch?v=${videoId}` : '',
            author: channelElement.textContent?.trim() || '',
            date: '',  // Need to visit each video to get date
            thumbnailUrl: thumbnailElement || '',
            engagement: {
              views: metadataElement?.textContent?.match(/(\d+[KMB]?) views/)?.[1] || 0,
              likes: 0,  // Need to visit each video to get likes
              comments: 0,
            },
          });
        }
      }
      
      return items;
    }, limit);
    
    return videos as TrendItem[];
  } catch (error) {
    console.error('Error scraping YouTube:', error);
    return [];
  } finally {
    await page.close();
  }
}

// Scrape Reddit trends for a query
export async function scrapeReddit(query: string, limit = 10): Promise<TrendItem[]> {
  const browser = await getBrowser();
  const page = await browser.newPage();
  
  try {
    // Navigate to Reddit search results
    await page.goto(`https://www.reddit.com/search/?q=${encodeURIComponent(query)}`);
    await page.waitForSelector('div[data-testid="post-container"]', { timeout: 5000 });
    
    // Extract post information
    const posts = await page.evaluate((limit) => {
      const items: any[] = [];
      const postElements = document.querySelectorAll('div[data-testid="post-container"]');
      
      for (let i = 0; i < Math.min(postElements.length, limit); i++) {
        const post = postElements[i];
        
        // Extract basic post info
        const titleElement = post.querySelector('h3');
        const authorElement = post.querySelector('a[data-testid="post_author"]');
        const contentElement = post.querySelector('div[data-testid="post-content"]');
        const upvoteElement = post.querySelector('button[aria-label*="upvote"]');
        const commentElement = post.querySelector('a[data-click-id="comments"]');
        const permalinkElement = post.querySelector('a[data-click-id="body"]');
        
        if (titleElement && permalinkElement) {
          const permalink = permalinkElement.getAttribute('href') || '';
          const id = permalink.split('/').filter(Boolean).pop() || `rd-${Date.now()}-${i}`;
          
          items.push({
            id,
            platform: 'reddit',
            title: titleElement.textContent?.trim() || '',
            content: contentElement?.textContent?.trim() || '',
            url: permalink.startsWith('http') ? permalink : `https://www.reddit.com${permalink}`,
            author: authorElement?.textContent?.trim() || '',
            date: '',  // Reddit doesn't directly show dates in search
            engagement: {
              likes: parseInt(upvoteElement?.textContent?.trim() || '0', 10) || 0,
              comments: parseInt(commentElement?.textContent?.trim().split(' ')[0] || '0', 10) || 0,
            },
          });
        }
      }
      
      return items;
    }, limit);
    
    return posts as TrendItem[];
  } catch (error) {
    console.error('Error scraping Reddit:', error);
    return [];
  } finally {
    await page.close();
  }
}

// Scrape Twitter/X trends for a query
export async function scrapeTwitter(query: string, limit = 10): Promise<TrendItem[]> {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.goto(`https://twitter.com/search?q=${encodeURIComponent(query)}&src=typed_query&f=top`, {
      waitUntil: 'networkidle2',
      timeout: 6000,
    });

    await page.waitForSelector('article[data-testid="tweet"]', { timeout: 10000 });

    const tweets = await page.evaluate((limit) => {
      const items: any[] = [];
      const tweetElements = document.querySelectorAll('article[data-testid="tweet"]');

      for (let i = 0; i < Math.min(tweetElements.length, limit); i++) {
        const tweet = tweetElements[i];
        const contentElement = tweet.querySelector('div[data-testid="tweetText"]');
        const authorElement = tweet.querySelector('div[data-testid="User-Name"] a');
        const timeElement = tweet.querySelector('time');
        const likeElement = tweet.querySelector('div[data-testid="like"]');
        const retweetElement = tweet.querySelector('div[data-testid="retweet"]');
        const replyElement = tweet.querySelector('div[data-testid="reply"]');

        if (contentElement && authorElement) {
          const tweetUrl = authorElement.getAttribute('href')?.split('/status/')[0] || '';
          const tweetId = `tw-${Date.now()}-${i}`;

          items.push({
            id: tweetId,
            platform: 'twitter',
            title: '',
            content: contentElement.textContent?.trim() || '',
            url: tweetUrl ? `https://twitter.com${tweetUrl}` : '',
            author: authorElement.textContent?.trim() || '',
            date: timeElement?.getAttribute('datetime') || '',
            engagement: {
              likes: parseInt(likeElement?.textContent?.trim() || '0', 10) || 0,
              comments: parseInt(replyElement?.textContent?.trim() || '0', 10) || 0,
              shares: parseInt(retweetElement?.textContent?.trim() || '0', 10) || 0,
            },
          });
        }
      }

      return items;
    }, limit);

    if (tweets.length === 0) {
      console.warn("Twitter returned 0 results — using Nitter fallback.");
      return await scrapeNitter(query, limit);
    }

    return tweets as TrendItem[];
  } catch (error) {
    console.error("Error scraping Twitter. Falling back to Nitter:", error);
    return await scrapeNitter(query, limit);
  } finally {
    await page.close();
  }
}



async function scrapeNitter(query: string, limit = 10): Promise<TrendItem[]> {
  const browser = await getBrowser();
  const page = await browser.newPage();
  
  try {
    const nitterUrl = `https://nitter.net/search?f=tweets&q=${encodeURIComponent(query)}`;
    await page.goto(nitterUrl, { waitUntil: "networkidle2", timeout: 10000 });
    await page.waitForSelector(".timeline-item", { timeout: 8000 });

    const tweets = await page.evaluate((limit) => {
      const items: any[] = [];
      const tweetElements = document.querySelectorAll(".timeline-item");

      for (let i = 0; i < Math.min(tweetElements.length, limit); i++) {
        const tweet = tweetElements[i];
        const contentElement = tweet.querySelector(".tweet-content");
        const authorElement = tweet.querySelector(".username");
        const dateElement = tweet.querySelector("a.tweet-date");
        const statsElement = tweet.querySelectorAll(".tweet-stats > span");

        items.push({
          id: `nt-${Date.now()}-${i}`,
          platform: "twitter",
          title: "",
          content: contentElement?.textContent?.trim() || "",
          url: dateElement?.getAttribute("href")?.startsWith("/")
            ? `https://nitter.net${dateElement.getAttribute("href")}`
            : "",
          author: authorElement?.textContent?.trim() || "",
          date: dateElement?.textContent?.trim() || "",
          engagement: {
            likes: parseInt(statsElement?.[1]?.textContent || "0", 10) || 0,
            comments: parseInt(statsElement?.[0]?.textContent || "0", 10) || 0,
            shares: parseInt(statsElement?.[2]?.textContent || "0", 10) || 0,
          },
        });
      }

      return items;
    }, limit);

    return tweets as TrendItem[];
  } catch (err) {
    console.error("Fallback Nitter scraping failed:", err);
    return [];
  } finally {
    await page.close();
  }
}


// Scrape trends based on platform
export async function scrapeTrends(query: string, platforms: Platform[], limit = 10): Promise<TrendItem[]> {
  const results: TrendItem[] = [];
  
  const scrapers = {
    youtube: scrapeYouTube,
    reddit: scrapeReddit,
    twitter: scrapeTwitter,
  };
  
  for (const platform of platforms) {
    const platformResults = await scrapers[platform](query, limit);
    results.push(...platformResults);
  }
  
  return results;
}