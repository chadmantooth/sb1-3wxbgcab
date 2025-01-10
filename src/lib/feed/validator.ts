import { FeedLogger } from './logger.js';
import type { FeedSource, FeedValidationResult } from './types.js';
import { XMLParser } from 'fast-xml-parser';

const logger = new FeedLogger();
const parser = new XMLParser({
  ignoreAttributes: false,
  parseAttributeValue: true,
  htmlEntities: true,
  trimValues: true
});

export async function validateFeed(source: FeedSource): Promise<FeedValidationResult> {
  try {
    logger.info(`Validating feed: ${source.url}`);
    
    const response = await fetch(source.url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'TechAnchorman Feed Validator/1.0',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      }
    });

    if (!response.ok) {
      return {
        url: source.url,
        isValid: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const xml = await response.text();
    const trimmedXml = xml.trim();
    if (!trimmedXml) {
      return {
        url: source.url,
        isValid: false,
        error: 'Empty response received'
      };
    }
    
    // Validate XML structure
    let result;
    try {
      result = parser.parse(trimmedXml);
    } catch (e) {
      const error = e instanceof Error ? e.message : 'Unknown error';
      return {
        url: source.url,
        isValid: false,
        error: `XML parsing failed: ${error}`
      };
    }

    // Check for RSS or Atom format
    const isFeed = result?.rss?.channel || result?.feed;
    if (!isFeed) {
      return {
        url: source.url,
        isValid: false,
        error: 'Not a valid RSS or Atom feed'
      };
    }

    // Check for required RSS elements
    const channel = result.rss?.channel || result.feed;
    if (!channel.title || !channel.description) {
      return {
        url: source.url,
        isValid: false,
        error: 'Missing required RSS channel elements'
      };
    }

    const items = Array.isArray(channel.item) ? channel.item : [channel.item];
    return {
      url: source.url,
      isValid: true,
      type: source.type,
      itemCount: items.length,
      lastUpdated: channel.lastBuildDate || channel.pubDate,
      title: channel.title
    };

  } catch (error) {
    return {
      url: source.url,
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}