export interface FeedSource {
  name: string;
  type: 'rss' | 'api' | 'scrape';
  url: string;
  category: string;
  vendor?: string;
}

export const feedSources: FeedSource[] = [
  // Energy Transition Sources
  {
    name: 'Energy Transition News',
    type: 'rss',
    url: 'https://www.rechargenews.com/rss',
    category: 'Energy Transition'
  },
  {
    name: 'Renewable Energy World',
    type: 'rss',
    url: 'https://www.renewableenergyworld.com/feed',
    category: 'Energy Transition'
  },
  {
    name: 'Clean Energy Wire',
    type: 'rss',
    url: 'https://www.cleanenergywire.org/rss.xml',
    category: 'Energy Transition'
  },
];