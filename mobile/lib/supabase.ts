import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const SUPABASE_URL = Constants.expoConfig?.extra?.SUPABASE_URL;
const SUPABASE_KEY = Constants.expoConfig?.extra?.SUPABASE_KEY;
console.log(SUPABASE_KEY, SUPABASE_URL)

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('SUPABASE_URL and SUPABASE_KEY must be set in app.config.js');
}

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
