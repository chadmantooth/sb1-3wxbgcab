import { getAllSources } from '../lib/feed/sources.js';
import { parseFeed } from '../lib/feed/parser.js';
import { FeedLogger } from '../lib/feed/logger.js';
import * as fs from 'fs/promises';
import path from 'path'; 

const BATCH_SIZE = 10; // Process feeds in smaller batches
const DELAY_BETWEEN_BATCHES = 1000; // 1 second delay between batches

const logger = FeedLogger.getInstance();

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchFeeds() {
  try {
    logger.info('Starting feed fetch');
    
    try {
      const cacheDir = path.join(process.cwd(), '.cache');
      await fs.rm(cacheDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore errors if cache directory doesn't exist
    }
    
    const sources = await getAllSources();
    
    logger.info(`Processing ${sources.length} feeds in batches of ${BATCH_SIZE}`);
    
    const allItems = [];
    
    // Process feeds in batches
    for (let i = 0; i < sources.length; i += BATCH_SIZE) {
      const batch = sources.slice(i, i + BATCH_SIZE);
      logger.info(`Processing batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(sources.length/BATCH_SIZE)}`);
      
      const batchResults = await Promise.all(
        batch.map(async (source) => {
          try {
            const result = await parseFeed(source);
            return result.items || [];
          } catch (error) {
            logger.error(`Failed to fetch ${source.name}:`, error);
            return [];
          }
        })
      );
      
      // Flatten batch results and add to allItems
      for (const items of batchResults) {
        if (items.length) {
          allItems.push(...items);
        }
      }
      
      // Add delay between batches to avoid overwhelming servers
      if (i + BATCH_SIZE < sources.length) {
        await delay(DELAY_BETWEEN_BATCHES);
      }
    }

    logger.info(`Total items fetched: ${allItems.length}`);

    // Sort by date (newest first)
    const sortedItems = allItems.sort((a, b) => 
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    ).slice(0, 1000); // Limit to most recent 1000 items

    // Save to content directory
    const contentDir = path.join(process.cwd(), 'src/content/news');
    await fs.mkdir(contentDir, { recursive: true });

    try {
      const existingFiles = await fs.readdir(contentDir);
      await Promise.all(
        existingFiles.map(file => fs.unlink(path.join(contentDir, file)))
      );
    } catch (error) {
      // Directory might not exist yet, which is fine
    }

    // Write new files
    await Promise.all(
      sortedItems.map(async (item) => {
        const fileName = `${new Date(item.publishDate).getTime()}-${slugify(item.title)}.json`;
        await fs.writeFile(
          path.join(contentDir, fileName),
          JSON.stringify(item, null, 2)
        );
      })
    );

    logger.info(`Successfully saved ${sortedItems.length} news items`);
    process.exit(0);
  } catch (error) {
    logger.error('Feed fetch failed:', error);
    process.exit(1);
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

fetchFeeds();