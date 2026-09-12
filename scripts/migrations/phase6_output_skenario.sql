-- PHASE 6: OUTPUT, SKENARIO & REPORTING (8 TABLES)
CREATE TABLE IF NOT EXISTS public.rekapitulasi_unit_cost (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tahun INTEGER NOT NULL,
    kode_jenis TEXT,
    kode_unit_kerja TEXT,
    nama_unit_kerja TEXT,
    kode_operator TEXT,
    nama_operator TEXT,
    kode_tindakan TEXT,
    nama_tindakan TEXT NOT NULL,
    biaya_bahan NUMERIC(14,2) DEFAULT 0,
    unit_cost_per_tindakan NUMERIC(14,2) DEFAULT 0,
    sumber_tabel TEXT,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.skenario_tarif (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tahun INTEGER NOT NULL,
    kode_jenis TEXT,
    kode_unit_kerja TEXT,
    nama_unit_kerja TEXT,
    kode_operator TEXT,
    nama_operator TEXT,
    kode_tindakan TEXT,
    nama_tindakan TEXT NOT NULL,
    biaya_bahan NUMERIC(14,2) DEFAULT 0,
    unit_cost_per_tindakan NUMERIC(14,2) DEFAULT 0,
    sumber_tabel TEXT,
    prosentase_profit NUMERIC(12,2) DEFAULT 30,
    prosentase_jp NUMERIC(12,2) DEFAULT 0,
    jasa_sarana NUMERIC(14,2) DEFAULT 0,
    jasa_pelayanan NUMERIC(14,2) DEFAULT 0,
    tarif_per_tindakan NUMERIC(14,2) DEFAULT 0,
    profit_margin NUMERIC(14,2) DEFAULT 0,
    profit_margin_percent NUMERIC(12,2) DEFAULT 0,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.skenario_tarif_akomodasi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tahun INTEGER NOT NULL,
    kode_unit_kerja TEXT,
    nama_unit_kerja TEXT,
    kelas TEXT,
    unit_cost NUMERIC(14,2) DEFAULT 0,
    prosentase_profit NUMERIC(12,2) DEFAULT 30,
    tarif NUMERIC(14,2) DEFAULT 0,
    profit_margin NUMERIC(14,2) DEFAULT 0,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.skenario_tarif_visit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tahun INTEGER NOT NULL,
    kode_unit_kerja TEXT,
    nama_unit_kerja TEXT,
    jenis_visit TEXT,
    unit_cost NUMERIC(14,2) DEFAULT 0,
    tarif NUMERIC(14,2) DEFAULT 0,
    profit_margin NUMERIC(14,2) DEFAULT 0,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.produk_layanan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_produk TEXT,
    nama_produk TEXT NOT NULL,
    kategori TEXT,
    harga NUMERIC(14,2) DEFAULT 0,
    unit_cost NUMERIC(14,2) DEFAULT 0,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cost_recovery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tahun INTEGER NOT NULL,
    kode_unit_kerja TEXT NOT NULL,
    nama_unit_kerja TEXT,
    total_biaya NUMERIC(16,2) DEFAULT 0,
    total_pendapatan NUMERIC(16,2) DEFAULT 0,
    cost_recovery_rate NUMERIC(12,4) DEFAULT 0,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.rincian_budgeting_bhp_public (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tahun INTEGER NOT NULL,
    kode_unit_kerja TEXT,
    nama_unit_kerja TEXT,
    kode_barang TEXT,
    nama_barang TEXT NOT NULL,
    satuan TEXT,
    harga_satuan NUMERIC(14,2) DEFAULT 0,
    jumlah NUMERIC(14,2) DEFAULT 0,
    total_rupiah NUMERIC(16,2) DEFAULT 0,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.budgeting_bhp_farmasi_public (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tahun INTEGER NOT NULL,
    kode_barang TEXT,
    nama_barang TEXT NOT NULL,
    satuan TEXT,
    gudang TEXT,
    harga NUMERIC(14,2) DEFAULT 0,
    total_jumlah NUMERIC(14,2) DEFAULT 0,
    total_rupiah NUMERIC(16,2) DEFAULT 0,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
