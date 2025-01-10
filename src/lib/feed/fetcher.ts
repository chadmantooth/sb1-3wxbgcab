import { FEED_CONSTANTS } from './constants';

let currentProxyIndex = 0;

export async function fetchWithFallback(url: string): Promise<string> {
  let lastError: Error | null = null;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FEED_CONSTANTS.REQUEST_TIMEOUT);

  for (let i = 0; i < FEED_CONSTANTS.PROXY_URLS.length; i++) {
    const proxyUrl = FEED_CONSTANTS.PROXY_URLS[(currentProxyIndex + i) % FEED_CONSTANTS.PROXY_URLS.length];
    
    try {
      const encodedUrl = encodeURIComponent(url);
      const response = await fetch(`/api/feed`, {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      console.error(`Proxy ${proxyUrl} failed:`, lastError);
      continue;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw new Error(`All proxies failed to fetch feed: ${lastError?.message || 'Unknown error'}`);
}