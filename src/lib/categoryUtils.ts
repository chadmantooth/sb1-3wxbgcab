export function categorizeContent(title: string, summary: string): string {
  const keywords = {
    IoT: ['iot', 'sensor', 'connected device', 'smart field', 'wireless sensor'],
    Cybersecurity: ['security', 'cyber', 'threat', 'breach', 'protection', 'ransomware'],
    Networking: ['network', '5g', 'connectivity', 'wireless', 'satellite'],
    Sustainability: ['green', 'renewable', 'carbon', 'emission', 'sustainable', 'clean energy'],
    Storage: ['storage', 'data center', 'cloud storage', 'data management'],
    AI: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'predictive analytics'],
    DataAnalytics: ['analytics', 'data analysis', 'visualization', 'real-time monitoring'],
    Exploration: ['exploration', 'seismic', 'drilling', 'reservoir', 'well data', 'subsurface'],
    Technology: ['digital transformation', 'automation', 'digital twin', 'smart field']
  };

  const content = `${title} ${summary}`.toLowerCase();
  
  for (const [category, terms] of Object.entries(keywords)) {
    if (terms.some(term => content.includes(term))) {
      return category;
    }
  }

  return 'Technology';
}