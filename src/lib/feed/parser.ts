export interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  creator?: string;
  contentSnippet?: string;
  category?: string;
  source?: string;
}

export function parseXMLFeed(xml: string): FeedItem[] {
  // Validate XML content before parsing
  if (!xml.trim()) {
    throw new Error('Empty feed content');
  }

  if (xml.includes('<!DOCTYPE html>')) {
    throw new Error('Received HTML instead of feed content');
  }

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, 'text/xml');
  
  // Check for parsing errors
  const parseError = xmlDoc.querySelector('parsererror');
  if (parseError) {
    throw new Error(`Failed to parse XML feed: ${parseError.textContent}`);
  }

  // Get all item elements
  const items = xmlDoc.querySelectorAll('item');
  if (items.length === 0) {
    throw new Error('No feed items found');
  }

  return Array.from(items)
    .filter(item => {
      const title = item.querySelector('title')?.textContent;
      const link = item.querySelector('link')?.textContent;
      return title && link;
    })
    .map(item => ({
      title: item.querySelector('title')?.textContent || '',
      link: item.querySelector('link')?.textContent || '',
      pubDate: item.querySelector('pubDate')?.textContent || new Date().toISOString(),
      creator: item.querySelector('dc\\:creator')?.textContent || 'Unknown',
      contentSnippet: item.querySelector('description')?.textContent || '',
      category: item.querySelector('category')?.textContent || '',
      source: item.querySelector('source')?.textContent || xmlDoc.querySelector('channel > title')?.textContent || ''
    }))
    .filter(item => item.title && item.link);
}