import { FeedLogger } from './logger.js';
import { XMLParser } from 'fast-xml-parser';

const logger = FeedLogger.getInstance();

export function cleanJsonString(str: string): string {
  if (!str || typeof str !== 'string') return '';
  
  return str
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
    .replace(/\\/g, '\\\\') // Escape backslashes
    .replace(/"/g, '\\"') // Escape quotes
    .replace(/\n/g, '\\n') // Handle newlines
    .replace(/\r/g, '\\r') // Handle carriage returns
    .replace(/\t/g, '\\t') // Handle tabs
    .replace(/[\u2028\u2029]/g, '') // Remove line/paragraph separators
    .trim();
}

export function validateJsonObject(obj: any): any {
  if (!obj || typeof obj !== 'object' || obj === null) return {};
  
  const cleaned: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    // Clean property names
    const cleanKey = cleanJsonString(key);
    
    // Handle different value types
    if (typeof value === 'string') {
      cleaned[cleanKey] = cleanJsonString(value);
    } else if (typeof value === 'number') {
      cleaned[cleanKey] = isFinite(value) ? value : 0;
    } else if (typeof value === 'boolean') {
      cleaned[cleanKey] = value;
    } else if (value === null) {
      cleaned[cleanKey] = null;
    } else if (Array.isArray(value)) {
      cleaned[cleanKey] = value.map(item => 
        typeof item === 'object' ? validateJsonObject(item) : cleanJsonString(String(item))
      );
    } else if (typeof value === 'object') {
      cleaned[cleanKey] = validateJsonObject(value);
    } else {
      cleaned[cleanKey] = null;
    }
  }
  
  return cleaned;
}

export function sanitize(html: string): string {
  if (!html || typeof html !== 'string') return '';
  
  return cleanJsonString(
    html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
  );
}

export function toDate(dateStr: string | Date): Date {
  try {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? new Date() : date;
  } catch (e) {
    return new Date();
  }
}

export function getPublishTimestamp(publishDate: unknown): number {
  try {
    // Handle undefined/null
    if (!publishDate) {
      logger.warn('Missing publishDate');
      return Date.now();
    }

    // Handle Date objects
    if (publishDate instanceof Date) {
      const timestamp = publishDate.getTime();
      if (isNaN(timestamp)) {
        logger.warn('Invalid Date object');
        return Date.now();
      }
      return timestamp;
    }

    // Handle string/number conversion
    const date = new Date(publishDate);
    const timestamp = date.getTime();
    if (isNaN(timestamp)) {
      logger.warn(`Invalid date value: ${publishDate}`);
      return Date.now();
    }
    return timestamp;
  } catch (error) {
    logger.error(`Error getting timestamp: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return Date.now();
  }
}

export function sortEntriesByDate(entries: any[]): any[] {
  return entries.sort((a, b) => {
    const timestampA = getPublishTimestamp(a.publishDate);
    const timestampB = getPublishTimestamp(b.publishDate);
    return timestampB - timestampA;
  });
}

export const createXMLParser = () => new XMLParser({
  ignoreAttributes: false,
  parseAttributeValue: true,
  trimValues: true,
  parseTagValue: true,
  textNodeName: 'text'
});