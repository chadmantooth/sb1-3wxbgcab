import { FeedLogger } from './logger.js';
import { FeedStorage } from './storage.js';
import { validateFeed } from './validator.js';
import { parseOPMLContent } from './parser.js';
import type { FeedEntry } from './types.js';

const MAX_ITEMS = 100;
const BATCH_SIZE = 5;

const logger = new FeedLogger();
const storage = new FeedStorage();

export async function processFeedsParallel(opmlContent: string): Promise<boolean> {
  try {
    logger.info('Starting parallel feed processing');
    
    // Parse OPML content
    const result = await parseOPMLContent(opmlContent);
    if (result.errors?.length) {
      result.errors.forEach(error => {
        logger.error(`${error.source}: ${error.message}`);
      });
      return false;
    }

    // Process feeds in parallel with concurrency limit
    const entries = result.entries;
    const batches = [];
    
    for (let i = 0; i < entries.length; i += BATCH_SIZE) {
      batches.push(entries.slice(i, i + BATCH_SIZE));
    }

    for (const batch of batches) {
      await Promise.all(batch.map(async (entry) => {
        try {
          const validation = await validateFeed({
            name: entry.source,
            type: 'rss',
            url: entry.link,
            category: 'News'
          });

          if (validation.isValid) {
            storage.addEntry(entry);
            logger.info(`Processed feed: ${entry.source}`);
          } else {
            logger.error(`Invalid feed ${entry.source}: ${validation.error}`);
          }
        } catch (error) {
          logger.error(`Failed to process ${entry.source}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }));
    }

    // Get most recent items
    const allEntries = storage.getEntries().slice(0, MAX_ITEMS);
    
    logger.info(`Successfully processed ${allEntries.length} items from ${storage.size} feeds`);
    return true;
  } catch (error) {
    logger.error(`Feed processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return false;
  }
}