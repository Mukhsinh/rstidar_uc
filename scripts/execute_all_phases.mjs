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
        throw new Error(`Execution failed: ${errorText}`);
    }

    const result = await response.json();
    console.log(`✅ Success: ${description}`);
    return result;
}

// ----------------------------------------------------
// PHASE 1: Master Data Tables (17 Tables)
// ----------------------------------------------------
const phase1Sql = `
-- Extension setup
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. unit_kerja
CREATE TABLE IF NOT EXISTS public.unit_kerja (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode TEXT NOT NULL UNIQUE,
    nama TEXT NOT NULL,
    kode_unit_kerja TEXT,
    nama_unit_kerja TEXT,
    lokasi TEXT,
    luas_ruangan NUMERIC(12,2) DEFAULT 0,
    kategori TEXT CHECK (kategori IN ('Pusat Biaya', 'Pusat Pendapatan')),
    jenis TEXT,
    urutan INTEGER,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. daftar_tindakan
CREATE TABLE IF NOT EXISTS public.daftar_tindakan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_tindakan TEXT NOT NULL UNIQUE,
    nama_tindakan TEXT NOT NULL,
    medis NUMERIC(12,2) DEFAULT 0,
    paramedis NUMERIC(12,2) DEFAULT 0,
    waktu NUMERIC(12,2) DEFAULT 0,
    profesionalisme NUMERIC(12,2) DEFAULT 1,
    tingkat_kesulitan NUMERIC(12,2) DEFAULT 1,
    biaya_bahan_tindakan NUMERIC(14,2) DEFAULT 0,
    bahan_tindakan JSONB DEFAULT '[]'::jsonb,
    kode_unit_kerja TEXT,
    nama_unit_kerja TEXT,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. tindakan_laboratorium
CREATE TABLE IF NOT EXISTS public.tindakan_laboratorium (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jenis TEXT,
    kode_tindakan TEXT,
    nama_tindakan TEXT NOT NULL,
    waktu NUMERIC(12,2) DEFAULT 0,
    profesionalisme NUMERIC(12,2) DEFAULT 1,
    tingkat_kesulitan NUMERIC(12,2) DEFAULT 1,
    biaya_bahan NUMERIC(14,2) DEFAULT 0,
    biaya_bahan_tindakan NUMERIC(14,2) DEFAULT 0,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. tindakan_radiologi
CREATE TABLE IF NOT EXISTS public.tindakan_radiologi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_tindakan TEXT,
    nama_tindakan TEXT NOT NULL,
    waktu NUMERIC(12,2) DEFAULT 0,
    profesionalisme NUMERIC(12,2) DEFAULT 1,
    tingkat_kesulitan NUMERIC(12,2) DEFAULT 1,
    biaya_bahan NUMERIC(14,2) DEFAULT 0,
    biaya_bahan_tindakan NUMERIC(14,2) DEFAULT 0,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. tindakan_bdrs
CREATE TABLE IF NOT EXISTS public.tindakan_bdrs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode TEXT,
    nama TEXT NOT NULL,
    waktu NUMERIC(12,2) DEFAULT 0,
    profesionalisme NUMERIC(12,2) DEFAULT 1,
    tingkat_kesulitan NUMERIC(12,2) DEFAULT 1,
    biaya_bahan NUMERIC(14,2) DEFAULT 0,
    biaya_bahan_tindakan NUMERIC(14,2) DEFAULT 0,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. tindakan_operatif
CREATE TABLE IF NOT EXISTS public.tindakan_operatif (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_tindakan TEXT,
    nama_tindakan TEXT NOT NULL,
    kode_operator TEXT,
    nama_operator TEXT,
    waktu NUMERIC(12,2) DEFAULT 0,
    profesionalisme NUMERIC(12,2) DEFAULT 1,
    tingkat_kesulitan NUMERIC(12,2) DEFAULT 1,
    biaya_bahan NUMERIC(14,2) DEFAULT 0,
    biaya_bahan_tindakan NUMERIC(14,2) DEFAULT 0,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. tindakan_cathlab
CREATE TABLE IF NOT EXISTS public.tindakan_cathlab (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_tindakan TEXT,
    nama_tindakan TEXT NOT NULL,
    waktu NUMERIC(12,2) DEFAULT 0,
    profesionalisme NUMERIC(12,2) DEFAULT 1,
    tingkat_kesulitan NUMERIC(12,2) DEFAULT 1,
    biaya_bahan NUMERIC(14,2) DEFAULT 0,
    biaya_bahan_tindakan NUMERIC(14,2) DEFAULT 0,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. tindakan_ibs
CREATE TABLE IF NOT EXISTS public.tindakan_ibs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_tindakan TEXT,
    nama_tindakan TEXT NOT NULL,
    kode_operator TEXT,
    nama_operator TEXT,
    waktu NUMERIC(12,2) DEFAULT 0,
    profesionalisme NUMERIC(12,2) DEFAULT 1,
    tingkat_kesulitan NUMERIC(12,2) DEFAULT 1,
    biaya_bahan NUMERIC(14,2) DEFAULT 0,
    biaya_bahan_tindakan NUMERIC(14,2) DEFAULT 0,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. menu_gizi
CREATE TABLE IF NOT EXISTS public.menu_gizi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_makanan TEXT,
    nama_makanan TEXT NOT NULL,
    kategori TEXT,
    waktu NUMERIC(12,2) DEFAULT 0,
    profesionalisme NUMERIC(12,2) DEFAULT 1,
    tingkat_kesulitan NUMERIC(12,2) DEFAULT 1,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. data_barang_farmasi
CREATE TABLE IF NOT EXISTS public.data_barang_farmasi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_barang TEXT,
    nama_barang TEXT NOT NULL,
    satuan TEXT,
    gudang TEXT,
    harga NUMERIC(14,2) DEFAULT 0,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. data_barang_gizi
CREATE TABLE IF NOT EXISTS public.data_barang_gizi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_barang TEXT,
    nama_barang TEXT NOT NULL,
    satuan TEXT,
    harga NUMERIC(14,2) DEFAULT 0,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. klinik
CREATE TABLE IF NOT EXISTS public.klinik (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_klinik TEXT,
    nama_klinik TEXT NOT NULL,
    layanan_bpjs_kes NUMERIC(14,2) DEFAULT 0,
    layanan_umum_asuransi NUMERIC(14,2) DEFAULT 0,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. data_kamar / Data_Kamar
CREATE TABLE IF NOT EXISTS public.data_kamar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_kamar TEXT,
    nama_kamar TEXT NOT NULL,
    kelas_svip BOOLEAN DEFAULT false,
    kelas_vip BOOLEAN DEFAULT false,
    kelas_1 BOOLEAN DEFAULT false,
    kelas_2 BOOLEAN DEFAULT false,
    kelas_3 BOOLEAN DEFAULT false,
    kelas_khusus BOOLEAN DEFAULT false,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. data_diklat
CREATE TABLE IF NOT EXISTS public.data_diklat (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_strata TEXT,
    kode_materi TEXT,
    nama_materi TEXT NOT NULL,
    waktu NUMERIC(12,2) DEFAULT 0,
    profesionalisme NUMERIC(12,2) DEFAULT 1,
    tingkat_kesulitan NUMERIC(12,2) DEFAULT 1,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. data_dokter
CREATE TABLE IF NOT EXISTS public.data_dokter (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_dokter TEXT,
    nama_dokter TEXT NOT NULL,
    spesialisasi TEXT,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. daftar_laboratorium_eksternal
CREATE TABLE IF NOT EXISTS public.daftar_laboratorium_eksternal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_tindakan TEXT,
    nama_tindakan TEXT NOT NULL,
    harga NUMERIC(14,2) DEFAULT 0,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. daftar_radiologi_eksternal
CREATE TABLE IF NOT EXISTS public.daftar_radiologi_eksternal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_tindakan TEXT,
    nama_tindakan TEXT NOT NULL,
    harga NUMERIC(14,2) DEFAULT 0,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

// ----------------------------------------------------
// PHASE 2: Transaction & Operational Data (4 Tables)
// ----------------------------------------------------
const phase2Sql = `
-- 18. data_kegiatan
CREATE TABLE IF NOT EXISTS public.data_kegiatan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_uk TEXT,
    kode_unit_kerja TEXT,
    nama_unit_kerja TEXT,
    tahun INTEGER NOT NULL,
    dokter NUMERIC(12,2) DEFAULT 0,
    perawat NUMERIC(12,2) DEFAULT 0,
    non_medis NUMERIC(12,2) DEFAULT 0,
    jumlah_sdm NUMERIC(12,2) GENERATED ALWAYS AS (COALESCE(dokter, 0) + COALESCE(perawat, 0) + COALESCE(non_medis, 0)) STORED,
    luas_ruangan NUMERIC(12,2) DEFAULT 0,
    jumlah_pasien_rawat_jalan NUMERIC(12,2) DEFAULT 0,
    jumlah_pasien_rawat_inap NUMERIC(12,2) DEFAULT 0,
    total_kunjungan_pasien NUMERIC(12,2) GENERATED ALWAYS AS (COALESCE(jumlah_pasien_rawat_jalan, 0) + COALESCE(jumlah_pasien_rawat_inap, 0)) STORED,
    peserta_diklat NUMERIC(12,2) DEFAULT 0,
    total_diklat NUMERIC(12,2) GENERATED ALWAYS AS (COALESCE(peserta_diklat, 0)) STORED,
    bor NUMERIC(12,2) DEFAULT 0,
    los NUMERIC(12,2) DEFAULT 0,
    toi NUMERIC(12,2) DEFAULT 0,
    bto NUMERIC(12,2) DEFAULT 0,
    jumlah_tt NUMERIC(12,2) DEFAULT 0,
    jumlah_hari_rawat NUMERIC(12,2) GENERATED ALWAYS AS (COALESCE(los, 0) * COALESCE(jumlah_pasien_rawat_inap, 0)) STORED,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Case-insensitive match backup table for legacy queries
