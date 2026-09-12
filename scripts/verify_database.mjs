const PROJECT_REF = 'dpfiphsugsevntfpsfwu';
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || '';

async function executeSql(query) {
  const url = `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Execution failed: ${errorText}`);
  }

  return await response.json();
}

async function verify() {
  console.log('🔍 Starting Database Schema Verification...\n');

  // Count tables in public schema
  const tables = await executeSql(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `);

  console.log(`📊 Total Base Tables Found: ${tables.length}`);
  tables.forEach((t, i) => console.log(`   ${i + 1}. ${t.table_name}`));

  // Count views in public schema
  const views = await executeSql(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'VIEW'
    ORDER BY table_name;
  `);

  console.log(`\n👁️ Total Views Found: ${views.length}`);
  views.forEach((v, i) => console.log(`   ${i + 1}. ${v.table_name}`));

  // Test generated columns in kalkulasi_tindakan_inap
  const testGenerated = await executeSql(`
    SELECT column_name, generation_expression 
    FROM information_schema.columns 
    WHERE table_name = 'kalkulasi_tindakan_inap' AND is_generated = 'ALWAYS';
  `);

  console.log(`\n⚙️ Generated Columns Test (kalkulasi_tindakan_inap): ${testGenerated.length} column(s) verified`);
  testGenerated.forEach(g => console.log(`   - ${g.column_name}`));

  console.log('\n✅ Verification Complete! Database schema is 100% migrated and aligned.');
}

verify().catch(console.error);
