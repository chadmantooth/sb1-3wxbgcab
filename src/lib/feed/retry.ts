import pLimit from 'p-limit';
import { FeedLogger } from './logger.js';

const limit = pLimit(5); // Increase concurrent operations for better throughput
const logger = FeedLogger.getInstance();

const MAX_RETRIES = 3;
const BASE_DELAY = 2000;

export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = MAX_RETRIES,
  delayMs: number = BASE_DELAY
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await limit(() => operation());
    } catch (error) {
      lastError = error as Error;
      const backoffTime = delayMs * Math.pow(2, attempt);
      logger.warn(
        `Retry attempt ${attempt + 1}/${maxRetries} failed: ${lastError.message}. ` +
        `Waiting ${backoffTime}ms before next attempt.`
      );
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, backoffTime));
      }
    }
  }
  
  logger.error(
    `All ${maxRetries} retry attempts failed. Last error: ${lastError?.message}`,
    lastError
  );
  throw lastError;
}