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
    'tindakan_cathlab',
    'daftar_laboratorium_eksternal',
    'daftar_radiologi_eksternal'
];

async function check() {
    for (const t of tables) {
        const { data, error } = await supabase.from(t).select('*').limit(1);
        if (error) {
            console.log(t, 'ERROR:', error.message);
        } else if (data && data.length > 0) {
            console.log(t, 'Keys:', Object.keys(data[0]), 'Has tahun?:', 'tahun' in data[0]);
        } else {
            console.log(t, 'Empty table, selecting year filter test...');
            const testEq = await supabase.from(t).select('tahun').limit(1);
            console.log(t, 'select(tahun) error:', testEq.error?.message || 'NO ERROR (tahun column exists)');
        }
    }
}

check();
