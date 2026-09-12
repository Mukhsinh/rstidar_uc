import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dpfiphsugsevntfpsfwu.supabase.co';
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

console.log('Supabase Admin URL:', supabaseUrl);
console.log('Supabase Service Key:', supabaseServiceKey ? 'Present' : 'Missing');

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️ Supabase service key fallback digunakan. Pastikan environment variable VITE_SUPABASE_SERVICE_KEY diatur untuk lingkungan produksi.');
}

// Create admin client with service role key for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
