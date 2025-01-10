export class FeedLogger {
  private static instance: FeedLogger | null = null;

  private constructor() {}

  static getInstance(): FeedLogger {
    if (!FeedLogger.instance) {
      FeedLogger.instance = new FeedLogger();
    }
    return FeedLogger.instance;
  }

  info(message: string): void {
    console.log(`[${new Date().toISOString()}] INFO: ${message}`);
  }

  error(message: string, error?: Error): void {
    console.error(`[${new Date().toISOString()}] ERROR: ${message}`);
    if (error?.stack) {
      console.error(error.stack);
    }
  }

  warn(message: string): void {
    console.warn(`[${new Date().toISOString()}] WARN: ${message}`);
  }
}