import type { APIRoute } from 'astro';
import { XMLParser } from 'fast-xml-parser';
import { FEED_CONSTANTS } from '../../lib/feed/constants';

const parser = new XMLParser({
  ignoreAttributes: false,
  parseAttributeValue: true,
  trimValues: true
});

const MOCK_ITEMS = [
  {
    title: "Sample Technology News",
    link: "https://example.com/news/1",
    pubDate: new Date().toISOString(),
    contentSnippet: "This is a fallback news item while we restore the feed connection."
  }
];

let cachedData: any = null;
let lastFetch = 0;

export const GET: APIRoute = async () => {
  try {
    // Return cached data if available and not expired
    const now = Date.now();
    if (cachedData && (now - lastFetch < FEED_CONSTANTS.CACHE_DURATION)) {
      return new Response(JSON.stringify(cachedData), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300'
        }
      });
    }

    // Try each proxy until one works
    let xml = null;
    let success = false;

    for (const proxyUrl of FEED_CONSTANTS.PROXY_URLS) {
      try {
        const response = await fetch(
          `${proxyUrl}${encodeURIComponent(FEED_CONSTANTS.FEEDSPOT_URL)}`,
          {
            headers: {
              'Accept': 'application/xml, text/xml, application/rss+xml',
              'User-Agent': 'TechAnchorman Feed Reader/1.0'
            },
            timeout: FEED_CONSTANTS.REQUEST_TIMEOUT
          }
        );

        if (response.ok) {
          xml = await response.text();
          success = true;
          break;
        }
      } catch (error) {
        console.error(`Proxy ${proxyUrl} failed:`, error);
        continue;
      }
    }

    if (!success || !xml) {
      console.warn('All proxies failed, using mock data');
      return new Response(JSON.stringify(MOCK_ITEMS), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse XML
    const result = parser.parse(xml);
    if (!result?.rss?.channel?.item) {
      throw new Error('Invalid feed structure');
    }

    const items = (Array.isArray(result.rss.channel.item) 
      ? result.rss.channel.item 
      : [result.rss.channel.item]
    ).map(item => ({
      title: item.title || '',
      link: item.link || '',
      pubDate: item.pubDate || new Date().toISOString(),
      contentSnippet: (item.description || item['content:encoded'] || '')
        .replace(/<[^>]*>/g, '')
        .slice(0, 300)
    })).filter(item => 
      item.title && 
      item.link && 
      new Date(item.pubDate).toString() !== 'Invalid Date'
    );

    if (!items.length) {
      console.warn('No valid items found, using mock data');
      return new Response(JSON.stringify(MOCK_ITEMS), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update cache
    cachedData = items;
    lastFetch = now;

    return new Response(JSON.stringify(items), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      }
    });
  } catch (error) {
    console.error('Feed error:', error);
    
    // Return mock data on error
    return new Response(JSON.stringify(MOCK_ITEMS), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};