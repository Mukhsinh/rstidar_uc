-- PHASE 5: KALKULASI UNIT COST (13 TABLES)
CREATE TABLE IF NOT EXISTS public.kalkulasi_biaya_gizi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_makanan TEXT,
    nama_makanan TEXT NOT NULL,
    kategori TEXT,
    waktu NUMERIC(12,2) DEFAULT 0,
    profesionalisme NUMERIC(12,2) DEFAULT 1,
    tingkat_kesulitan NUMERIC(12,2) DEFAULT 1,
    waktu_total NUMERIC(12,2) DEFAULT 0,
    jumlah NUMERIC(12,2) DEFAULT 0,
    hasil_kali_waktu NUMERIC(12,2) DEFAULT 0,
    tahun INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
    
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
    biaya_tidak_langsung_terdistribusi BIGINT DEFAULT 0,
    jasa_pelayanan BIGINT DEFAULT 0,
    biaya_bahan BIGINT DEFAULT 0
,
    unit_cost_per_porsi BIGINT GENERATED ALWAYS AS (
    COALESCE(biaya_gaji_tunjangan, 0) + COALESCE(biaya_makan_karyawan, 0) +
    COALESCE(biaya_rumah_tangga, 0) + COALESCE(biaya_cetak, 0) + COALESCE(biaya_atk, 0) +
    COALESCE(biaya_listrik, 0) + COALESCE(biaya_air, 0) + COALESCE(biaya_telp, 0) +
    COALESCE(biaya_pemeliharaan_bangunan, 0) + COALESCE(biaya_pemeliharaan_alat_medis, 0) + COALESCE(biaya_pemeliharaan_alat_non_medis, 0) +
    COALESCE(biaya_operasional_lainnya, 0) + COALESCE(biaya_penyusutan_gedung, 0) + COALESCE(biaya_penyusutan_jaringan, 0) +
    COALESCE(biaya_penyusutan_alat_medis, 0) + COALESCE(biaya_penyusutan_alat_non_medis, 0) + COALESCE(biaya_pendidikan_pelatihan, 0) +
    COALESCE(biaya_laundry, 0) + COALESCE(biaya_sterilisasi, 0) + COALESCE(biaya_tidak_langsung_terdistribusi, 0) +
    COALESCE(biaya_bhp, 0) + COALESCE(biaya_bahan, 0)
) STORED,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.kalkulasi_biaya_laboratorium (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_tindakan TEXT,
    nama_tindakan TEXT NOT NULL,
    jenis TEXT,
    waktu NUMERIC(12,2) DEFAULT 0,
    profesionalisme NUMERIC(12,2) DEFAULT 1,
    tingkat_kesulitan NUMERIC(12,2) DEFAULT 1,
    jumlah NUMERIC(12,2) DEFAULT 0,
    hasil_kali_waktu NUMERIC(12,2) DEFAULT 0,
    hasil_kali NUMERIC(12,2) DEFAULT 0,
    biaya_bahan_tindakan NUMERIC(14,2) DEFAULT 0,
    tahun INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
    
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
    biaya_tidak_langsung_terdistribusi BIGINT DEFAULT 0,
    jasa_pelayanan BIGINT DEFAULT 0,
    biaya_bahan BIGINT DEFAULT 0
,
    unit_cost_per_pemeriksaan BIGINT GENERATED ALWAYS AS (
    COALESCE(biaya_gaji_tunjangan, 0) + COALESCE(biaya_makan_karyawan, 0) +
    COALESCE(biaya_rumah_tangga, 0) + COALESCE(biaya_cetak, 0) + COALESCE(biaya_atk, 0) +
    COALESCE(biaya_listrik, 0) + COALESCE(biaya_air, 0) + COALESCE(biaya_telp, 0) +
    COALESCE(biaya_pemeliharaan_bangunan, 0) + COALESCE(biaya_pemeliharaan_alat_medis, 0) + COALESCE(biaya_pemeliharaan_alat_non_medis, 0) +
    COALESCE(biaya_operasional_lainnya, 0) + COALESCE(biaya_penyusutan_gedung, 0) + COALESCE(biaya_penyusutan_jaringan, 0) +
    COALESCE(biaya_penyusutan_alat_medis, 0) + COALESCE(biaya_penyusutan_alat_non_medis, 0) + COALESCE(biaya_pendidikan_pelatihan, 0) +
    COALESCE(biaya_laundry, 0) + COALESCE(biaya_sterilisasi, 0) + COALESCE(biaya_tidak_langsung_terdistribusi, 0) +
    COALESCE(biaya_bhp, 0) + COALESCE(biaya_bahan, 0)
) STORED,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.kalkulasi_biaya_radiologi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_tindakan TEXT,
    nama_tindakan TEXT NOT NULL,
    waktu NUMERIC(12,2) DEFAULT 0,
    profesionalisme NUMERIC(12,2) DEFAULT 1,
    tingkat_kesulitan NUMERIC(12,2) DEFAULT 1,
    jumlah NUMERIC(12,2) DEFAULT 0,
    hasil_kali_waktu NUMERIC(12,2) DEFAULT 0,
    hasil_kali NUMERIC(12,2) DEFAULT 0,
    biaya_bahan_tindakan NUMERIC(14,2) DEFAULT 0,
    tahun INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
    
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
    biaya_tidak_langsung_terdistribusi BIGINT DEFAULT 0,
    jasa_pelayanan BIGINT DEFAULT 0,
    biaya_bahan BIGINT DEFAULT 0
,
    unit_cost_per_pemeriksaan BIGINT GENERATED ALWAYS AS (
    COALESCE(biaya_gaji_tunjangan, 0) + COALESCE(biaya_makan_karyawan, 0) +
    COALESCE(biaya_rumah_tangga, 0) + COALESCE(biaya_cetak, 0) + COALESCE(biaya_atk, 0) +
    COALESCE(biaya_listrik, 0) + COALESCE(biaya_air, 0) + COALESCE(biaya_telp, 0) +
    COALESCE(biaya_pemeliharaan_bangunan, 0) + COALESCE(biaya_pemeliharaan_alat_medis, 0) + COALESCE(biaya_pemeliharaan_alat_non_medis, 0) +
    COALESCE(biaya_operasional_lainnya, 0) + COALESCE(biaya_penyusutan_gedung, 0) + COALESCE(biaya_penyusutan_jaringan, 0) +
    COALESCE(biaya_penyusutan_alat_medis, 0) + COALESCE(biaya_penyusutan_alat_non_medis, 0) + COALESCE(biaya_pendidikan_pelatihan, 0) +
    COALESCE(biaya_laundry, 0) + COALESCE(biaya_sterilisasi, 0) + COALESCE(biaya_tidak_langsung_terdistribusi, 0) +
    COALESCE(biaya_bhp, 0) + COALESCE(biaya_bahan, 0)
) STORED,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.kalkulasi_bdrs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode TEXT,
    nama TEXT NOT NULL,
    waktu NUMERIC(12,2) DEFAULT 0,
    profesionalisme NUMERIC(12,2) DEFAULT 1,
    tingkat_kesulitan NUMERIC(12,2) DEFAULT 1,
    jumlah NUMERIC(12,2) DEFAULT 0,
    hasil_kali_waktu NUMERIC(12,2) DEFAULT 0,
    hasil_kali NUMERIC(12,2) DEFAULT 0,
    biaya_bahan_tindakan NUMERIC(14,2) DEFAULT 0,
    tahun INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
    
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
    biaya_tidak_langsung_terdistribusi BIGINT DEFAULT 0,
    jasa_pelayanan BIGINT DEFAULT 0,
    biaya_bahan BIGINT DEFAULT 0
,
    unit_cost_per_pemeriksaan BIGINT GENERATED ALWAYS AS (
    COALESCE(biaya_gaji_tunjangan, 0) + COALESCE(biaya_makan_karyawan, 0) +
    COALESCE(biaya_rumah_tangga, 0) + COALESCE(biaya_cetak, 0) + COALESCE(biaya_atk, 0) +
    COALESCE(biaya_listrik, 0) + COALESCE(biaya_air, 0) + COALESCE(biaya_telp, 0) +
    COALESCE(biaya_pemeliharaan_bangunan, 0) + COALESCE(biaya_pemeliharaan_alat_medis, 0) + COALESCE(biaya_pemeliharaan_alat_non_medis, 0) +
    COALESCE(biaya_operasional_lainnya, 0) + COALESCE(biaya_penyusutan_gedung, 0) + COALESCE(biaya_penyusutan_jaringan, 0) +
    COALESCE(biaya_penyusutan_alat_medis, 0) + COALESCE(biaya_penyusutan_alat_non_medis, 0) + COALESCE(biaya_pendidikan_pelatihan, 0) +
    COALESCE(biaya_laundry, 0) + COALESCE(biaya_sterilisasi, 0) + COALESCE(biaya_tidak_langsung_terdistribusi, 0) +
    COALESCE(biaya_bhp, 0) + COALESCE(biaya_bahan, 0)
) STORED,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.kalkulasi_biaya_operatif (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_tindakan TEXT,
    nama_tindakan TEXT NOT NULL,
    kode_operator TEXT,
    nama_operator TEXT,
    waktu NUMERIC(12,2) DEFAULT 0,
    profesionalisme NUMERIC(12,2) DEFAULT 1,
    tingkat_kesulitan NUMERIC(12,2) DEFAULT 1,
    jumlah NUMERIC(12,2) DEFAULT 0,
    hasil_kali_waktu NUMERIC(12,2) DEFAULT 0,
    hasil_kali NUMERIC(12,2) DEFAULT 0,
    biaya_bahan_tindakan NUMERIC(14,2) DEFAULT 0,
    tahun INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
    
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
    biaya_tidak_langsung_terdistribusi BIGINT DEFAULT 0,
    jasa_pelayanan BIGINT DEFAULT 0,
    biaya_bahan BIGINT DEFAULT 0
,
    unit_cost_per_tindakan BIGINT GENERATED ALWAYS AS (
    COALESCE(biaya_gaji_tunjangan, 0) + COALESCE(biaya_makan_karyawan, 0) +
    COALESCE(biaya_rumah_tangga, 0) + COALESCE(biaya_cetak, 0) + COALESCE(biaya_atk, 0) +
    COALESCE(biaya_listrik, 0) + COALESCE(biaya_air, 0) + COALESCE(biaya_telp, 0) +
    COALESCE(biaya_pemeliharaan_bangunan, 0) + COALESCE(biaya_pemeliharaan_alat_medis, 0) + COALESCE(biaya_pemeliharaan_alat_non_medis, 0) +
    COALESCE(biaya_operasional_lainnya, 0) + COALESCE(biaya_penyusutan_gedung, 0) + COALESCE(biaya_penyusutan_jaringan, 0) +
    COALESCE(biaya_penyusutan_alat_medis, 0) + COALESCE(biaya_penyusutan_alat_non_medis, 0) + COALESCE(biaya_pendidikan_pelatihan, 0) +
    COALESCE(biaya_laundry, 0) + COALESCE(biaya_sterilisasi, 0) + COALESCE(biaya_tidak_langsung_terdistribusi, 0) +
    COALESCE(biaya_bhp, 0) + COALESCE(biaya_bahan, 0)
) STORED,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.kalkulasi_biaya_cathlab (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_tindakan TEXT,
    nama_tindakan TEXT NOT NULL,
    waktu NUMERIC(12,2) DEFAULT 0,
    profesionalisme NUMERIC(12,2) DEFAULT 1,
    tingkat_kesulitan NUMERIC(12,2) DEFAULT 1,
    jumlah NUMERIC(12,2) DEFAULT 0,
    hasil_kali_waktu NUMERIC(12,2) DEFAULT 0,
    hasil_kali NUMERIC(12,2) DEFAULT 0,
    biaya_bahan_tindakan NUMERIC(14,2) DEFAULT 0,
    tahun INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
    
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
    biaya_tidak_langsung_terdistribusi BIGINT DEFAULT 0,
    jasa_pelayanan BIGINT DEFAULT 0,
    biaya_bahan BIGINT DEFAULT 0
,
    unit_cost_per_tindakan BIGINT GENERATED ALWAYS AS (
    COALESCE(biaya_gaji_tunjangan, 0) + COALESCE(biaya_makan_karyawan, 0) +
    COALESCE(biaya_rumah_tangga, 0) + COALESCE(biaya_cetak, 0) + COALESCE(biaya_atk, 0) +
    COALESCE(biaya_listrik, 0) + COALESCE(biaya_air, 0) + COALESCE(biaya_telp, 0) +
    COALESCE(biaya_pemeliharaan_bangunan, 0) + COALESCE(biaya_pemeliharaan_alat_medis, 0) + COALESCE(biaya_pemeliharaan_alat_non_medis, 0) +
    COALESCE(biaya_operasional_lainnya, 0) + COALESCE(biaya_penyusutan_gedung, 0) + COALESCE(biaya_penyusutan_jaringan, 0) +
    COALESCE(biaya_penyusutan_alat_medis, 0) + COALESCE(biaya_penyusutan_alat_non_medis, 0) + COALESCE(biaya_pendidikan_pelatihan, 0) +
    COALESCE(biaya_laundry, 0) + COALESCE(biaya_sterilisasi, 0) + COALESCE(biaya_tidak_langsung_terdistribusi, 0) +
    COALESCE(biaya_bhp, 0) + COALESCE(biaya_bahan, 0)
) STORED,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.kalkulasi_biaya_ibs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_tindakan TEXT,
    nama_tindakan TEXT NOT NULL,
    kode_operator TEXT,
    nama_operator TEXT,
    waktu NUMERIC(12,2) DEFAULT 0,
    profesionalisme NUMERIC(12,2) DEFAULT 1,
    tingkat_kesulitan NUMERIC(12,2) DEFAULT 1,
    jumlah NUMERIC(12,2) DEFAULT 0,
    hasil_kali_waktu NUMERIC(12,2) DEFAULT 0,
    hasil_kali NUMERIC(12,2) DEFAULT 0,
    biaya_bahan_tindakan NUMERIC(14,2) DEFAULT 0,
    tahun INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
    
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
    biaya_tidak_langsung_terdistribusi BIGINT DEFAULT 0,
    jasa_pelayanan BIGINT DEFAULT 0,
    biaya_bahan BIGINT DEFAULT 0
,
    unit_cost_per_pemeriksaan BIGINT GENERATED ALWAYS AS (
    COALESCE(biaya_gaji_tunjangan, 0) + COALESCE(biaya_makan_karyawan, 0) +
    COALESCE(biaya_rumah_tangga, 0) + COALESCE(biaya_cetak, 0) + COALESCE(biaya_atk, 0) +
    COALESCE(biaya_listrik, 0) + COALESCE(biaya_air, 0) + COALESCE(biaya_telp, 0) +
    COALESCE(biaya_pemeliharaan_bangunan, 0) + COALESCE(biaya_pemeliharaan_alat_medis, 0) + COALESCE(biaya_pemeliharaan_alat_non_medis, 0) +
    COALESCE(biaya_operasional_lainnya, 0) + COALESCE(biaya_penyusutan_gedung, 0) + COALESCE(biaya_penyusutan_jaringan, 0) +
    COALESCE(biaya_penyusutan_alat_medis, 0) + COALESCE(biaya_penyusutan_alat_non_medis, 0) + COALESCE(biaya_pendidikan_pelatihan, 0) +
    COALESCE(biaya_laundry, 0) + COALESCE(biaya_sterilisasi, 0) + COALESCE(biaya_tidak_langsung_terdistribusi, 0) +
    COALESCE(biaya_bhp, 0) + COALESCE(biaya_bahan, 0)
) STORED,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.kalkulasi_tindakan_inap (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_unit_kerja TEXT NOT NULL,
    nama_unit_kerja TEXT,
    kode_jenis_tindakan TEXT NOT NULL,
    jenis_tindakan TEXT NOT NULL,
    jumlah NUMERIC(12,2) DEFAULT 0,
    waktu NUMERIC(12,2) DEFAULT 0,
    profesionalisme NUMERIC(12,2) DEFAULT 1,
    tingkat_kesulitan NUMERIC(12,2) DEFAULT 1,
    hasil_kali_waktu NUMERIC(12,2) DEFAULT 0,
    hasil_kali NUMERIC(12,2) DEFAULT 0,
    biaya_bahan_tindakan NUMERIC(14,2) DEFAULT 0,
    dasar_alokasi_kali_waktu NUMERIC(12,6) DEFAULT 0,
    dasar_alokasi_hasil_kali NUMERIC(12,6) DEFAULT 0,
    rasio_tindakan NUMERIC(12,6) DEFAULT 0,
    kali_bahan BIGINT DEFAULT 0,
    tahun INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
    
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
    biaya_tidak_langsung_terdistribusi BIGINT DEFAULT 0,
    jasa_pelayanan BIGINT DEFAULT 0,
    biaya_bahan BIGINT DEFAULT 0
,
    unit_cost_tindakan_inap BIGINT GENERATED ALWAYS AS (
    COALESCE(biaya_gaji_tunjangan, 0) + COALESCE(biaya_makan_karyawan, 0) +
    COALESCE(biaya_rumah_tangga, 0) + COALESCE(biaya_cetak, 0) + COALESCE(biaya_atk, 0) +
    COALESCE(biaya_listrik, 0) + COALESCE(biaya_air, 0) + COALESCE(biaya_telp, 0) +
    COALESCE(biaya_pemeliharaan_bangunan, 0) + COALESCE(biaya_pemeliharaan_alat_medis, 0) + COALESCE(biaya_pemeliharaan_alat_non_medis, 0) +
    COALESCE(biaya_operasional_lainnya, 0) + COALESCE(biaya_penyusutan_gedung, 0) + COALESCE(biaya_penyusutan_jaringan, 0) +
    COALESCE(biaya_penyusutan_alat_medis, 0) + COALESCE(biaya_penyusutan_alat_non_medis, 0) + COALESCE(biaya_pendidikan_pelatihan, 0) +
    COALESCE(biaya_laundry, 0) + COALESCE(biaya_sterilisasi, 0) + COALESCE(biaya_tidak_langsung_terdistribusi, 0) +
    COALESCE(biaya_bhp, 0) + COALESCE(biaya_bahan, 0)
) STORED,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.kalkulasi_tindakan_rawat_jalan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_unit_kerja TEXT NOT NULL,
    nama_unit_kerja TEXT,
    kode_jenis_tindakan TEXT NOT NULL,
    jenis_tindakan TEXT NOT NULL,
    jumlah NUMERIC(12,2) DEFAULT 0,
    waktu NUMERIC(12,2) DEFAULT 0,
    profesionalisme NUMERIC(12,2) DEFAULT 1,
    tingkat_kesulitan NUMERIC(12,2) DEFAULT 1,
    hasil_kali_waktu NUMERIC(12,2) DEFAULT 0,
    hasil_kali NUMERIC(12,2) DEFAULT 0,
    biaya_bahan_tindakan NUMERIC(14,2) DEFAULT 0,
    tahun INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
    
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
    biaya_tidak_langsung_terdistribusi BIGINT DEFAULT 0,
    jasa_pelayanan BIGINT DEFAULT 0,
    biaya_bahan BIGINT DEFAULT 0
,
    unit_cost_tindakan_rawat_jalan BIGINT GENERATED ALWAYS AS (
    COALESCE(biaya_gaji_tunjangan, 0) + COALESCE(biaya_makan_karyawan, 0) +
    COALESCE(biaya_rumah_tangga, 0) + COALESCE(biaya_cetak, 0) + COALESCE(biaya_atk, 0) +
    COALESCE(biaya_listrik, 0) + COALESCE(biaya_air, 0) + COALESCE(biaya_telp, 0) +
    COALESCE(biaya_pemeliharaan_bangunan, 0) + COALESCE(biaya_pemeliharaan_alat_medis, 0) + COALESCE(biaya_pemeliharaan_alat_non_medis, 0) +
    COALESCE(biaya_operasional_lainnya, 0) + COALESCE(biaya_penyusutan_gedung, 0) + COALESCE(biaya_penyusutan_jaringan, 0) +
    COALESCE(biaya_penyusutan_alat_medis, 0) + COALESCE(biaya_penyusutan_alat_non_medis, 0) + COALESCE(biaya_pendidikan_pelatihan, 0) +
    COALESCE(biaya_laundry, 0) + COALESCE(biaya_sterilisasi, 0) + COALESCE(biaya_tidak_langsung_terdistribusi, 0) +
    COALESCE(biaya_bhp, 0) + COALESCE(biaya_bahan, 0)
) STORED,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.kalkulasi_biaya_kelas_akomodasi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_unit_kerja TEXT NOT NULL,
    nama_unit_kerja TEXT,
    tahun INTEGER NOT NULL,
    jumlah_hari_rawat NUMERIC(12,2) DEFAULT 0,
    
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
    biaya_tidak_langsung_terdistribusi BIGINT DEFAULT 0,
    jasa_pelayanan BIGINT DEFAULT 0,
    biaya_bahan BIGINT DEFAULT 0
,
    unit_cost_per_hari_rawat BIGINT GENERATED ALWAYS AS (
    COALESCE(biaya_gaji_tunjangan, 0) + COALESCE(biaya_makan_karyawan, 0) +
    COALESCE(biaya_rumah_tangga, 0) + COALESCE(biaya_cetak, 0) + COALESCE(biaya_atk, 0) +
    COALESCE(biaya_listrik, 0) + COALESCE(biaya_air, 0) + COALESCE(biaya_telp, 0) +
    COALESCE(biaya_pemeliharaan_bangunan, 0) + COALESCE(biaya_pemeliharaan_alat_medis, 0) + COALESCE(biaya_pemeliharaan_alat_non_medis, 0) +
    COALESCE(biaya_operasional_lainnya, 0) + COALESCE(biaya_penyusutan_gedung, 0) + COALESCE(biaya_penyusutan_jaringan, 0) +
    COALESCE(biaya_penyusutan_alat_medis, 0) + COALESCE(biaya_penyusutan_alat_non_medis, 0) + COALESCE(biaya_pendidikan_pelatihan, 0) +
    COALESCE(biaya_laundry, 0) + COALESCE(biaya_sterilisasi, 0) + COALESCE(biaya_tidak_langsung_terdistribusi, 0) +
    COALESCE(biaya_bhp, 0) + COALESCE(biaya_bahan, 0)
) STORED,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.kalkulasi_diklat (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_strata TEXT,
    kode_materi TEXT,
    nama_materi TEXT NOT NULL,
    waktu NUMERIC(12,2) DEFAULT 0,
    profesionalisme NUMERIC(12,2) DEFAULT 1,
    tingkat_kesulitan NUMERIC(12,2) DEFAULT 1,
    jumlah NUMERIC(12,2) DEFAULT 0,
    tahun INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
    
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
    biaya_tidak_langsung_terdistribusi BIGINT DEFAULT 0,
    jasa_pelayanan BIGINT DEFAULT 0,
    biaya_bahan BIGINT DEFAULT 0
,
    unit_cost_diklat BIGINT GENERATED ALWAYS AS (
    COALESCE(biaya_gaji_tunjangan, 0) + COALESCE(biaya_makan_karyawan, 0) +
    COALESCE(biaya_rumah_tangga, 0) + COALESCE(biaya_cetak, 0) + COALESCE(biaya_atk, 0) +
    COALESCE(biaya_listrik, 0) + COALESCE(biaya_air, 0) + COALESCE(biaya_telp, 0) +
    COALESCE(biaya_pemeliharaan_bangunan, 0) + COALESCE(biaya_pemeliharaan_alat_medis, 0) + COALESCE(biaya_pemeliharaan_alat_non_medis, 0) +
    COALESCE(biaya_operasional_lainnya, 0) + COALESCE(biaya_penyusutan_gedung, 0) + COALESCE(biaya_penyusutan_jaringan, 0) +
    COALESCE(biaya_penyusutan_alat_medis, 0) + COALESCE(biaya_penyusutan_alat_non_medis, 0) + COALESCE(biaya_pendidikan_pelatihan, 0) +
    COALESCE(biaya_laundry, 0) + COALESCE(biaya_sterilisasi, 0) + COALESCE(biaya_tidak_langsung_terdistribusi, 0) +
    COALESCE(biaya_bhp, 0) + COALESCE(biaya_bahan, 0)
) STORED,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.kalkulasi_daftar_dan_resep (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_barang TEXT,
    nama_barang TEXT NOT NULL,
    satuan TEXT,
    gudang TEXT,
    harga NUMERIC(14,2) DEFAULT 0,
    jumlah NUMERIC(12,2) DEFAULT 0,
    tahun INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
    
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
    biaya_tidak_langsung_terdistribusi BIGINT DEFAULT 0,
    jasa_pelayanan BIGINT DEFAULT 0,
    biaya_bahan BIGINT DEFAULT 0
,
    unit_cost BIGINT GENERATED ALWAYS AS (
    COALESCE(biaya_gaji_tunjangan, 0) + COALESCE(biaya_makan_karyawan, 0) +
    COALESCE(biaya_rumah_tangga, 0) + COALESCE(biaya_cetak, 0) + COALESCE(biaya_atk, 0) +
    COALESCE(biaya_listrik, 0) + COALESCE(biaya_air, 0) + COALESCE(biaya_telp, 0) +
    COALESCE(biaya_pemeliharaan_bangunan, 0) + COALESCE(biaya_pemeliharaan_alat_medis, 0) + COALESCE(biaya_pemeliharaan_alat_non_medis, 0) +
    COALESCE(biaya_operasional_lainnya, 0) + COALESCE(biaya_penyusutan_gedung, 0) + COALESCE(biaya_penyusutan_jaringan, 0) +
    COALESCE(biaya_penyusutan_alat_medis, 0) + COALESCE(biaya_penyusutan_alat_non_medis, 0) + COALESCE(biaya_pendidikan_pelatihan, 0) +
    COALESCE(biaya_laundry, 0) + COALESCE(biaya_sterilisasi, 0) + COALESCE(biaya_tidak_langsung_terdistribusi, 0) +
    COALESCE(biaya_bhp, 0) + COALESCE(biaya_bahan, 0)
) STORED,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.analisa_bahan_pemeriksaan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_tindakan TEXT,
    nama_tindakan TEXT NOT NULL,
    kode_barang TEXT,
    nama_barang TEXT,
    jumlah NUMERIC(12,4) DEFAULT 0,
    satuan TEXT,
    harga_satuan NUMERIC(14,2) DEFAULT 0,
    total_biaya NUMERIC(14,2) DEFAULT 0,
    tahun INTEGER DEFAULT EXTRACT(YEAR FROM NOW()),
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
