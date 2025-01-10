import { supabase } from '../supabase';
import { FeedLogger } from './logger';
import type { Threat } from '../types/security';
import { SECURITY_CONFIG } from '../constants/security';

const logger = FeedLogger.getInstance();

async function fetchGitHubFeed(): Promise<string> {
  const { GITHUB_TOKEN, GITHUB_FEED_REPO, GITHUB_FEED_BRANCH, GITHUB_FEED_PATH } = SECURITY_CONFIG;
  
  if (!GITHUB_TOKEN) {
    throw new Error('GitHub token not configured');
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_FEED_REPO}/contents/${GITHUB_FEED_PATH}?ref=${GITHUB_FEED_BRANCH}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3.raw',
          'Authorization': `token ${GITHUB_TOKEN}`,
          'User-Agent': 'TechAnchorman Feed Reader/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return await response.text();
  } catch (error) {
    console.error('Failed to fetch GitHub feed:', error);
    throw error;
  }
}

export async function fetchSupabaseFeed(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('threats')
      .eq('source', 'GITHUB')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Failed to fetch GitHub feed:', error);
      throw error;
    }

    return data;
  } catch (error) {
    logger.error('Failed to fetch GitHub feed:', error);
    return [];
  }
}

export async function processGitHubFeed(feedData: any[]): Promise<Threat[]> {
  try {
    const threats = feedData.map(item => ({
      id: item.id || crypto.randomUUID(),
      title: item.title || 'Unknown Threat',
      description: item.description || item.body || 'No description available',
      severity: determineSeverity(item),
      cvss: calculateCVSS(item),
      category: determineCategory(item),
      timestamp: item.created_at,
      mitigation: extractMitigation(item),
      cve: extractCVE(item),
      sourceUrl: item.html_url
    }));

    const { error } = await supabase
      .from('threats')
      .upsert(threats, { 
        onConflict: 'title',
        ignoreDuplicates: true 
      });

    if (error) {
      logger.error('Failed to store threats:', error);
      throw error;
    }

    return threats;
  } catch (error) {
    logger.error('Failed to process GitHub feed:', error);
    return [];
  }
}

function determineSeverity(item: any): 'critical' | 'high' | 'medium' | 'low' {
  const title = item.title?.toLowerCase() || '';
  const body = item.body?.toLowerCase() || '';
  
  if (title.includes('critical') || body.includes('critical')) return 'critical';
  if (title.includes('high') || body.includes('high')) return 'high';
  if (title.includes('medium') || body.includes('medium')) return 'medium';
  return 'low';
}

function calculateCVSS(item: any): number {
  // Basic CVSS calculation based on content
  let score = 5.0; // Base score
  
  const content = `${item.title} ${item.body}`.toLowerCase();
  if (content.includes('critical')) score += 3;
  if (content.includes('remote')) score += 1;
  if (content.includes('exploit')) score += 1;
  
  return Math.min(10, Math.max(1, score));
}

function determineCategory(item: any): string {
  const content = `${item.title} ${item.body}`.toLowerCase();
  
  if (content.includes('malware')) return 'malware';
  if (content.includes('vulnerability')) return 'vulnerability';
  if (content.includes('phishing')) return 'phishing';
  if (content.includes('ransomware')) return 'ransomware';
  
  return 'other';
}

function extractMitigation(item: any): string {
  const content = item.body || '';
  const mitigationMatch = content.match(/(?:mitigation|remediation|fix):\s*(.*?)(?:\n|$)/i);
  return mitigationMatch?.[1] || 'Follow security best practices and monitor for suspicious activity.';
}

function extractCVE(item: any): string | undefined {
  // Try to find CVE in title first
  const titleMatch = item.title?.match(/CVE-\d{4}-\d{4,7}/i);
  if (titleMatch) return titleMatch[0];

  // Try to find CVE in description/body
  const bodyMatch = item.body?.match(/CVE-\d{4}-\d{4,7}/i);
  if (bodyMatch) return bodyMatch[0];

  // Check if there's an explicit CVE ID field
  if (item.cve_id) return item.cve_id;

  return undefined;
}

export { fetchGitHubFeed };