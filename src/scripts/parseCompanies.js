import { parseCompaniesCSV } from '../lib/parsers/csvParser.ts';
import { scrapeAllCompanies } from '../lib/scrapers/newsScraper.ts';
import fs from 'fs/promises';
import path from 'path';

async function main() {
  try {
    // Parse companies from CSV
    const companies = parseCompaniesCSV('companies.csv');
    
    // Scrape news from all companies
    const news = await scrapeAllCompanies(companies);
    
    // Save news items
    const contentDir = path.join(process.cwd(), 'src/content/news');
    await fs.mkdir(contentDir, { recursive: true });

    for (const item of news) {
      const fileName = `${item.publishDate.getTime()}-${slugify(item.title)}.json`;
      await fs.writeFile(
        path.join(contentDir, fileName),
        JSON.stringify(item, null, 2)
      );
    }

    console.log(`Scraped and saved ${news.length} news items`);

  } catch (error) {
    console.error('Error:', error);
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

main();