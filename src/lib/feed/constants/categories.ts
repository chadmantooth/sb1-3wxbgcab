export const FEED_CATEGORIES = {
  IOT: ['iot', 'internet of things', 'connected devices'],
  CYBERSECURITY: ['security', 'cyber', 'protection'],
  DIGITAL_OILFIELD: ['digital', 'automation', 'smart field'],
  AI: ['ai', 'artificial intelligence', 'machine learning'],
  DATA_ANALYTICS: ['analytics', 'data', 'insights'],
  DRILLING: ['drilling', 'well', 'rig'],
  EXPLORATION: ['exploration', 'seismic', 'survey'],
  PRODUCTION: ['production', 'operations'],
  RESERVOIR: ['reservoir', 'formation'],
  SUSTAINABILITY: ['sustainable', 'green', 'environmental']
} as const;

export type FeedCategory = keyof typeof FEED_CATEGORIES;