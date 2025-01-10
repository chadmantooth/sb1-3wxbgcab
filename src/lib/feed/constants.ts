export const FEED_CONSTANTS = {
  FEEDSPOT_URL: 'https://rss.feedspot.com/folder/5hrIsmIb6A==/rss/rsscombiner',
  MAX_ITEMS: 50,
  REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minutes
  PROXY_URLS: [
    'https://corsproxy.io/?',
    'https://api.allorigins.win/raw?url=',
    'https://api.codetabs.com/v1/proxy?quest='
  ],
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  REQUEST_TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 3,
  RETRY_DELAYS: [2000, 4000, 8000], // Exponential backoff
  MAX_CONTENT_LENGTH: 300 // Maximum length for content snippets
} as const;