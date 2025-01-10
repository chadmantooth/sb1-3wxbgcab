import { parseThreatFeed, type ThreatFeedItem } from '../feed/threatFeedParser';

const MAX_ENTRIES = 100;
const CACHE_KEY = 'processed_entries';
const MAX_LINKS_TO_KEEP = 100;

// Cache management
const memoryCache = new Map<string, Set<string>>();

function getProcessedEntries(): Set<string> {
  try {
    // Check memory cache first
    if (memoryCache.has(CACHE_KEY)) {
      return memoryCache.get(CACHE_KEY)!;
    }

    const entries = localStorage.getItem(CACHE_KEY);
    const parsedEntries = entries ? JSON.parse(entries) : [];
    // Keep only the most recent entries
    if (parsedEntries.length > MAX_LINKS_TO_KEEP) {
      parsedEntries.splice(0, parsedEntries.length - MAX_LINKS_TO_KEEP);
      localStorage.setItem(CACHE_KEY, JSON.stringify(parsedEntries));
    }
    const entriesSet = new Set(parsedEntries);
    memoryCache.set(CACHE_KEY, entriesSet);
    return entriesSet;
  } catch {
    return new Set();
  }
}

function addProcessedEntry(url: string) {
  const entries = getProcessedEntries();
  entries.add(url);
  
  // Trim to keep only most recent entries
  const entriesArray = Array.from(entries);
  if (entriesArray.length > MAX_ENTRIES) {
    entriesArray.splice(0, entriesArray.length - MAX_ENTRIES);
  }
  
  localStorage.setItem(CACHE_KEY, JSON.stringify(entriesArray));
}

export interface Threat {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  cvss: number;
  category: string;
  timestamp: string;
  mitigation?: string;
  url?: string;
}

export class ThreatFetchError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'ThreatFetchError';
  }
}

export async function fetchThreats(): Promise<Threat[]> {
  try {
    const processedEntries = getProcessedEntries();
    const entries = await parseThreatFeed();

    if (!entries.length) {
      throw new ThreatFetchError('No threat data available', 'NO_DATA');
    }

    const threats = entries
      .filter((item: ThreatFeedItem) => {
        const url = item.link || item.id;
        return url && !processedEntries.has(url);
      })
      .map((item: ThreatFeedItem) => {
        const url = item.link || item.id;
        if (url) {
          addProcessedEntry(url);
        }

        return {
          id: item.id,
          title: item.title,
          description: item.description,
          severity: determineSeverity(item.title, item.description),
          cvss: calculateCVSS(item.title, item.description),
          category: item.category || determineCategory(item.title, item.description),
          timestamp: new Date(item.pubDate).toISOString(),
          mitigation: extractMitigation(item.description),
          source: item.source,
          url
        };
      });

    return threats;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    if (error instanceof ThreatFetchError) {
      throw error;
    }
    throw new ThreatFetchError(
      `Failed to fetch threat data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'FETCH_ERROR'
    );
  }
}

function determineSeverity(title: string = '', description: string = ''): 'critical' | 'high' | 'medium' | 'low' {
  const content = `${title} ${description}`.toLowerCase();
  
  if (content.includes('critical') || content.includes('severe')) return 'critical';
  if (content.includes('high') || content.includes('important')) return 'high';
  if (content.includes('medium') || content.includes('moderate')) return 'medium';
  return 'low';
}

function calculateCVSS(title: string = '', description: string = ''): number {
  const content = `${title} ${description}`.toLowerCase();
  let score = 5.0; // Base score
  
  // Severity indicators
  if (content.includes('critical')) score += 3;
  if (content.includes('high')) score += 2;
  
  // Impact indicators
  if (content.includes('remote code execution')) score += 2;
  if (content.includes('privilege escalation')) score += 1.5;
  if (content.includes('data breach')) score += 1;
  
  // Exploit indicators
  if (content.includes('actively exploited')) score += 1.5;
  if (content.includes('proof of concept')) score += 1;
  if (content.includes('exploit available')) score += 1;
  
  return Math.min(10, Math.max(1, score));
}

function determineCategory(title: string = '', description: string = ''): string {
  const content = `${title} ${description}`.toLowerCase();
  
  if (content.includes('malware') || content.includes('virus') || content.includes('trojan')) {
    return 'malware';
  }
  if (content.includes('vulnerability') || content.includes('exploit') || content.includes('cve')) {
    return 'vulnerability';
  }
  if (content.includes('phishing') || content.includes('social engineering')) {
    return 'phishing';
  }
  if (content.includes('ransomware') || content.includes('encryption')) {
    return 'ransomware';
  }
  if (content.includes('ddos') || content.includes('denial of service')) {
    return 'ddos';
  }
  
  return 'other';
}

function extractMitigation(description: string = ''): string {
  // Look for mitigation sections in the description
  const mitigationPatterns = [
    /(?:mitigation|remediation|fix|solution):\s*(.*?)(?:\n|$)/i,
    /(?:recommended actions?):\s*(.*?)(?:\n|$)/i,
    /(?:what to do):\s*(.*?)(?:\n|$)/i
  ];

  for (const pattern of mitigationPatterns) {
    const match = description.match(pattern);
    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return 'Follow security best practices and monitor for suspicious activity.';
}