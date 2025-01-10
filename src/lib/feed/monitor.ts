import fs from 'fs/promises';
import path from 'path';
import type { FeedError } from './types';

const LOG_DIR = 'logs';
const ERROR_LOG = 'feed-errors.json';

export class FeedMonitor {
  private static instance: FeedMonitor;
  private errors: FeedError[] = [];

  private constructor() {}

  static getInstance(): FeedMonitor {
    if (!this.instance) {
      this.instance = new FeedMonitor();
    }
    return this.instance;
  }

  async logError(source: string, error: string, retryCount: number): Promise<void> {
    const feedError: FeedError = {
      source,
      error,
      timestamp: new Date(),
      retryCount
    };

    this.errors.push(feedError);
    await this.saveErrors();
  }

  async getErrors(since?: Date): FeedError[] {
    if (!since) return this.errors;
    return this.errors.filter(error => error.timestamp > since);
  }

  private async saveErrors(): Promise<void> {
    try {
      await fs.mkdir(LOG_DIR, { recursive: true });
      await fs.writeFile(
        path.join(LOG_DIR, ERROR_LOG),
        JSON.stringify(this.errors, null, 2)
      );
    } catch (error) {
      console.error('Failed to save feed errors:', error);
    }
  }

  async loadErrors(): Promise<void> {
    try {
      const data = await fs.readFile(path.join(LOG_DIR, ERROR_LOG), 'utf-8');
      this.errors = JSON.parse(data);
    } catch (error) {
      // File might not exist yet
      this.errors = [];
    }
  }
}