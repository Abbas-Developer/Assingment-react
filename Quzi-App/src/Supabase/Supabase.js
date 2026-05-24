import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ujryfzsmrwmcldzunelg.supabase.co';
const supabaseAnonKey = 'sb_publishable_HLCp3FL3ars1VcX5TC7EEA_7PW2Qx4E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);