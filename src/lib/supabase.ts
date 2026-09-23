import { createClient } from '@supabase/supabase-js';

// Default Supabase project endpoints provided by user
export const DEFAULT_SUPABASE_URL = "https://andtmfgdyrdyrmsuzcjn.supabase.co";
export const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_41GzkOV3yuFvpC8kEl_ZSg_1Ic06kTm";

// Detect Next.js client/server environment variables safely
const supabaseUrl = 
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  DEFAULT_SUPABASE_URL;

const supabaseAnonKey = 
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  DEFAULT_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
