import Parser from 'rss-parser';
import type { FeedSource } from '../constants/feedSources.js';
import type { FeedItem, FeedResult } from './types.js';
import { withRetry } from './retry.js';
import { FeedMonitor } from './monitor.js';

const parser = new Parser();
const monitor = FeedMonitor.getInstance();

export async function parseRSSFeed(source: FeedSource): Promise<FeedResult> {
  const startTime = Date.now();
  
  try {
    const feed = await withRetry(async () => {
      try {
        return await parser.parseURL(source.url);
      } catch (error) {
        await monitor.logError(source.name, error.message, 0);
        throw error;
      }
    });
    
    const items: FeedItem[] = feed.items.map(item => ({
      title: item.title || 'Untitled',
      publishDate: new Date(item.pubDate || new Date()),
      vendor: source.vendor || source.name,
      category: source.category,
      summary: item.contentSnippet?.slice(0, 200) || '',
      url: item.link || ''
    }));

    return {
      items,
      metadata: {
        fetchTime: Date.now() - startTime,
        success: true
      }
    };
  } catch (error) {
    return {
      items: [],
      errors: [`Error parsing RSS feed for ${source.name}: ${error.message}`],
      metadata: {
        fetchTime: Date.now() - startTime,
        success: false
      }
    };
  }
}