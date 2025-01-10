export const NEWS_CATEGORIES = {
  // Core Operations
  DRILLING: 'Drilling & Wells',
  PRODUCTION: 'Production & Operations',
  RESERVOIR: 'Reservoir Management',
  
  // Technology
  DIGITAL: 'Digital Technology',
  DATA_ANALYTICS: 'Data & Analytics',
  AUTOMATION: 'Automation & Control',
  
  // Strategic
  EXPLORATION: 'Exploration',
  SUSTAINABILITY: 'Sustainability',
  ENERGY_TRANSITION: 'Energy Transition',
  
  // Other
  OTHER: 'Other'
} as const;

export type NewsCategory = typeof NEWS_CATEGORIES[keyof typeof NEWS_CATEGORIES];

export const CATEGORY_LIST = Object.values(NEWS_CATEGORIES);