import { type FeedSource } from '../constants/feedSources.js';
import { NEWS_CATEGORIES } from '../constants/categories.js';
import { parseXML } from './xmlParser.js';
import { FeedMonitor } from './monitor.js';
import { categorizeSource } from './utils/categoryUtils.js';

const monitor = FeedMonitor.getInstance();

export async function parseFeedspotXML(url: string): Promise<FeedSource[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch Feedspot XML: ${response.statusText}`);
    }
    
    const xml = await response.text();
    const result = await parseXML(xml);
    
    if (!result?.opml?.body?.outline?.outline) {
      throw new Error('Invalid Feedspot XML structure');
    }

    // Extract feeds from OPML structure
    const feeds = result.opml.body.outline.outline
      .filter(item => item.xmlUrl)
      .map(item => ({
        name: item.title || item.text,
        type: 'rss' as const,
        url: item.xmlUrl,
        category: categorizeSource(item.text || ''),
        vendor: item.title || item.text
      }));

    return feeds;
  } catch (error) {
    await monitor.logError('Feedspot', error.message, 0);
    console.error('Failed to parse Feedspot feeds:', error);
    return [];
  }
}