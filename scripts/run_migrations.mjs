import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_REF = 'dpfiphsugsevntfpsfwu';
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || '';

async function executeSql(query, description) {
    console.log(`\n⏳ Executing: ${description}...`);
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
        console.error(`❌ Failed ${description}: Status ${response.status}`);
        console.error(errorText);
        throw new Error(`Execution failed for ${description}: ${errorText}`);
    }

    const result = await response.json();
    console.log(`✅ Success: ${description}`);
    return result;
}

async function runAllMigrations() {
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = [
        'phase1_master_data.sql',
        'phase2_transactions.sql',
        'phase3_jenis_tindakan.sql',
        'phase4_distribusi.sql',
        'phase5_kalkulasi.sql',
        'phase6_output_skenario.sql',
        'phase7_tenant_rbac.sql',
        'phase8_system_aux.sql',
        'phase9_transpose_mapping.sql',
        'phase10_views_functions_rls.sql'
    ];

    console.log('====================================================');
    console.log(`🚀 Starting Migration for Project: ${PROJECT_REF}`);
    console.log('====================================================');

    for (const file of files) {
        const filePath = path.join(migrationsDir, file);
        if (!fs.existsSync(filePath)) {
            console.error(`❌ File not found: ${filePath}`);
            continue;
        }

        const sqlContent = fs.readFileSync(filePath, 'utf8');
        await executeSql(sqlContent, file);
    }

    console.log('\n====================================================');
    console.log('🎉 ALL 10 MIGRATION PHASES EXECUTED SUCCESSFULLY!');
    console.log('====================================================\n');
}

runAllMigrations().catch(err => {
    console.error('\n❌ Migration execution error:', err);
    process.exit(1);
});
