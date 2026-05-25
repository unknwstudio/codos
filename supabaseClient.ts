import { createClient } from '@supabase/supabase-js';

// Prefer environment configuration (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY,
// declared in vite-env.d.ts and wired in vite.config.ts). Fall back to the
// current project defaults so existing deploys keep working if the env vars
// are unset. The anon key is a publishable key and is safe in the client bundle.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hbyhntdtaplksbjajxej.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_O9qMCTU_lb0Czjw8J9q62Q_sVTA8oHl';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
