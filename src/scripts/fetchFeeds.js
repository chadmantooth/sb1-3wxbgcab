import { feedSources } from '../lib/feedSources.ts';
import { parseRSSFeed } from '../lib/feedParsers/rssParser.ts';
import { scrapeOilGasTech } from '../lib/scrapers/oilGasScraper.ts';
import { categorizeContent } from '../lib/categoryUtils.ts';
import fs from 'fs/promises';
import path from 'path';

async function fetchAllFeeds() {
  const newsItems = [];

  // Fetch RSS feeds
  for (const source of feedSources) {
    try {
      let items = [];
      
      switch (source.type) {
        case 'rss':
          items = await parseRSSFeed(source);
          break;
      }

      // Categorize content
      items = items.map(item => ({
        ...item,
        category: categorizeContent(item.title, item.summary)
      }));

      newsItems.push(...items);
    } catch (error) {
      console.error(`Error fetching feed ${source.name}:`, error);
    }
  }

  // Scrape additional oil & gas tech news
  const scrapedNews = await scrapeOilGasTech();
  newsItems.push(...scrapedNews);

  // Sort by date (newest first)
  newsItems.sort((a, b) => b.publishDate - a.publishDate);

  // Save to JSON files
  const contentDir = path.join(process.cwd(), 'src/content/news');
  
  try {
    await fs.mkdir(contentDir, { recursive: true });

    for (const item of newsItems) {
      const fileName = `${item.publishDate.getTime()}-${slugify(item.title)}.json`;
      await fs.writeFile(
        path.join(contentDir, fileName),
        JSON.stringify(item, null, 2)
      );
    }
  } catch (error) {
    console.error('Error saving news items:', error);
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

fetchAllFeeds().catch(console.error);