import type { APIRoute } from 'astro';
import { XMLParser } from 'fast-xml-parser';
import { FEED_CONSTANTS } from '../../lib/feed/constants';

const parser = new XMLParser({
  ignoreAttributes: false,
  parseAttributeValue: true,
  trimValues: true,
  parseTagValue: true,
  textNodeName: 'text'
});

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
              'User-Agent': 'TechAnchorman Feed Reader/1.0',
              'Cache-Control': 'no-cache'
            },
            timeout: FEED_CONSTANTS.REQUEST_TIMEOUT
          }
        );

        if (response.ok) {
          xml = await response.text();
          if (xml.includes('<?xml') || xml.includes('<rss')) {
            success = true;
            break;
          }
        }
      } catch (error) {
        console.error(`Proxy ${proxyUrl} failed:`, error);
        continue;
      }
    }

    if (!success || !xml) {
      throw new Error('Failed to fetch feed from all proxies');
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
      creator: item['dc:creator'] || item.author || '',
      contentSnippet: (item.description || item['content:encoded'] || '')
        .replace(/<[^>]*>/g, '')
        .slice(0, FEED_CONSTANTS.MAX_CONTENT_LENGTH)
    })).filter(item => 
      item.title && 
      item.link && 
      new Date(item.pubDate).toString() !== 'Invalid Date'
    );

    if (!items.length) {
      throw new Error('No valid items found in feed');
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
    return new Response(JSON.stringify({
      error: 'Feed error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};