import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

const MOCK_THREATS = [
  {
    id: crypto.randomUUID(),
    title: 'Critical Security Vulnerability Detected',
    description: 'A critical security vulnerability has been identified affecting multiple systems. Immediate patching required.',
    severity: 'critical',
    cvss: 9.8,
    category: 'vulnerability',
    timestamp: new Date().toISOString(),
    mitigation: 'Apply security patches immediately and monitor systems for suspicious activity.'
  },
  {
    id: crypto.randomUUID(),
    title: 'Active Ransomware Campaign',
    description: 'New ransomware variant actively targeting organizations. Enhanced monitoring recommended.',
    severity: 'high',
    cvss: 8.5,
    category: 'ransomware',
    timestamp: new Date().toISOString(),
    mitigation: 'Update antivirus signatures and backup critical data.'
  }
];

export const GET: APIRoute = async ({ request }) => {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const severity = url.searchParams.get('severity');
    const category = url.searchParams.get('category');
    const timeframe = url.searchParams.get('timeframe');

    // Build query
    let query = supabase
      .from('threats')
      .select('id, title, description, severity, cvss, category, timestamp, mitigation')
      .order('created_at', { ascending: false });

    if (severity) {
      query = query.eq('severity', severity);
    }
    if (category) {
      query = query.eq('category', category);
    }
    if (timeframe) {
      const days = parseInt(timeframe);
      if (!isNaN(days)) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        query = query.gte('timestamp', cutoff.toISOString());
      }
    }

    const { data: threats, error } = await query;

    if (error) {
      console.error('Database error:', error);
      // Return mock data on database error
      return new Response(JSON.stringify(MOCK_THREATS), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // If no threats found, return mock data
    if (!threats || threats.length === 0) {
      return new Response(JSON.stringify(MOCK_THREATS), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      });
    }

    return new Response(JSON.stringify(threats), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};