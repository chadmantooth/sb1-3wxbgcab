import { SECURITY_CONFIG } from '../constants/security';
import type { Threat } from '../types/security';
import fetch from 'node-fetch';

export class OTXFetcher {
  private baseUrl: string;
  private headers: HeadersInit;

  constructor() {
    if (!SECURITY_CONFIG.OTX_API_KEY) {
      throw new Error('OTX API key not configured');
    }
    
    this.baseUrl = 'https://otx.alienvault.com/api/v1';
    this.headers = {
      'X-OTX-API-KEY': SECURITY_CONFIG.OTX_API_KEY,
      'Accept': 'application/json'
    };
  }

  async fetchLatestPulses(): Promise<Threat[]> {
    try {
      const response = await fetch(`${this.baseUrl}/pulses/subscribed`, {
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.results.map(this.transformPulse);
    } catch (error) {
      console.error('Failed to fetch OTX pulses:', error);
      throw error;
    }
  }

  private transformPulse(pulse: any): Threat {
    return {
      id: pulse.id,
      title: pulse.name,
      description: pulse.description,
      severity: calculateSeverity(pulse),
      cvss: calculateCVSS(pulse),
      category: determineCategory(pulse),
      timestamp: new Date(pulse.created).toISOString(),
      mitigation: extractMitigation(pulse)
    };
  }
}

function calculateSeverity(pulse: any): 'critical' | 'high' | 'medium' | 'low' {
  if (pulse.TLP === 'RED') return 'critical';
  if (pulse.adversary) return 'high';
  if (pulse.targeted_countries?.length > 0) return 'medium';
  return 'low';
}

function calculateCVSS(pulse: any): number {
  let score = 5.0;
  if (pulse.TLP === 'RED') score += 3;
  if (pulse.adversary) score += 2;
  if (pulse.targeted_countries?.length > 0) score += 1;
  return Math.min(10, Math.max(1, score));
}

function determineCategory(pulse: any): string {
  const tags = pulse.tags?.map((t: string) => t.toLowerCase()) || [];
  if (tags.includes('malware')) return 'malware';
  if (tags.includes('ransomware')) return 'ransomware';
  if (tags.includes('phishing')) return 'phishing';
  if (tags.includes('vulnerability')) return 'vulnerability';
  return 'other';
}

function extractMitigation(pulse: any): string {
  const mitigation = pulse.description?.match(/(?:mitigation|remediation):\s*(.*?)(?:\n|$)/i)?.[1];
  return mitigation || 'Follow security best practices and monitor for suspicious activity.';
}