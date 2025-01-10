import Parser from 'rss-parser';
import type { FeedSource } from '../feedSources';
import type { NewsItem } from '../types';

const parser = new Parser();

export async function parseRSSFeed(source: FeedSource): Promise<NewsItem[]> {
  try {
    const feed = await parser.parseURL(source.url);
    
    return feed.items.map(item => ({
      title: item.title || 'Untitled',
      publishDate: new Date(item.pubDate || new Date()),
      vendor: source.vendor || source.name,
      category: source.category,
      summary: item.contentSnippet?.slice(0, 200) || '',
      url: item.link || '',
      featured: false
    }));
  } catch (error) {
    console.error(`Error parsing RSS feed for ${source.name}:`, error);
    return [];
  }
}