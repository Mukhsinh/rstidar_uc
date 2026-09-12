-- =====================================================
-- PHASE 2: TRANSACTION & OPERATIONAL DATA (4 TABLES)
-- =====================================================

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

-- Backup legacy alias
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
