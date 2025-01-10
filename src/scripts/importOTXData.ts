import * as dotenv from 'dotenv';
dotenv.config();

import { OTXClient } from '../lib/security/otxClient';
import { supabase } from '../lib/supabase.js';
import { FeedLogger } from '../lib/feed/logger';

const logger = FeedLogger.getInstance();

async function importOTXData() {
  try {
    logger.info('Starting OTX data import');
    
    const client = new OTXClient();
    const threats = await client.getLatestThreats();

    if (!threats || threats.length === 0) {
      logger.warn('No threats found from OTX');
      process.exit(0);
    }

    logger.info(`Found ${threats.length} threats from OTX`);

    const { error } = await supabase
      .from('threats')
      .upsert(threats, { 
        onConflict: 'id',
        ignoreDuplicates: true 
      });

    if (error) {
      logger.error('Failed to store threats:', error);
      throw error;
    }
    logger.info(`Successfully imported ${threats.length} threats from OTX`);
  } catch (error) {
    logger.error('Failed to import OTX data:', error);
    process.exit(1);
  }
}

importOTXData();