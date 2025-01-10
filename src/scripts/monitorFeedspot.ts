import Parser from 'rss-parser';
import { FeedLogger } from '../lib/feed/logger.js';
import fetch from 'node-fetch';

const logger = new FeedLogger();
const parser = new Parser({
  timeout: 30000,
  headers: { 'User-Agent': 'Mozilla/5.0' },
  customFields: {
    feed: ['subtitle'],
    item: ['summary', 'category']
  }
});

const FEEDSPOT_URL = 'https://s3.amazonaws.com/feedspot/hvxfolder/feedspot_xml_8f40b960659197d5621318a7f8266a57_chad.xml';

async function monitorFeedspot() {
  try {
    logger.info('Starting Feedspot feed validation');
    
    // Test basic connectivity
    logger.info('Testing connection to Feedspot...');
    const response = await fetch(FEEDSPOT_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 30000
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Get XML content
    const xml = await response.text();
    logger.info('Successfully retrieved XML content');

    // Validate XML structure
    if (!xml.includes('<opml version="1.0">')) {
      throw new Error('Invalid OPML format: Missing required OPML header');
    }

    // Try parsing
    logger.info('Attempting to parse feed...');
    const feed = await parser.parseString(xml);
    
    if (!feed) {
      throw new Error('Failed to parse feed content');
    }

    logger.info('✓ Feed validation successful');
    logger.info(`Found ${feed.items?.length || 0} items`);

    // Display sample item if available
    if (feed.items?.[0]) {
      const item = feed.items[0];
      logger.info('\nSample item:');
      logger.info(`Title: ${item.title}`);
      logger.info(`Date: ${item.pubDate}`);
      logger.info(`Link: ${item.link}`);
    }

    return feed.items || [];

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`✗ Feed validation failed: ${message}`);
    throw error;
  }
}

// Execute monitoring
monitorFeedspot().catch(error => {
  logger.error('Monitor script failed:', error);
  process.exit(1);
});