import { parseXML } from '../xmlParser.js';
import type { FeedSource } from '../../constants/feedSources.js';

export async function parseOPML(xml: string): Promise<FeedSource[]> {
  const result = await parseXML(xml);
  
  if (!result?.opml?.body?.outline?.[0]?.outline) {
    throw new Error('Invalid OPML structure');
  }

  return result.opml.body.outline[0].outline
    .filter(item => item.$.xmlUrl)
    .map(item => ({
      name: item.$.title || item.$.text,
      type: 'rss' as const,
      url: item.$.xmlUrl,
      vendor: item.$.title || item.$.text
    }));
}