import type { APIRoute } from 'astro';
import { FeedAggregator } from '../../lib/feed/aggregator';

export const GET: APIRoute = async ({ request }) => {
  try {
    const aggregator = new FeedAggregator();
    const entries = await aggregator.aggregateFeeds();
    const rss = aggregator.generateRSS(entries);

    return new Response(rss, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300', // 5 minutes
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET'
      }
    });
  } catch (error) {
    console.error('Failed to generate RSS feed:', error);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Error</title>
    <description>Failed to generate feed: ${error instanceof Error ? error.message : 'Unknown error'}</description>
  </channel>
</rss>`, 
      {
        status: 500,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'no-store'
        }
      }
    );
  }
};