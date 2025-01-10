import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { FEED_CONSTANTS } from './constants';

const MAX_FEED_ITEMS = FEED_CONSTANTS.MAX_ITEMS;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  parseAttributeValue: true,
  trimValues: true,
  parseTagValue: true,
  allowBooleanAttributes: true,
  parseNodeValue: true,
  parseTrueNumberOnly: false,

export interface ThreatFeedItem {
  id: string;
  title: string;
  description: string;
  link?: string;
  pubDate: string;
  source?: string;
  category?: string;
}
  arrayMode: false,
  stopNodes: ['*.content']
  ignoreDeclaration: true
});

export async function parseThreatFeed(): Promise<ThreatFeedItem[]> {
  try {
    const response = await fetch(FEED_CONSTANTS.GITHUB_FEED_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xml = await response.text();
    if (!xml.trim()) {
      throw new Error('Empty feed response');
    }
    
    // Validate XML
    const validationResult = XMLValidator.validate(xml);
    if (validationResult !== true) {
      throw new Error(`Invalid XML: ${validationResult.err.msg}`);
    }

    // Parse XML
    const result = parser.parse(xml.trim());
    if (!result?.rss?.channel?.item) {
      throw new Error('Invalid feed structure');
    }

    const items = Array.isArray(result.rss.channel.item) 
      ? result.rss.channel.item 
      : [result.rss.channel.item];

    return items.map(item => ({
      id: item.guid || crypto.randomUUID(),
      title: item.title || 'Unknown Threat',
      description: item.description || '',
      link: item.link,
      pubDate: item.pubDate || new Date().toISOString(),
      source: 'GitHub Security Feed',
      category: item.category || 'vulnerability'
    })).slice(0, MAX_FEED_ITEMS);

  } catch (error) {
    console.error('Feed parsing error:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    console.warn('Feed fetch failed, using fallback data');
    return FEED_CONSTANTS.MOCK_THREATS;
  }
}