import { XMLParser } from 'fast-xml-parser';
import { sanitize } from './utils';
import type { FeedEntry } from './types';
import NodeCache from 'node-cache';

const CACHE_TTL = 5 * 60; // 5 minutes in seconds
const MAX_ENTRIES = 50;
const FEEDSPOT_URL = 'https://rss.feedspot.com/folder/5hrIsmIb6A==/rss/rsscombiner';

const parser = new XMLParser({
  ignoreAttributes: false,
  parseAttributeValue: true,
  trimValues: true,
  parseTagValue: true,
  textNodeName: 'text'
});

const cache = new NodeCache({ stdTTL: CACHE_TTL });

export class FeedAggregator {
  private seenGuids = new Set<string>();

  async aggregateFeeds(): Promise<FeedEntry[]> {
    const cacheKey = 'aggregated_feeds';
    const cached = cache.get<FeedEntry[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(FEEDSPOT_URL, {
        headers: {
          'Accept': 'application/rss+xml, application/xml, text/xml',
          'User-Agent': 'TechAnchorman Feed Reader/1.0',
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const xml = await response.text();
      const feed = parser.parse(xml);
      const items = feed.rss?.channel?.item || [];
      const entries: FeedEntry[] = [];

      (Array.isArray(items) ? items : [items]).forEach((item: any) => {
        const guid = item.guid || item.link;
        if (guid && !this.seenGuids.has(guid)) {
          this.seenGuids.add(guid);
          entries.push({
            id: guid,
            title: sanitize(item.title || ''),
            description: sanitize(item.description || ''),
            publishDate: new Date(item.pubDate || new Date()),
            link: item.link || '',
            source: item.source?.text || feed.rss?.channel?.title || 'News Feed',
            category: item.category || 'General'
          });
        }
      });

      // Sort by date and limit entries
      const sortedEntries = entries
        .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime())
        .slice(0, MAX_ENTRIES);

      cache.set(cacheKey, sortedEntries);
      return sortedEntries;
    } catch (error) {
      console.error('Failed to fetch feed:', error);
      throw error;
    }
  }

  generateRSS(entries: FeedEntry[]): string {
    const now = new Date().toUTCString();
    
    const items = entries.map(entry => `
    <item>
      <title><![CDATA[${entry.title}]]></title>
      <description><![CDATA[${entry.description}]]></description>
      <pubDate>${entry.publishDate.toUTCString()}</pubDate>
      <link>${entry.link}</link>
      <guid isPermaLink="false">${entry.id}</guid>
      <source url="${entry.link}">${entry.source}</source>
      <category>${entry.category}</category>
    </item>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>TechAnchorman News Feed</title>
    <link>https://techanchorman.io</link>
    <description>Aggregated technology and industry news feed</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <generator>TechAnchorman Feed Aggregator</generator>
    <atom:link href="https://techanchorman.io/api/rss" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;
  }
}