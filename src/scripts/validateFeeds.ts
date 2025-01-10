import { validateFeed } from '../lib/feed/validator.js';
import { FeedLogger } from '../lib/feed/logger.js';

const logger = new FeedLogger();

const FEEDSPOT_URL = 'https://rss.feedspot.com/folder/5hrIsmIb6A==/rss/rsscombiner';

const feedUrls = [FEEDSPOT_URL];

async function validateFeeds() {
  logger.info('Starting feed validation');
  
  for (const url of feedUrls) {
    const result = await validateFeed(url);
    
    if (result.isValid) {
      logger.info(`✓ ${url}`);
      logger.info(`  Title: ${result.title}`);
      logger.info(`  Items: ${result.itemCount}`);
      logger.info(`  Last Updated: ${result.lastUpdated}`);
    } else {
      logger.error(`✗ ${url}`);
      logger.error(`  Error: ${result.error}`);
    }
  }
}

validateFeeds().catch(error => {
  logger.error('Validation failed:', error);
  process.exit(1);
});