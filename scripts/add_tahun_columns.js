import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL || 'https://dpfiphsugsevntfpsfwu.supabase.co';
const key = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(url, key);

const tables = [
    'data_unit_kerja',
    'data_barang_farmasi',
    'data_barang_gizi',
    'data_kamar',
    'data_klinik',
    'data_dokter',
    'data_menu_gizi',
    'daftar_tindakan',
    'tindakan_laboratorium',
    'tindakan_radiologi',
    'tindakan_operatif',
    'tindakan_bdrs',
    'tindakan_cathlab'
];

async function run() {
    const sql = tables.map(t =>
        `ALTER TABLE IF EXISTS public.${t} ADD COLUMN IF NOT EXISTS tahun INTEGER DEFAULT 2025; UPDATE public.${t} SET tahun = 2025 WHERE tahun IS NULL;`
    ).join('\n');

    console.log('Trying rpc exec_sql...');
    const res = await supabase.rpc('exec_sql', { sql });
    console.log('Result:', res);
}

run();
