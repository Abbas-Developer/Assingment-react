import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mjxccwklzjiquslyxdoo.supabase.co';
const supabaseAnonKey = 'sb_publishable_TSIo-gsiPSsDSmr1AKFwgw_jbEZgiOV';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);