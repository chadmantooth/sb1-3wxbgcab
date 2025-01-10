import { SECURITY_CONFIG } from '../constants/security.js';
import type { Threat } from '../types/security';
import { FeedLogger } from '../feed/logger.js';

const logger = FeedLogger.getInstance();

export class OTXApi {
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

  async getPulseIndicators(pulseId: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/pulses/${pulseId}/indicators`, {
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.map((indicator: any) => ({
        indicator: indicator.indicator,
        type: indicator.type
      }));
    } catch (error) {
      logger.error('Failed to fetch pulse indicators:', error);
      throw error;
    }
  }

  async getIndicatorDetails(type: string, indicator: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/indicators/${type}/${indicator}`, 
        { headers: this.headers }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Failed to fetch indicator details:', error);
      throw error;
    }
  }

  async enrichThreatData(threat: Threat): Promise<Threat> {
    try {
      // If we have indicators, fetch additional details
      if (threat.indicators?.length) {
        const enrichedIndicators = await Promise.all(
          threat.indicators.map(async (indicator) => {
            const details = await this.getIndicatorDetails(
              indicator.type,
              indicator.indicator
            );
            return { ...indicator, details };
          })
        );
        
        return { ...threat, indicators: enrichedIndicators };
      }
      
      return threat;
    } catch (error) {
      logger.error('Failed to enrich threat data:', error);
      return threat;
    }
  }
}