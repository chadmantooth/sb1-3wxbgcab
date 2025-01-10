import { parseString } from 'xml2js';
import { promisify } from 'util';
import fetch from 'node-fetch';
import type { FeedSource } from '../types.js';
import { NEWS_CATEGORIES } from '../../constants/categories.js';
import { FeedLogger } from '../logger.js';

const parseXMLAsync = promisify(parseString);
const logger = FeedLogger.getInstance();

export async function parseOPMLFeed(url: string): Promise<FeedSource[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch OPML: ${response.statusText}`);
    }
    
    const xml = await response.text();
    const result = await parseXMLAsync(xml, {
      explicitArray: false,
      mergeAttrs: true,
      normalize: true,
      trim: true
    });
    
    if (!result?.opml?.body?.outline) {
      throw new Error('Invalid OPML structure');
    }

    const outlines = Array.isArray(result.opml.body.outline) 
      ? result.opml.body.outline 
      : [result.opml.body.outline];

    const feeds = outlines
      .flatMap((outline: any) => outline.outline || [])
      .filter((item: any) => item.xmlUrl)
      .map((item: any) => ({
        name: item.title || item.text,
        url: item.xmlUrl,
        category: categorizeSource(item.title || item.text),
        vendor: item.title || item.text
      }));

    logger.info(`Parsed ${feeds.length} feeds from OPML`);
    return feeds;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Failed to parse OPML feed: ${errorMessage}`);
    return [];
  }
}

function categorizeSource(title: string): NewsCategory {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('drill') || lowerTitle.includes('rig')) {
    return NEWS_CATEGORIES.DRILLING;
  }
  if (lowerTitle.includes('explor') || lowerTitle.includes('survey')) {
    return NEWS_CATEGORIES.EXPLORATION;
  }
  if (lowerTitle.includes('digital') || lowerTitle.includes('tech')) {
    return NEWS_CATEGORIES.DIGITAL_OILFIELD;
  }
  if (lowerTitle.includes('reservoir') || lowerTitle.includes('subsurface')) {
    return NEWS_CATEGORIES.RESERVOIR;
  }
  
  return NEWS_CATEGORIES.PRODUCTION;
}