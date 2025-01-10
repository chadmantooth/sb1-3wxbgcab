export interface FeedItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  creator?: string;
  contentSnippet?: string;
  category?: string;
  source?: string;
}

export interface FeedError {
  message: string;
  code: string;
  timestamp: string;
}