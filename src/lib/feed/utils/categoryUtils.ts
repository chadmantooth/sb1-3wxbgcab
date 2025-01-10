import { type NewsCategory, NEWS_CATEGORIES } from '../../constants/categories';

const CATEGORY_KEYWORDS: Record<NewsCategory, string[]> = {
  [NEWS_CATEGORIES.DRILLING]: [
    'drilling', 'drill bit', 'wellbore', 'rig', 'drilling fluid',
    'directional drilling', 'mud', 'bha', 'bottom hole'
  ],
  [NEWS_CATEGORIES.PRODUCTION]: [
    'production', 'operations', 'well completion', 'artificial lift',
    'enhanced recovery', 'flow rate', 'wellhead', 'optimization'
  ],
  [NEWS_CATEGORIES.RESERVOIR]: [
    'reservoir', 'formation', 'porosity', 'permeability',
    'pressure', 'fluid', 'rock', 'characterization'
  ],
  [NEWS_CATEGORIES.DIGITAL]: [
    'digital', 'smart field', 'intelligent field', 'automation',
    'real-time', 'monitoring', 'digitalization'
  ],
  [NEWS_CATEGORIES.DATA_ANALYTICS]: [
    'analytics', 'data analysis', 'visualization', 'monitoring',
    'machine learning', 'ai', 'artificial intelligence'
  ],
  [NEWS_CATEGORIES.AUTOMATION]: [
    'automation', 'control system', 'plc', 'scada', 'robotics',
    'autonomous', 'automated'
  ],
  [NEWS_CATEGORIES.EXPLORATION]: [
    'exploration', 'seismic', 'survey', 'prospect', 'basin',
    'geological', 'geophysical'
  ],
  [NEWS_CATEGORIES.SUSTAINABILITY]: [
    'sustainable', 'environmental', 'emissions', 'carbon',
    'green', 'climate', 'renewable'
  ],
  [NEWS_CATEGORIES.ENERGY_TRANSITION]: [
    'energy transition', 'renewable', 'clean energy', 'decarbonization',
    'net zero', 'alternative energy'
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