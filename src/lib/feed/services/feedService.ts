import { FeedLogger } from '../logger.js';
import { validateFeed } from '../validator.js';
import { parseFeed } from '../parser.js';
import type { FeedSource, FeedResult } from '../types.js';

export class FeedService {
  private logger: FeedLogger;

  constructor() {
    this.logger = new FeedLogger();
  }

  async processFeed(source: FeedSource): Promise<FeedResult> {
    this.logger.info(`Processing feed: ${source.name}`);

    // First validate the feed
    const validation = await validateFeed(source);
    if (!validation.isValid) {
      return {
        entries: [],
        errors: [{
          timestamp: new Date(),
          source: source.name,
          message: validation.error
        }],
        metadata: {
          fetchTime: 0,
          success: false
        }
      };
    }

    // Then parse if valid
    return await parseFeed(source);
  }

  async processFeedBatch(sources: FeedSource[]): Promise<FeedResult[]> {
    this.logger.info(`Processing ${sources.length} feeds`);
    
    const results = await Promise.all(
      sources.map(source => this.processFeed(source))
    );

    const successCount = results.filter(r => r.metadata?.success).length;
    this.logger.info(`Processed ${successCount}/${sources.length} feeds successfully`);

    return results;
  }
}