import { fetchGitHubFeed, processGitHubFeed } from '../lib/feed/githubFeed';
import { FeedLogger } from '../lib/feed/logger';

const logger = FeedLogger.getInstance();

async function importGitHubFeed() {
  try {
    logger.info('Starting GitHub feed import');
    
    const feedData = await fetchGitHubFeed();
    if (feedData.length === 0) {
      logger.info('No new GitHub feed data to process');
      return;
    }

    logger.info(`Processing ${feedData.length} GitHub feed items`);
    const threats = await processGitHubFeed(feedData);
    
    logger.info(`Successfully imported ${threats.length} threats from GitHub feed`);
  } catch (error) {
    logger.error('Failed to import GitHub feed:', error);
    process.exit(1);
  }
}

importGitHubFeed();