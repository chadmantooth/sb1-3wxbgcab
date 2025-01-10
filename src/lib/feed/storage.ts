import type { FeedEntry } from './types';
import { FeedLogger } from './logger.js';

const logger = new FeedLogger();

export class FeedStorage {
  private entries: Map<string, FeedEntry> = new Map();

  addEntry(entry: FeedEntry): void {
    if (!this.entries.has(entry.id)) {
      this.entries.set(entry.id, entry);
      logger.info(`Added new entry: ${entry.title}`);
    }
  }

  getEntries(): FeedEntry[] {
    return Array.from(this.entries.values())
      .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
  }

  getEntriesBySource(source: string): FeedEntry[] {
    return this.getEntries().filter(entry => entry.source === source);
  }

  clear(): void {
    this.entries.clear();
    logger.info('Storage cleared');
  }

  get size(): number {
    return this.entries.size;
  }
}