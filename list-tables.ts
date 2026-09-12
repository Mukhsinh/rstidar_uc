// @ts-ignore
import { createClient } from '@supabase/supabase-js';

// Use the same configuration as in the client.ts file
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://dpfiphsugsevntfpsfwu.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listTables() {
  try {
    console.log('Fetching table information from Supabase...');

    // Try to get table information using RPC or direct query
    // First, let's try a simple query to see what tables might exist

    // Check if the tenant tables exist by trying to query them
    console.log('\nChecking for tenant tables:');
    const tenantTables = ['tenants', 'tenant_settings', 'tenant_audit_log', 'user_profiles'];

    for (const tableName of tenantTables) {
      try {
        // Try a simple count query to see if table exists
        const { count, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });

        if (error && error.message.includes('Could not find the table')) {
          console.log(`✗ ${tableName} does not exist`);
        } else if (error) {
          // Table exists but we got another kind of error (like permissions)
          console.log(`✓ ${tableName} exists (but may have access restrictions)`);
        } else {
          console.log(`✓ ${tableName} exists (count: ${count})`);
        }
      } catch (tableError) {
        console.error(`Error checking ${tableName}:`, tableError);
      }
    }

    // Try to get a list of tables using a different approach
    console.log('\nAttempting to list tables using RPC...');

    // Let's try to query some of the application tables that should exist
    const appTables = ['data_biaya', 'unit_kerja', 'jenis_biaya'];

    for (const tableName of appTables) {
      try {
        const { count, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });

        if (error && error.message.includes('Could not find the table')) {
          console.log(`✗ ${tableName} does not exist`);
        } else if (error) {
          console.log(`✓ ${tableName} exists (access error: ${error.message})`);
        } else {
          console.log(`✓ ${tableName} exists (count: ${count})`);
        }
      } catch (tableError) {
        console.log(`? ${tableName} - connection test failed`);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

listTables();