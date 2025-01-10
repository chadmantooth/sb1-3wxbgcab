import { XMLParser } from 'fast-xml-parser';
import { FEED_CONSTANTS } from './constants';
import { fetchWithFallback } from './fetcher';

interface NewsItem {
  title: string;
  summary: string;
  source: string;
  publishDate: Date;
  relevanceScore: number;
}

export class PersonalizedFeedService {
  private parser: XMLParser;

  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      parseAttributeValue: true,
      trimValues: true
    });
  }

  private calculateRelevanceScore(item: any): number {
    let score = 5; // Base score
    const content = `${item.title} ${item.description}`.toLowerCase();
    
    // Boost score based on keywords
    const keywords = ['ai', 'cybersecurity', 'blockchain', 'cloud', 'data'];
    keywords.forEach(keyword => {
      if (content.includes(keyword)) score += 1;
    });

    // Boost for credible sources
    const credibleSources = ['Reuters', 'Bloomberg', 'TechCrunch', 'Wired'];
    if (credibleSources.some(source => item.source?.includes(source))) {
      score += 2;
    }

    // Normalize score to 1-10 range
    return Math.min(10, Math.max(1, score));
  }

  private isWithinTimeframe(date: Date, hours: number): boolean {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return date > cutoff;
  }

  async getPersonalizedFeed(): Promise<NewsItem[]> {
    try {
      const xml = await fetchWithFallback(FEED_CONSTANTS.FEEDSPOT_URL);
      const result = this.parser.parse(xml);
      
      if (!result?.rss?.channel?.item) {
        throw new Error('Invalid feed structure');
      }

      const items = Array.isArray(result.rss.channel.item) 
        ? result.rss.channel.item 
        : [result.rss.channel.item];

      const processedItems = items
        .map(item => {
          const publishDate = new Date(item.pubDate);
          
          // Only include items from last 72 hours
          if (!this.isWithinTimeframe(publishDate, 72)) {
            return null;
          }

          return {
            title: item.title,
            summary: item.description?.slice(0, 200) + '...' || '',
            source: item.source?.text || result.rss.channel.title || 'Unknown',
            publishDate,
            relevanceScore: this.calculateRelevanceScore(item)
          };
        })
        .filter((item): item is NewsItem => 
          item !== null && 
          item.title && 
          item.summary
        )
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, FEED_CONSTANTS.MAX_ITEMS);

      // Remove duplicates based on title similarity
      const uniqueItems = this.removeDuplicates(processedItems);
      
      // Return top 10 most relevant items
      return uniqueItems.slice(0, 10);
    } catch (error) {
      console.error('Failed to fetch personalized feed:', error);
      throw error;
    }
  }

  private removeDuplicates(items: NewsItem[]): NewsItem[] {
    const seen = new Set<string>();
    return items.filter(item => {
      const normalized = item.title.toLowerCase().replace(/\W+/g, '');
      if (seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });
  }
}