export const SECURITY_CONFIG = {
  API_KEY: import.meta.env.VITE_SECURITY_API_KEY || '',
  GITHUB_TOKEN: import.meta.env.VITE_GITHUB_TOKEN || '',
  GITHUB_FEED_REPO: 'EndlessFractal/Threat-Intel-Feed',
  GITHUB_FEED_BRANCH: 'main',
  GITHUB_FEED_PATH: 'feed.xml',
  API_BASE_URL: 'https://api.example.com/v1',
  CACHE_TTL: 900, // 15 minutes
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  REQUEST_TIMEOUT: 30000,
  DATA_RETENTION_DAYS: 90,
  FALLBACK_ENABLED: true,
  FEED_REFRESH_INTERVALS: {
    GITHUB: 1800000,     // 30 minutes
    ENDLESS_FRACTAL: 3600000  // 1 hour
  },
  FALSE_POSITIVE_THRESHOLD: 0.8
} as const;

export const SEVERITY_MAPPING = {
  Unknown: 'low',
  Low: 'low',
  Medium: 'medium',
  High: 'high',
  Critical: 'critical'
} as const;