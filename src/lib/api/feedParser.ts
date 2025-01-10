import { XMLParser } from 'fast-xml-parser';
import { SECURITY_CONFIG } from '../constants/security';

const GITHUB_FEED_URL = 'https://raw.githubusercontent.com/EndlessFractal/Threat-Intel-Feed/main/feed.xml';
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  parseAttributeValue: true,
  trimValues: true,
  parseTagValue: true
});

export interface FeedEntry {
  id: string;
  title: string;
  description: string;
  link?: string;
  pubDate: string;
  category?: string;
}

export async function parseFeed(): Promise<FeedEntry[]> {
  try {
    const response = await fetch(GITHUB_FEED_URL, {
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml',
        'Cache-Control': 'no-cache'
      },
      timeout: SECURITY_CONFIG.REQUEST_TIMEOUT
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xml = await response.text();
    if (!xml.trim()) {
      throw new Error('Empty feed response');
    }

    const data = parser.parse(xml);
    if (!data?.rss?.channel?.item) {
      throw new Error('Invalid feed structure');
    }

    const items = Array.isArray(data.rss.channel.item) ? 
      data.rss.channel.item : [data.rss.channel.item];

    return items.map(item => ({
      id: item.guid || crypto.randomUUID(),
      title: item.title || 'Untitled',
      description: item.description || '',
      link: item.link,
      pubDate: item.pubDate || new Date().toISOString(),
      category: item.category
    }));
  } catch (error) {
    console.error('Feed parsing error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to parse feed');
  }
}