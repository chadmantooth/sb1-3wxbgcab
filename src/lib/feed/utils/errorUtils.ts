// Extract error handling logic
export function formatFeedError(source: string, error: Error): string {
  return `Error parsing RSS feed for ${source}: ${error.message}`;
}

export function shouldWarnAboutErrors(errorCount: number, threshold = 10): boolean {
  return errorCount > threshold;
}