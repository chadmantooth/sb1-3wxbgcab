import { XMLParser } from 'fast-xml-parser';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import { createHash } from 'crypto';

const FEED_URL = 'https://rss.feedspot.com/folder/5hrIsmIb6A==/rss/rsscombiner';
const MAX_ARTICLES = 20;
const DAYS_LIMIT = 7;

const parser = new XMLParser({
  ignoreAttributes: false,
  parseAttributeValue: true,
  trimValues: true
});

class FeedProcessor {
  constructor() {
    this.seenArticles = new Map();
  }

  generateArticleId(title, link) {
    const content = `${title}${link}`;
    return createHash('md5').update(content).digest('hex');
  }

  isWithinTimeLimit(pubDate) {
    if (!pubDate) return false;
    const date = new Date(pubDate);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - DAYS_LIMIT);
    return date > cutoff;
  }

  async fetchFeed() {
    try {
      const response = await fetch(FEED_URL, {
        headers: {
          'User-Agent': 'TechAnchorman Feed Reader/1.0',
          'Accept': 'application/rss+xml, application/xml, text/xml, */*'
        },
        timeout: 10000
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const xml = await response.text();
      const result = parser.parse(xml);

      if (!result?.rss?.channel?.item) {
        throw new Error('Invalid feed structure');
      }

      const items = Array.isArray(result.rss.channel.item) 
        ? result.rss.channel.item 
        : [result.rss.channel.item];

      const articles = items
        .filter(item => {
          if (!item.title || !item.link) return false;
          if (!this.isWithinTimeLimit(item.pubDate)) return false;
          
          const id = this.generateArticleId(item.title, item.link);
          if (this.seenArticles.has(id)) return false;
          
          this.seenArticles.set(id, true);
          return true;
        })
        .map(item => ({
          title: item.title,
          link: item.link,
          description: item.description || '',
          pubDate: item.pubDate,
          creator: item['dc:creator'] || 'Unknown'
        }))
        .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
        .slice(0, MAX_ARTICLES);

      return articles;
    } catch (error) {
      console.error('Failed to fetch feed:', error);
      throw error;
    }
  }
}

async function main() {
  try {
    const processor = new FeedProcessor();
    const articles = await processor.fetchFeed();
    
    await fs.writeFile(
      'processed_feed.json',
      JSON.stringify({
        timestamp: new Date().toISOString(),
        articleCount: articles.length,
        articles
      }, null, 2)
    );

    console.log(`Successfully processed ${articles.length} articles`);
  } catch (error) {
    console.error('Failed to process feed:', error);
    process.exit(1);
  }
}

main();