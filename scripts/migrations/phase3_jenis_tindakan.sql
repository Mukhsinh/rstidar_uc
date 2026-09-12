-- =====================================================
-- PHASE 3: JENIS TINDAKAN & AKOMODASI (4 TABLES)
-- =====================================================

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
    CONSTRAINT prosentase_akomodasi_tindakan_unit_tahun_key UNIQUE (kode_unit_kerja, tahun)
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
