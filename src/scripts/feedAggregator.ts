import { processFeedsParallel } from '../lib/feed/processor.js';
import { FeedLogger } from '../lib/feed/logger.js';
import { validateFeed } from '../lib/feed/validator.js';
import { FEEDSPOT_SOURCE } from '../lib/constants/feedspot.js';

const logger = new FeedLogger();

async function main() {
  try {
    logger.info('Starting feed aggregator');
    
    // Validate Feedspot connection first
    const validation = await validateFeed(FEEDSPOT_SOURCE);

    if (!validation.isValid) {
      throw new Error(`Feedspot validation failed: ${validation.error}`);
    }

    // Process feeds
    const response = await fetch(FEEDSPOT_SOURCE.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.statusText}`);
    }
    const opmlContent = await response.text();

    const success = await processFeedsParallel(opmlContent);
    
    if (!success) {
      logger.error('Feed processing completed with errors');
      process.exit(1);
    }
    
    logger.info('Feed processing completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error(`Fatal error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
}

main();