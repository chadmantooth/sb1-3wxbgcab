import { validateFeed } from '../lib/feed/validator.js';
import { parseFeed } from '../lib/feed/parser.js';
import { FeedLogger } from '../lib/feed/logger.js';
import type { FeedSource } from '../lib/feed/types.js';
import { FEEDSPOT_SOURCE } from '../lib/constants/feedspot.js';

const logger = new FeedLogger();

async function validateAndParseFeed(source: FeedSource) {
  const { name, url } = source;
  logger.info(`\nTesting feed: ${name} (${url})`);
  
  // Step 1: Validate feed structure
  logger.info('Step 1: Validating feed structure...');
  const validationResult = await validateFeed(source);
  
  if (!validationResult.isValid) {
    logger.error('Feed validation failed:');
    logger.error(`Error: ${validationResult.error}`);
    return;
  }
  
  logger.info('Feed structure is valid:');
  logger.info(`Title: ${validationResult.title}`);
  logger.info(`Items: ${validationResult.itemCount}`);
  logger.info(`Type: ${validationResult.type}`);
  logger.info(`Last Updated: ${validationResult.lastUpdated ?? 'Not available'}`);

  // Step 2: Test feed parsing
  logger.info('\nStep 2: Testing feed parsing...');
  const parseResult = await parseFeed(source);

  if (!parseResult.items?.length) {
    logger.error('Feed parsing failed:');
    logger.error(parseResult.error || 'No items found');
    return;
  }

  logger.info('Feed parsing successful:');
  logger.info(`Items parsed: ${parseResult.items.length}`);
  logger.info(`Fetch time: ${parseResult.metadata?.fetchTime}ms`);
  
  // Step 3: Sample feed content
  if (parseResult.items.length > 0) {
    const sample = parseResult.items[0];
    logger.info('\nSample item:');
    logger.info(`Title: ${sample.title ?? 'No title'}`);
    logger.info(`Date: ${sample.publishDate?.toISOString() ?? 'No date'}`);
    logger.info(`Category: ${sample.category ?? 'No category'}`);
    logger.info(`Link: ${sample.url ?? sample.link ?? 'No link'}`);
  }
}

const feedsToTest = [FEEDSPOT_SOURCE];

async function runDiagnostics() {
  logger.info('Starting RSS feed diagnostics...');
  
  let successCount = 0;
  let failureCount = 0;

  logger.info(`Testing ${feedsToTest.length} feeds...\n`);

  for (const feed of feedsToTest) {
    try {
      await validateAndParseFeed(feed);
      successCount++;
    } catch (error) {
      failureCount++;
      logger.error(`Failed to test ${feed.name}:`, error);
    }
  }
  
  logger.info('\nDiagnostics complete:');
  logger.info(`Successful: ${successCount}`);
  logger.info(`Failed: ${failureCount}`);
}

runDiagnostics().catch(error => {
  logger.error('Diagnostics failed:', error);
  process.exit(1);
});