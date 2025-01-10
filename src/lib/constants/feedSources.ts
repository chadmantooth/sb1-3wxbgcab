import { type NewsCategory, NEWS_CATEGORIES } from './categories.js';

export interface FeedSource {
  name: string;
  type: 'rss';
  url: string;
  category: NewsCategory;
  vendor?: string;
}

// Single source of truth for feed URL
export const FEEDSPOT_URL = 'https://rss.feedspot.com/folder/5hrIsmIb6A==/rss/rsscombiner';

// Base feed configuration
export const BASE_FEEDS: FeedSource[] = [
  {
    name: 'Feedspot Combined Feed',
    type: 'rss',
    url: FEEDSPOT_URL,
    category: NEWS_CATEGORIES.PRODUCTION,
    vendor: 'Feedspot'
  }
];

export async function getAllFeeds(): Promise<FeedSource[]> {
  return BASE_FEEDS;
}