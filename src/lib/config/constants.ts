export const SITE_CONFIG = {
  name: 'TechAnchorman',
  description: 'Your source for technology news and updates',
  url: 'https://techanchorman.io',
  author: 'Chad Mantooth',
  email: 'chad.mantooth@pbsnow.com',
  social: {
    linkedin: 'https://www.linkedin.com/in/chadmantooth/',
    twitter: 'https://twitter.com/techanchorman'
  }
} as const;

export const API_CONFIG = {
  baseUrl: '/api',
  endpoints: {
    feed: '/feed',
    rss: '/rss',
    threats: '/threats'
  },
  cache: {
    ttl: 5 * 60 * 1000 // 5 minutes
  }
} as const;

export const FEED_CONFIG = {
  maxItems: 100,
  refreshInterval: 5 * 60 * 1000, // 5 minutes
  retryAttempts: 3,
  retryDelay: 2000 // 2 seconds
} as const;