CREATE TABLE IF NOT EXISTS public."Data_Kegiatan" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_uk TEXT,
    tahun INTEGER,
    unit_kerja_id UUID REFERENCES public.unit_kerja(id),
    user_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. data_biaya
CREATE TABLE IF NOT EXISTS public.data_biaya (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_unit_kerja TEXT NOT NULL,
    nama_unit_kerja TEXT,
    tahun INTEGER NOT NULL,
    biaya_gaji_tunjangan BIGINT DEFAULT 0,
    biaya_bhp BIGINT DEFAULT 0,
    biaya_makan_karyawan BIGINT DEFAULT 0,
    biaya_rumah_tangga BIGINT DEFAULT 0,
    biaya_cetak BIGINT DEFAULT 0,
    biaya_atk BIGINT DEFAULT 0,
    biaya_listrik BIGINT DEFAULT 0,
    biaya_air BIGINT DEFAULT 0,
    biaya_telp BIGINT DEFAULT 0,
    biaya_pemeliharaan_bangunan BIGINT DEFAULT 0,
    biaya_pemeliharaan_alat_medis BIGINT DEFAULT 0,
    biaya_pemeliharaan_alat_non_medis BIGINT DEFAULT 0,
    biaya_operasional_lainnya BIGINT DEFAULT 0,
    biaya_penyusutan_gedung BIGINT DEFAULT 0,
    biaya_penyusutan_jaringan BIGINT DEFAULT 0,
    biaya_penyusutan_alat_medis BIGINT DEFAULT 0,
    biaya_penyusutan_alat_non_medis BIGINT DEFAULT 0,
    biaya_pendidikan_pelatihan BIGINT DEFAULT 0,
    biaya_laundry BIGINT DEFAULT 0,
    biaya_sterilisasi BIGINT DEFAULT 0,
    jasa_pelayanan BIGINT DEFAULT 0,
    biaya_bahan BIGINT GENERATED ALWAYS AS (COALESCE(biaya_bhp, 0)) STORED,
    biaya_pegawai BIGINT GENERATED ALWAYS AS (COALESCE(biaya_gaji_tunjangan, 0) + COALESCE(biaya_makan_karyawan, 0)) STORED,
    biaya_daya BIGINT GENERATED ALWAYS AS (COALESCE(biaya_listrik, 0) + COALESCE(biaya_air, 0) + COALESCE(biaya_telp, 0)) STORED,
    biaya_pemeliharaan BIGINT GENERATED ALWAYS AS (COALESCE(biaya_pemeliharaan_bangunan, 0) + COALESCE(biaya_pemeliharaan_alat_medis, 0) + COALESCE(biaya_pemeliharaan_alat_non_medis, 0)) STORED,
    biaya_penyusutan BIGINT GENERATED ALWAYS AS (COALESCE(biaya_penyusutan_gedung, 0) + COALESCE(biaya_penyusutan_jaringan, 0) + COALESCE(biaya_penyusutan_alat_medis, 0) + COALESCE(biaya_penyusutan_alat_non_medis, 0)) STORED,
    total_biaya BIGINT GENERATED ALWAYS AS (
        COALESCE(biaya_gaji_tunjangan, 0) + COALESCE(biaya_bhp, 0) + COALESCE(biaya_makan_karyawan, 0) +
        COALESCE(biaya_rumah_tangga, 0) + COALESCE(biaya_cetak, 0) + COALESCE(biaya_atk, 0) +
        COALESCE(biaya_listrik, 0) + COALESCE(biaya_air, 0) + COALESCE(biaya_telp, 0) +
        COALESCE(biaya_pemeliharaan_bangunan, 0) + COALESCE(biaya_pemeliharaan_alat_medis, 0) + COALESCE(biaya_pemeliharaan_alat_non_medis, 0) +
        COALESCE(biaya_operasional_lainnya, 0) + COALESCE(biaya_penyusutan_gedung, 0) + COALESCE(biaya_penyusutan_jaringan, 0) +
        COALESCE(biaya_penyusutan_alat_medis, 0) + COALESCE(biaya_penyusutan_alat_non_medis, 0) + COALESCE(biaya_pendidikan_pelatihan, 0) +
        COALESCE(biaya_laundry, 0) + COALESCE(biaya_sterilisasi, 0) + COALESCE(jasa_pelayanan, 0)
    ) STORED,
    total_biaya_tanpa_jp BIGINT GENERATED ALWAYS AS (
        COALESCE(biaya_gaji_tunjangan, 0) + COALESCE(biaya_bhp, 0) + COALESCE(biaya_makan_karyawan, 0) +
        COALESCE(biaya_rumah_tangga, 0) + COALESCE(biaya_cetak, 0) + COALESCE(biaya_atk, 0) +
        COALESCE(biaya_listrik, 0) + COALESCE(biaya_air, 0) + COALESCE(biaya_telp, 0) +
        COALESCE(biaya_pemeliharaan_bangunan, 0) + COALESCE(biaya_pemeliharaan_alat_medis, 0) + COALESCE(biaya_pemeliharaan_alat_non_medis, 0) +
        COALESCE(biaya_operasional_lainnya, 0) + COALESCE(biaya_penyusutan_gedung, 0) + COALESCE(biaya_penyusutan_jaringan, 0) +
        COALESCE(biaya_penyusutan_alat_medis, 0) + COALESCE(biaya_penyusutan_alat_non_medis, 0) + COALESCE(biaya_pendidikan_pelatihan, 0) +
        COALESCE(biaya_laundry, 0) + COALESCE(biaya_sterilisasi, 0)
    ) STORED,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 20. data_pendapatan
CREATE TABLE IF NOT EXISTS public.data_pendapatan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_unit_kerja TEXT NOT NULL,
    nama_unit_kerja TEXT,
    tahun INTEGER NOT NULL,
    pendapatan_bpjs NUMERIC(14,2) DEFAULT 0,
    pendapatan_umum NUMERIC(14,2) DEFAULT 0,
    pendapatan_asuransi_lain NUMERIC(14,2) DEFAULT 0,
    total_pendapatan NUMERIC(14,2) GENERATED ALWAYS AS (COALESCE(pendapatan_bpjs, 0) + COALESCE(pendapatan_umum, 0) + COALESCE(pendapatan_asuransi_lain, 0)) STORED,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 21. bahan_porsi
CREATE TABLE IF NOT EXISTS public.bahan_porsi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_makanan TEXT,
    nama_makanan TEXT NOT NULL,
    kode_barang TEXT,
    nama_barang TEXT NOT NULL,
    jumlah NUMERIC(12,4) DEFAULT 0,
    satuan TEXT,
    harga_satuan NUMERIC(14,2) DEFAULT 0,
    total_biaya NUMERIC(14,2) DEFAULT 0,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

// ----------------------------------------------------
// PHASE 3: Jenis Tindakan & Akomodasi (4 Tables)
// ----------------------------------------------------
const phase3Sql = `
-- 22. jenis_tindakan_inap
CREATE TABLE IF NOT EXISTS public.jenis_tindakan_inap (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_unit_kerja TEXT NOT NULL,
    nama_unit_kerja TEXT,
    kode_jenis_tindakan TEXT NOT NULL,
    jenis_tindakan TEXT NOT NULL,
    jumlah NUMERIC(12,2) DEFAULT 0,
    waktu NUMERIC(12,2) DEFAULT 0,
    profesionalisme NUMERIC(12,2) DEFAULT 1,
    tingkat_kesulitan NUMERIC(12,2) DEFAULT 1,
    biaya_bahan_tindakan NUMERIC(14,2) DEFAULT 0,
    tahun INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 23. jenis_tindakan_rawat_jalan
CREATE TABLE IF NOT EXISTS public.jenis_tindakan_rawat_jalan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_unit_kerja TEXT NOT NULL,
    nama_unit_kerja TEXT,
    kode_jenis_tindakan TEXT NOT NULL,
    jenis_tindakan TEXT NOT NULL,
    jumlah NUMERIC(12,2) DEFAULT 0,
    waktu NUMERIC(12,2) DEFAULT 0,
    profesionalisme NUMERIC(12,2) DEFAULT 1,
    tingkat_kesulitan NUMERIC(12,2) DEFAULT 1,
    biaya_bahan_tindakan NUMERIC(14,2) DEFAULT 0,
    tahun INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 24. prosentase_akomodasi_tindakan
CREATE TABLE IF NOT EXISTS public.prosentase_akomodasi_tindakan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_unit_kerja TEXT NOT NULL,
    tahun INTEGER NOT NULL,
    rasio_tindakan NUMERIC(12,6) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (kode_unit_kerja, tahun)
);

-- 25. data_akomodasi_inap
CREATE TABLE IF NOT EXISTS public.data_akomodasi_inap (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_unit_kerja TEXT NOT NULL,
    nama_unit_kerja TEXT,
    tahun INTEGER NOT NULL,
    jumlah_hari_rawat NUMERIC(12,2) DEFAULT 0,
    rasio_akomodasi NUMERIC(12,6) DEFAULT 0,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

async function main() {
    console.log('🚀 Starting Full Database Schema Migration for Supabase Project: ' + PROJECT_REF);

    await executeSql(phase1Sql, 'Phase 1: Master Data Tables (17 Tables)');
    await executeSql(phase2Sql, 'Phase 2: Transaction & Operational Data (4 Tables)');
    await executeSql(phase3Sql, 'Phase 3: Jenis Tindakan & Akomodasi (4 Tables)');

    console.log('🎉 Phase 1 - 3 completed successfully!');
}

main().catch(err => {
    console.error('Fatal error in migration runner:', err);
    process.exit(1);
});
