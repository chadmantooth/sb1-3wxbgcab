import { SECURITY_CONFIG, SEVERITY_MAPPING } from '../constants/security.js';
import type { Threat } from '../types/security';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: SECURITY_CONFIG.CACHE_TTL });

export class OTXClient {
  private headers: HeadersInit;

  constructor() {    
    if (!SECURITY_CONFIG.OTX_API_KEY) {
      console.warn('OTX API key not configured, using mock data');
      return;
    }
    
    this.headers = {
      'X-OTX-API-KEY': SECURITY_CONFIG.OTX_API_KEY,
      'Accept': 'application/json'
    };
  }

  async getLatestThreats(): Promise<Threat[]> {
    if (!SECURITY_CONFIG.OTX_API_KEY) {
      return this.getMockThreats(); // Return mock data when API key is not configured
    }

    const cacheKey = 'latest_threats';
    const cached = cache.get<Threat[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${SECURITY_CONFIG.API_BASE_URL}/pulses/subscribed`, {
        headers: this.headers,
        timeout: SECURITY_CONFIG.REQUEST_TIMEOUT
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const threats = this.transformPulses(data.results);
      
      cache.set(cacheKey, threats);
      return threats;
    } catch (error) {
      console.error('Failed to fetch threats:', error);
      throw error;
    }
  }

  private transformPulses(pulses: any[]): Threat[] {
    return pulses.map(pulse => ({
      id: pulse.id,
      title: pulse.name,
      description: pulse.description,
      severity: this.calculateSeverity(pulse),
      cvss: this.calculateCVSS(pulse),
      category: this.determineCategory(pulse),
      timestamp: pulse.created,
      mitigation: this.extractMitigation(pulse),
      indicators: pulse.indicators || [],
      references: pulse.references || []
    }));
  }

  private calculateSeverity(pulse: any): string {
    if (pulse.TLP === 'RED') return SEVERITY_MAPPING.Critical;
    if (pulse.adversary) return SEVERITY_MAPPING.High;
    if (pulse.targeted_countries?.length > 0) return SEVERITY_MAPPING.Medium;
    return SEVERITY_MAPPING.Low;
  }

  private calculateCVSS(pulse: any): number {
    // Basic CVSS calculation based on pulse attributes
    let score = 5.0; // Base score
    
    if (pulse.TLP === 'RED') score += 3;
    if (pulse.adversary) score += 2;
    if (pulse.targeted_countries?.length > 0) score += 1;
    
    return Math.min(10, Math.max(1, score));
  }

  private determineCategory(pulse: any): string {
    const tags = pulse.tags?.map((t: string) => t.toLowerCase()) || [];
    
    if (tags.includes('malware')) return 'malware';
    if (tags.includes('ransomware')) return 'ransomware';
    if (tags.includes('phishing')) return 'phishing';
    if (tags.includes('vulnerability')) return 'vulnerability';
    
    return 'other';
  }

  private extractMitigation(pulse: any): string {
    const mitigation = pulse.description?.match(/(?:mitigation|remediation):\s*(.*?)(?:\n|$)/i)?.[1];
    return mitigation || 'Follow security best practices and monitor for suspicious activity.';
  }

  private getMockThreats(): Threat[] {
    return [
      {
        id: 'mock-1',
        title: 'Demo Critical Threat',
        description: 'This is a demonstration threat for testing purposes.',
        severity: 'critical',
        cvss: 9.8,
        category: 'malware',
        timestamp: new Date().toISOString(),
        mitigation: 'This is a mock threat - no action required.'
      },
      {
        id: 'mock-2',
        title: 'Demo High Severity Threat',
        description: 'Another demonstration threat for testing.',
        severity: 'high',
        cvss: 8.5,
        category: 'vulnerability',
        timestamp: new Date().toISOString(),
        mitigation: 'This is a mock threat - no action required.'
      }
    ];
  }
}