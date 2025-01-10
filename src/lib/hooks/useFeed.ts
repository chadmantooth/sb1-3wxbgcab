import { useState, useEffect, useCallback } from 'react';
import { FEED_CONSTANTS } from '../feed/constants';

interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  creator?: string;
  contentSnippet?: string;
}

interface UseFeedOptions {
  maxItems?: number;
}

export function useFeed({ maxItems = 50 }: UseFeedOptions = {}) {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchFeed = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/feed.json', {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if ('error' in data) {
        throw new Error(data.message || 'Failed to parse feed');
      }

      if (!Array.isArray(data)) {
        throw new Error('Invalid response format');
      }

      const validItems = data
        .filter(item => item.title && item.link)
        .map(item => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate || new Date().toISOString(),
          creator: item.creator,
          contentSnippet: item.contentSnippet
        }))
        .slice(0, maxItems);

      setItems(validItems);
      setRetryCount(0);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch feed';
      setError(message);
      
      if (retryCount < FEED_CONSTANTS.MAX_RETRIES) {
        const delay = FEED_CONSTANTS.RETRY_DELAYS[retryCount] || 8000;
        setTimeout(() => setRetryCount(prev => prev + 1), delay);
      }
    } finally {
      setIsLoading(false);
    }
  }, [maxItems, retryCount]);

  useEffect(() => {
    fetchFeed();
    const interval = setInterval(fetchFeed, FEED_CONSTANTS.REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchFeed]);

  return {
    items,
    isLoading,
    error,
    refetch: fetchFeed
  };
}