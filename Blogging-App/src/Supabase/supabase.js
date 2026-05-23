import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dminnbfxzffpmmzovgaz.supabase.co';

// Dashboard se COPY kiya hua poora key yahan paste karein (yeh kafi lamba hota hai)
const supabaseAnonKey = 'sb_publishable_F37nM8mHUT_wA_FntHTcrQ_mTIWFFg0'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);