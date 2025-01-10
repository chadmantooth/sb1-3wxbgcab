export interface Threat {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  cvss: number;
  category: string;
  timestamp: string;
  mitigation?: string;
  source?: string;
  indicators?: ThreatIndicator[];
}

export interface ThreatIndicator {
  type: string;
  value: string;
  confidence: number;
}

export interface ThreatStats {
  critical: number;
  high: number;
  medium: number;
  low: number;
  total: number;
  avgCvss: number;
}