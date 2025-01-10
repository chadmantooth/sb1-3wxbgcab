export const MOCK_THREATS = [
  {
    id: crypto.randomUUID(),
    title: 'Critical Security Vulnerability Detected',
    description: 'A critical security vulnerability has been identified affecting multiple systems. Immediate patching required.',
    severity: 'critical',
    cvss: 9.8,
    category: 'vulnerability',
    pubDate: new Date().toISOString(),
    source: 'Security Advisory',
    mitigation: 'Apply security patches immediately and monitor systems for suspicious activity.'
  },
  {
    id: crypto.randomUUID(),
    title: 'Active Ransomware Campaign',
    description: 'New ransomware variant actively targeting organizations. Enhanced monitoring recommended.',
    severity: 'high',
    cvss: 8.5,
    category: 'ransomware',
    pubDate: new Date().toISOString(),
    source: 'Threat Intelligence',
    mitigation: 'Update antivirus signatures and backup critical data.'
  },
  {
    id: crypto.randomUUID(),
    title: 'Phishing Campaign Detected',
    description: 'Sophisticated phishing campaign targeting corporate credentials. User awareness training advised.',
    severity: 'medium',
    cvss: 6.5,
    category: 'phishing',
    pubDate: new Date().toISOString(),
    source: 'Security Alert',
    mitigation: 'Conduct security awareness training and implement email filtering.'
  }
];