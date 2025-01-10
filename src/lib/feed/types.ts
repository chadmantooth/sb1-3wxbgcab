export interface FeedEntry {
  id: string;
  title?: string;
  type: 'rss' | 'atom' | 'json';
  description: string;
  publishDate: Date;
  author?: string;
  link?: string;
  source: string;
  category?: string;
  summary?: string;
  vendor?: string;
  featured?: boolean;
}

export interface FeedError {
  timestamp: Date;
  source: string;
  message?: string;
}

export interface FeedResult {
  entries: FeedEntry[];
  errors?: FeedError[];
  items?: any[];
  metadata?: {
    fetchTime: number;
    success: boolean;
    totalEntries?: number;
    newEntries?: number;
  };
}

export interface FeedValidationResult {
  url: string;
  isValid: boolean;
  error?: string;
  itemCount?: number;
  lastUpdated?: string;
  title?: string;
  type?: string;
}

export interface FeedSource {
  name: string;
  type: 'rss' | 'atom' | 'json';
  url: string;
  category: string;
  vendor?: string;
}