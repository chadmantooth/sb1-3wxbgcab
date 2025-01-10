import { XMLParser } from 'fast-xml-parser';
import { FEED_CONSTANTS } from './constants';
import { FeedLogger } from './logger';

const logger = FeedLogger.getInstance();
const parser = new XMLParser({
  ignoreAttributes: false,
  parseAttributeValue: true,
  trimValues: true
});

export async function runFeedDiagnostics() {
  const results = {
    connectivity: false,
    parsing: false,
    caching: false,
    proxyStatus: {} as Record<string, boolean>,
    errors: [] as string[]
  };

  // Test each proxy
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

      results.proxyStatus[proxyUrl] = response.ok;
      
      if (response.ok) {
        results.connectivity = true;
        const xml = await response.text();
        
        try {
          const feed = parser.parse(xml);
          if (feed?.rss?.channel?.item) {
            results.parsing = true;
          }
        } catch (parseError) {
          results.errors.push(`Parse error for ${proxyUrl}: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
        }
      }
    } catch (error) {
      results.proxyStatus[proxyUrl] = false;
      results.errors.push(`Proxy error for ${proxyUrl}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Test caching
  try {
    const cacheTestKey = 'diagnostics_test';
    const testData = { timestamp: Date.now() };
    localStorage.setItem(cacheTestKey, JSON.stringify(testData));
    const retrieved = localStorage.getItem(cacheTestKey);
    results.caching = retrieved === JSON.stringify(testData);
    localStorage.removeItem(cacheTestKey);
  } catch (error) {
    results.errors.push(`Cache test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return results;
}