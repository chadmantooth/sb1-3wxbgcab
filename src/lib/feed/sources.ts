import { parseOPMLFeed } from './parsers/opml.js';
import type { FeedSource } from './types.js';
import { FeedLogger } from './logger.js';

const FEEDSPOT_URL = 'https://s3.amazonaws.com/feedspot/hvxfolder/feedspot_xml_8f40b960659197d5621318a7f8266a57_chad.xml';
const ENDLESS_FRACTAL_URL = 'https://raw.githubusercontent.com/EndlessFractal/Threat-Intel-Feed/main/feed.xml';
const logger = FeedLogger.getInstance();

export async function getAllSources(): Promise<FeedSource[]> {
  try {
    logger.info('Fetching feeds from Feedspot');
    const feedspotFeeds = await parseOPMLFeed(FEEDSPOT_URL);
    
    // Add EndlessFractal feed
    const endlessFractalFeed = {
      name: 'EndlessFractal Threat Feed',
      type: 'rss' as const,
      url: ENDLESS_FRACTAL_URL,
      category: 'Cybersecurity',
      vendor: 'EndlessFractal'
    };

    const feeds = [...feedspotFeeds, endlessFractalFeed];
    logger.info(`Found ${feeds.length} total feeds`);
    return feeds;
    
  } catch (error) {
    logger.error('Failed to get Feedspot feeds', error as Error);
    return [];
  }
}