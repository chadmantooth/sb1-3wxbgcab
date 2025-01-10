import type { APIRoute } from 'astro';
import { PersonalizedFeedService } from '../../lib/feed/personalizedFeed';

export const GET: APIRoute = async () => {
  try {
    const feedService = new PersonalizedFeedService();
    const items = await feedService.getPersonalizedFeed();

    return new Response(JSON.stringify(items), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch personalized feed',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};