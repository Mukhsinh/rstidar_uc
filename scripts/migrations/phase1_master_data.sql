-- =====================================================
-- PHASE 1: MASTER DATA TABLES (17 TABLES)
-- =====================================================

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

-- 13. data_kamar
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
