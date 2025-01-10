import { supabase } from '../supabase';

const INITIAL_THREATS = [
  {
    title: 'Critical Zero-Day Vulnerability in Industrial Control Systems',
    description: 'A newly discovered vulnerability affects multiple ICS vendors, potentially allowing remote code execution.',
    severity: 'critical',
    cvss: 9.8,
    category: 'vulnerability',
    mitigation: 'Apply vendor patches immediately. Isolate affected systems from network access until patched.'
  },
  {
    title: 'Ransomware Campaign Targeting Energy Sector',
    description: 'New ransomware variant specifically targeting energy sector companies through phishing campaigns.',
    severity: 'high',
    cvss: 8.5,
    category: 'ransomware',
    mitigation: 'Update email filtering rules. Train staff on phishing awareness. Ensure backup systems are isolated.'
  },
  {
    title: 'Suspicious Network Scanning Activity',
    description: 'Increased port scanning activity detected across multiple industrial networks.',
    severity: 'medium',
    cvss: 6.5,
    category: 'reconnaissance',
    mitigation: 'Review firewall rules. Enable network monitoring. Block suspicious IP ranges.'
  }
];

export async function seedThreats() {
  const { error } = await supabase
    .from('threats')
    .upsert(
      INITIAL_THREATS.map(threat => ({
        ...threat,
        timestamp: new Date().toISOString()
      }))
    );

  if (error) {
    console.error('Error seeding threats:', error);
    throw error;
  }
}