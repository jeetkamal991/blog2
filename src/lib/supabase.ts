import { createClient } from '@supabase/supabase-js';

// Default Supabase project credentials provided by the user
export const DEFAULT_SUPABASE_URL = "https://andtmfgdyrdyrmsuzcjn.supabase.co";
export const DEFAULT_SUPABASE_KEY = "sb_publishable_41GzkOV3yuFvpC8kEl_ZSg_1Ic06kTm";

// Client retrieves either configured environment variable or defaults to provided project
const meta = import.meta as unknown as { env?: Record<string, string> };
const supabaseUrl = meta.env?.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseKey = meta.env?.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

