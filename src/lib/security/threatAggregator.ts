import { SECURITY_CONFIG } from '../constants/security.js';
import { OTXClient } from './otxClient.js';
import { OTXApi } from './otxApi.js';
import { supabase } from '../supabase.js';
import type { Threat, ThreatSource } from '../types/security';
import NodeCache from 'node-cache';

export class ThreatAggregator {
  private cache: NodeCache;
  private clients: Map<ThreatSource, any>;
  private falsePositives: Set<string>;
  private otxApi: OTXApi;

  constructor() {
    this.cache = new NodeCache({ stdTTL: SECURITY_CONFIG.CACHE_TTL });
    this.falsePositives = new Set();
    // Initialize all threat sources
    this.clients = new Map([
      ['OTX', new OTXClient()],
      ['GITHUB', {
        getLatestThreats: async () => {
          const { fetchGitHubFeed, processGitHubFeed } = await import('../feed/githubFeed');
          const feedData = await fetchGitHubFeed();
          return processGitHubFeed(feedData);
        }
      }],
      ['ENDLESS_FRACTAL', {
        getLatestThreats: async () => {
          const response = await fetch('https://raw.githubusercontent.com/EndlessFractal/Threat-Intel-Feed/main/feed.xml');
          if (!response.ok) throw new Error('Failed to fetch EndlessFractal feed');
          return this.processEndlessFractalFeed(await response.text());
        }
      }]
    ]);
    try {
      this.otxApi = new OTXApi();
    } catch (error) {
      console.warn('OTX API initialization failed:', error);
    }
  }

  private async processEndlessFractalFeed(xml: string): Promise<Threat[]> {
    try {
      const Parser = (await import('rss-parser')).default;
      const parser = new Parser();
      const feed = await parser.parseString(xml);
      
      return feed.items.map(item => ({
        id: item.guid || crypto.randomUUID(),
        title: item.title || 'Unknown Threat',
        description: item.description || item.content || '',
        severity: this.determineSeverityFromContent(item.title || '', item.description || ''),
        cvss: this.calculateCVSSFromContent(item.title || '', item.description || ''),
        category: 'vulnerability',
        timestamp: new Date(item.pubDate || item.isoDate || new Date()).toISOString(),
        mitigation: this.extractMitigationFromContent(item.description || ''),
        sourceUrl: item.link,
        source: 'ENDLESS_FRACTAL'
      }));
    } catch (error) {
      console.error('Failed to process EndlessFractal feed:', error);
      return [];
    }
  }

  private determineSeverityFromContent(title: string, description: string): 'critical' | 'high' | 'medium' | 'low' {
    const content = `${title} ${description}`.toLowerCase();
    if (content.includes('critical')) return 'critical';
    if (content.includes('high')) return 'high';
    if (content.includes('medium')) return 'medium';
    return 'low';
  }

  private calculateCVSSFromContent(title: string, description: string): number {
    const content = `${title} ${description}`.toLowerCase();
    let score = 5.0;
    
    if (content.includes('critical')) score += 3;
    if (content.includes('remote')) score += 1;
    if (content.includes('exploit')) score += 1;
    
    return Math.min(10, Math.max(1, score));
  }

  private extractMitigationFromContent(description: string): string {
    const mitigationMatch = description.match(/(?:mitigation|remediation|fix):\s*(.*?)(?:\n|$)/i);
    return mitigationMatch?.[1] || 'Follow security best practices and monitor for suspicious activity.';
  }

  private determineSeverity(item: Element): 'critical' | 'high' | 'medium' | 'low' {
    const severity = item.getElementsByTagName('severity')[0]?.textContent?.toLowerCase();
    if (severity === 'critical') return 'critical';
    if (severity === 'high') return 'high';
    if (severity === 'medium') return 'medium';
    return 'low';
  }

  private calculateCVSS(item: Element): number {
    const cvss = parseFloat(item.getElementsByTagName('cvss')[0]?.textContent || '5.0');
    return isNaN(cvss) ? 5.0 : Math.min(10, Math.max(1, cvss));
  }

  async aggregateThreats(): Promise<Threat[]> {
    const cacheKey = 'aggregated_threats';
    const cached = this.cache.get<Threat[]>(cacheKey);
    if (cached) return cached;

    // First check Supabase for recent threats
    const { data: existingThreats, error: dbError } = await supabase
      .from('threats')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);

    if (dbError) {
      console.error('Failed to fetch threats from Supabase:', dbError);
    }

    // Fetch new threats from external sources
    const threatPromises = Array.from(this.clients.entries()).map(
      async ([source, client]) => {
        try {
          const threats = await client.getLatestThreats();
          // Store new threats in Supabase
          await this.storeNewThreats(threats);
          return threats.map(threat => ({ ...threat, source }));
        } catch (error) {
          console.error(`Error fetching threats from ${source}:`, error);
          return [];
        }
      }
    );

    const allThreats = await Promise.all(threatPromises);
    const threats = this.processThreats(allThreats.flat());
    
    this.cache.set(cacheKey, threats);
    return threats;
  }

  private async storeNewThreats(threats: Threat[]): Promise<void> {
    for (const threat of threats) {
      // Enrich threat data with OTX indicators if available
      let enrichedThreat = threat;
      if (this.otxApi) {
        try {
          enrichedThreat = await this.otxApi.enrichThreatData(threat);
        } catch (error) {
          console.error('Failed to enrich threat:', error);
        }
      }

      const { error } = await supabase
        .from('public.threats')
        .upsert({
          ...enrichedThreat,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Failed to store threat:', error);
      }
    }
  }

  private processThreats(threats: Threat[]): Threat[] {
    return threats
      .filter(threat => !this.isFalsePositive(threat))
      .sort((a, b) => this.calculatePriority(b) - this.calculatePriority(a));
  }

  private isFalsePositive(threat: Threat): boolean {
    if (this.falsePositives.has(threat.id)) return true;
    
    // Check confidence score if available
    if (threat.confidence && threat.confidence < SECURITY_CONFIG.FALSE_POSITIVE_THRESHOLD) {
      return true;
    }

    return false;
  }

  private calculatePriority(threat: Threat): number {
    let priority = 0;
    
    // Base priority from CVSS
    priority += threat.cvss * 10;
    
    // Adjust based on severity
    const severityMultiplier = {
      critical: 2.0,
      high: 1.5,
      medium: 1.0,
      low: 0.5
    };
    priority *= severityMultiplier[threat.severity];
    
    // Boost priority for certain categories
    if (threat.category === 'ransomware') priority *= 1.5;
    if (threat.category === 'vulnerability') priority *= 1.3;
    
    return priority;
  }

  markAsFalsePositive(threatId: string): void {
    this.falsePositives.add(threatId);
  }

  clearCache(): void {
    this.cache.flushAll();
  }
}