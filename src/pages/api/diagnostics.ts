import type { APIRoute } from 'astro';
import { runFeedDiagnostics } from '../../lib/feed/diagnostics';

export const GET: APIRoute = async () => {
  try {
    const results = await runFeedDiagnostics();
    
    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Diagnostics failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};