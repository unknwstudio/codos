import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hbyhntdtaplksbjajxej.supabase.co';
const supabaseAnonKey = 'sb_publishable_O9qMCTU_lb0Czjw8J9q62Q_sVTA8oHl';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
