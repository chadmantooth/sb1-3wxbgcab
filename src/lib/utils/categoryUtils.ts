import { type NewsCategory, NEWS_CATEGORIES } from '../constants/categories';

const CATEGORY_KEYWORDS: Record<NewsCategory, string[]> = {
  [NEWS_CATEGORIES.DRILLING]: [
    'drilling', 'drill bit', 'wellbore', 'rig', 'drilling fluid',
    'directional drilling', 'mud', 'bha', 'bottom hole'
  ],
  [NEWS_CATEGORIES.EXPLORATION]: [
    'exploration', 'seismic', 'survey', 'prospect', 'basin',
    'geological', 'geophysical', 'hydrocarbon', 'reserves', 'offshore',
    'deepwater', 'underwater', 'marine', 'subsea', 'lng', 'gas'
  ],
  [NEWS_CATEGORIES.PRODUCTION]: [
    'production', 'well completion', 'artificial lift', 'enhanced recovery',
    'flow rate', 'wellhead', 'production optimization', 'floating',
    'platform', 'riser', 'fpso'
  ],
  [NEWS_CATEGORIES.RESERVOIR]: [
    'reservoir', 'formation', 'porosity', 'permeability', 'geology',
    'pressure', 'fluid', 'rock', 'characterization'
  ],
  [NEWS_CATEGORIES.DIGITAL_OILFIELD]: [
    'digital oilfield', 'smart field', 'intelligent field', 'automation',
    'real-time', 'monitoring', 'optimization', 'digitalisation', 'digitalization'
  ],
  [NEWS_CATEGORIES.IOT]: [
    'iot', 'sensor', 'connected device', 'smart field', 'wireless sensor'
  ],
  [NEWS_CATEGORIES.CYBERSECURITY]: [
    'security', 'cyber', 'threat', 'breach', 'protection'
  ],
  [NEWS_CATEGORIES.AI]: [
    'ai', 'artificial intelligence', 'machine learning', 'ml', 'predictive'
  ],
  [NEWS_CATEGORIES.DATA_ANALYTICS]: [
    'analytics', 'data analysis', 'visualization', 'monitoring'
  ],
  [NEWS_CATEGORIES.SUSTAINABILITY]: [
    'green', 'renewable', 'carbon', 'emission', 'sustainable'
  ],
  [NEWS_CATEGORIES.OTHER]: []
};

export function categorizeContent(title: string, summary: string): NewsCategory {
  const content = `${title} ${summary}`.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(keyword => content.includes(keyword))) {
      return category as NewsCategory;
    }
  }

  return NEWS_CATEGORIES.OTHER;
}