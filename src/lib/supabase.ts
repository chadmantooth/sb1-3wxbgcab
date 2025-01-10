import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://laqqbwjoxomivqpnmcpr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhcXFid2pveG9taXZxcG5tY3ByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ1NjY0MDAsImV4cCI6MjAyMDE0MjQwMH0.LYc1tL48LwwIWwOoYhMoHW_2nBvXbV-0JLGXXJVnPeE';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});