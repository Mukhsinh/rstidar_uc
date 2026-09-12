const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf8');
let url = '';
let key = '';

envFile.split('\n').forEach(line => {
    if (line.startsWith('VITE_SUPABASE_URL=')) url = line.split('=')[1].trim();
    if (line.startsWith('VITE_SUPABASE_SERVICE_ROLE_KEY=')) key = line.split('=')[1].trim();
});

const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
    console.log("Checking existing roles...");
    const { data: existingRoles, error: fetchError } = await supabase.from('role_akses_aplikasi').select('role_name');
    if (fetchError) {
        console.error("Fetch error:", fetchError);
        return;
    }

    console.log("Existing:", existingRoles);

    const rolesToAdd = [
        { role_name: 'Admin', description: 'Administrator dengan akses terbatas pada pengaturan', is_active: true },
        { role_name: 'Manajer Pelayanan', description: 'Manajer Pelayanan', is_active: true },
        { role_name: 'Manajer Penunjang', description: 'Manajer Penunjang', is_active: true },
        { role_name: 'Manajer Keperawatan', description: 'Manajer Keperawatan', is_active: true },
        { role_name: 'Manajer Aset SDM', description: 'Manajer Aset SDM', is_active: true },
    ];

    const existingNames = existingRoles.map(r => r.role_name);
    const toInsert = rolesToAdd.filter(r => !existingNames.includes(r.role_name));

    if (toInsert.length > 0) {
        console.log("Inserting:", toInsert);
        const { data: inserted, error: insertError } = await supabase.from('role_akses_aplikasi').insert(toInsert).select();
        if (insertError) {
            console.error("Insert error:", insertError);
        } else {
            console.log("Inserted:", inserted);
        }
    } else {
        console.log("All roles already exist.");
    }
}

run();
