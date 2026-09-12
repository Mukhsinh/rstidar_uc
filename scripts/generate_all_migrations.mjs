import fs from 'fs';
import path from 'path';

const dir = 'd:/Aplikasi Pintar UC/UC_RS_Kerinci/scripts/migrations';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

// PHASE 4
let ukCols1 = [];
for (let i = 1; i <= 77; i++) {
    let num = String(i).padStart(3, '0');
    ukCols1.push(`uk${num} NUMERIC(16,2) DEFAULT 0`);
}
let ukCols2 = [];
for (let i = 37; i <= 77; i++) {
    let num = String(i).padStart(3, '0');
    ukCols2.push(`uk${num} NUMERIC(16,2) DEFAULT 0`);
}

const phase4Sql = `-- PHASE 4: DISTRIBUSI BIAYA (3 TABLES)
CREATE TABLE IF NOT EXISTS public.distribusi_biaya_pertama (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tahun INTEGER NOT NULL,
    kode_unit_kerja TEXT NOT NULL,
    nama_unit_kerja TEXT,
    biaya_tahunan NUMERIC(16,2) DEFAULT 0,
    dasar_alokasi TEXT,
    ${ukCols1.join(',\n    ')},
    total_terdistribusi NUMERIC(16,2) DEFAULT 0,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.distribusi_biaya (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tahun INTEGER NOT NULL,
    kode_unit_kerja TEXT NOT NULL,
    nama_unit_kerja TEXT,
    biaya_tahunan NUMERIC(16,2) DEFAULT 0,
    dasar_alokasi TEXT,
    ${ukCols1.join(',\n    ')},
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.distribusi_biaya_kedua (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tahun INTEGER NOT NULL,
    kode_unit_kerja TEXT NOT NULL,
    nama_unit_kerja TEXT,
    dasar_alokasi TEXT,
    ${ukCols2.join(',\n    ')},
    total_terdistribusi NUMERIC(16,2) DEFAULT 0,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.distribusi_biaya_rekap (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tahun INTEGER NOT NULL,
    biaya TEXT NOT NULL,
    urutan INTEGER DEFAULT 0,
    ${ukCols2.join(',\n    ')},
    total NUMERIC(16,2) DEFAULT 0,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;
fs.writeFileSync(path.join(dir, 'phase4_distribusi.sql'), phase4Sql);

// PHASE 5
const baseCostCols = `
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
`;

const baseCostSum = `(
    COALESCE(biaya_gaji_tunjangan, 0) + COALESCE(biaya_makan_karyawan, 0) +
    COALESCE(biaya_rumah_tangga, 0) + COALESCE(biaya_cetak, 0) + COALESCE(biaya_atk, 0) +
    COALESCE(biaya_listrik, 0) + COALESCE(biaya_air, 0) + COALESCE(biaya_telp, 0) +
    COALESCE(biaya_pemeliharaan_bangunan, 0) + COALESCE(biaya_pemeliharaan_alat_medis, 0) + COALESCE(biaya_pemeliharaan_alat_non_medis, 0) +
    COALESCE(biaya_operasional_lainnya, 0) + COALESCE(biaya_penyusutan_gedung, 0) + COALESCE(biaya_penyusutan_jaringan, 0) +
    COALESCE(biaya_penyusutan_alat_medis, 0) + COALESCE(biaya_penyusutan_alat_non_medis, 0) + COALESCE(biaya_pendidikan_pelatihan, 0) +
    COALESCE(biaya_laundry, 0) + COALESCE(biaya_sterilisasi, 0) + COALESCE(biaya_tidak_langsung_terdistribusi, 0) +
    COALESCE(biaya_bhp, 0) + COALESCE(biaya_bahan, 0)
)`;

const phase5Sql = `-- PHASE 5: KALKULASI UNIT COST (13 TABLES)
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
    ${baseCostCols},
    unit_cost_per_porsi BIGINT GENERATED ALWAYS AS ${baseCostSum} STORED,
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
    ${baseCostCols},
    unit_cost_per_pemeriksaan BIGINT GENERATED ALWAYS AS ${baseCostSum} STORED,
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
    ${baseCostCols},
    unit_cost_per_pemeriksaan BIGINT GENERATED ALWAYS AS ${baseCostSum} STORED,
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
    ${baseCostCols},
    unit_cost_per_pemeriksaan BIGINT GENERATED ALWAYS AS ${baseCostSum} STORED,
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
    ${baseCostCols},
    unit_cost_per_tindakan BIGINT GENERATED ALWAYS AS ${baseCostSum} STORED,
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
    ${baseCostCols},
    unit_cost_per_tindakan BIGINT GENERATED ALWAYS AS ${baseCostSum} STORED,
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
    ${baseCostCols},
    unit_cost_per_pemeriksaan BIGINT GENERATED ALWAYS AS ${baseCostSum} STORED,
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
    ${baseCostCols},
    unit_cost_tindakan_inap BIGINT GENERATED ALWAYS AS ${baseCostSum} STORED,
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
    ${baseCostCols},
    unit_cost_tindakan_rawat_jalan BIGINT GENERATED ALWAYS AS ${baseCostSum} STORED,
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
    ${baseCostCols},
    unit_cost_per_hari_rawat BIGINT GENERATED ALWAYS AS ${baseCostSum} STORED,
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
    ${baseCostCols},
    unit_cost_diklat BIGINT GENERATED ALWAYS AS ${baseCostSum} STORED,
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
    ${baseCostCols},
    unit_cost BIGINT GENERATED ALWAYS AS ${baseCostSum} STORED,
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
`;
fs.writeFileSync(path.join(dir, 'phase5_kalkulasi.sql'), phase5Sql);

// PHASE 6
const phase6Sql = `-- PHASE 6: OUTPUT, SKENARIO & REPORTING (8 TABLES)
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
`;
fs.writeFileSync(path.join(dir, 'phase6_output_skenario.sql'), phase6Sql);

// PHASE 7
const phase7Sql = `-- PHASE 7: MULTI-TENANT, USER MANAGEMENT & RBAC (10 TABLES)
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    domain TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tenant_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    key TEXT NOT NULL,
    value JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT tenant_settings_tenant_key UNIQUE (tenant_id, key)
);

CREATE TABLE IF NOT EXISTS public.tenant_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    phone TEXT,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.role_akses_aplikasi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name TEXT UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    module TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT role_permissions_role_perm_key UNIQUE (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES public.role_akses_aplikasi(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    CONSTRAINT user_roles_user_role_key UNIQUE (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_name VARCHAR(100) NOT NULL UNIQUE,
    menu_url VARCHAR(255) NOT NULL,
    menu_description TEXT,
    menu_icon VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.role_menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID REFERENCES public.role_akses_aplikasi(id) ON DELETE CASCADE,
    menu_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE,
    can_view BOOLEAN DEFAULT false,
    can_create BOOLEAN DEFAULT false,
    can_edit BOOLEAN DEFAULT false,
    can_delete BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT role_menu_items_role_menu_key UNIQUE (role_id, menu_id)
);
`;
fs.writeFileSync(path.join(dir, 'phase7_tenant_rbac.sql'), phase7Sql);

// PHASE 8
const phase8Sql = `-- PHASE 8: SYSTEM SETTINGS & AUXILIARIES (5 TABLES)
CREATE TABLE IF NOT EXISTS public.general_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB DEFAULT '{}'::jsonb,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.branding_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_name TEXT DEFAULT 'Aplikasi Unit Cost RS',
    logo_url TEXT,
    primary_color TEXT DEFAULT '#0f172a',
    secondary_color TEXT DEFAULT '#3b82f6',
    footer_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.biaya_preference (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_trail (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    user_email TEXT,
    action TEXT NOT NULL,
    entity_name TEXT,
    entity_id TEXT,
    payload JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.struktur_biaya (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_biaya TEXT UNIQUE NOT NULL,
    nama_biaya TEXT NOT NULL,
    kategori TEXT,
    urutan INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;
fs.writeFileSync(path.join(dir, 'phase8_system_aux.sql'), phase8Sql);

// PHASE 9
let ukColsTranspose = [];
for (let i = 1; i <= 76; i++) {
    let num = String(i).padStart(3, '0');
    ukColsTranspose.push(`uk${num} NUMERIC(16,2) DEFAULT 0`);
}

const phase9Sql = `-- PHASE 9: TRANSPOSE & ALLOCATION MAPPINGS (3 TABLES)
CREATE TABLE IF NOT EXISTS public.data_kegiatan_transpose (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tahun INTEGER NOT NULL,
    jenis_kegiatan TEXT NOT NULL,
    ${ukColsTranspose.join(',\n    ')},
    total NUMERIC(16,2) DEFAULT 0,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.dasar_alokasi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    metode TEXT,
    satuan TEXT,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mapping_dasar_alokasi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_unit_kerja TEXT NOT NULL,
    nama_unit_kerja TEXT,
    dasar_alokasi_id UUID REFERENCES public.dasar_alokasi(id) ON DELETE SET NULL,
    kode_dasar_alokasi TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;
fs.writeFileSync(path.join(dir, 'phase9_transpose_mapping.sql'), phase9Sql);

// PHASE 10
const phase10Sql = `-- PHASE 10: VIEWS, FUNCTIONS, TRIGGERS & RLS POLICIES
CREATE OR REPLACE VIEW public.user_list_with_email AS
SELECT 
    u.id,
    u.email,
    p.full_name,
    p.tenant_id,
    u.created_at,
    u.last_sign_in_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id;

CREATE OR REPLACE VIEW public.user_with_role AS
SELECT 
    u.id AS user_id,
    u.email,
    r.role_name,
    ur.is_active
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id AND ur.is_active = true
LEFT JOIN public.role_akses_aplikasi r ON ur.role_id = r.id;

CREATE OR REPLACE VIEW public.view_bahan_porsi_with_barang_gizi AS
SELECT 
    bp.id,
    bp.kode_makanan,
    bp.nama_makanan,
    bp.kode_barang,
    bp.nama_barang,
    bp.jumlah,
    bp.satuan,
    COALESCE(dbg.harga, bp.harga_satuan) AS harga_satuan,
    (COALESCE(bp.jumlah, 0) * COALESCE(dbg.harga, bp.harga_satuan, 0)) AS total_biaya
FROM public.bahan_porsi bp
LEFT JOIN public.data_barang_gizi dbg ON bp.kode_barang = dbg.kode_barang;

CREATE OR REPLACE VIEW public.view_rekapitulasi_unit_cost AS
SELECT 
    id,
    tahun,
    kode_jenis,
    kode_unit_kerja,
    nama_unit_kerja,
    kode_tindakan,
    nama_tindakan,
    biaya_bahan,
    unit_cost_per_tindakan,
    sumber_tabel,
    user_id,
    created_at
FROM public.rekapitulasi_unit_cost;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.is_superadmin(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.user_roles ur
        JOIN public.role_akses_aplikasi r ON ur.role_id = r.id
        WHERE ur.user_id = check_user_id
          AND r.role_name = 'Super Admin'
          AND ur.is_active = true
          AND r.is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_admin_or_superadmin(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.user_roles ur
        JOIN public.role_akses_aplikasi r ON ur.role_id = r.id
        WHERE ur.user_id = check_user_id
          AND r.role_name IN ('Super Admin', 'Admin')
          AND ur.is_active = true
          AND r.is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DO $$
DECLARE
    t text;
    tables text[] := ARRAY[
        'unit_kerja', 'daftar_tindakan', 'tindakan_laboratorium', 'tindakan_radiologi', 'tindakan_bdrs',
        'tindakan_operatif', 'tindakan_cathlab', 'tindakan_ibs', 'menu_gizi', 'data_barang_farmasi',
        'data_barang_gizi', 'klinik', 'data_kamar', 'data_diklat', 'data_dokter', 'daftar_laboratorium_eksternal',
        'daftar_radiologi_eksternal', 'data_kegiatan', 'data_biaya', 'data_pendapatan', 'bahan_porsi',
        'jenis_tindakan_inap', 'jenis_tindakan_rawat_jalan', 'prosentase_akomodasi_tindakan', 'data_akomodasi_inap',
        'distribusi_biaya_pertama', 'distribusi_biaya_kedua', 'distribusi_biaya_rekap', 'kalkulasi_biaya_gizi',
        'kalkulasi_biaya_laboratorium', 'kalkulasi_biaya_radiologi', 'kalkulasi_bdrs', 'kalkulasi_biaya_operatif',
        'kalkulasi_biaya_cathlab', 'kalkulasi_biaya_ibs', 'kalkulasi_tindakan_inap', 'kalkulasi_tindakan_rawat_jalan',
        'kalkulasi_biaya_kelas_akomodasi', 'kalkulasi_diklat', 'kalkulasi_daftar_dan_resep', 'analisa_bahan_pemeriksaan',
        'rekapitulasi_unit_cost', 'skenario_tarif', 'skenario_tarif_akomodasi', 'skenario_tarif_visit',
        'produk_layanan', 'cost_recovery', 'rincian_budgeting_bhp_public', 'budgeting_bhp_farmasi_public',
        'tenants', 'tenant_settings', 'tenant_audit_log', 'profiles', 'user_profiles', 'roles',
        'role_akses_aplikasi', 'permissions', 'role_permissions', 'user_roles', 'menu_items',
        'role_menu_items', 'general_settings', 'branding_settings', 'biaya_preference', 'audit_trail',
        'struktur_biaya', 'data_kegiatan_transpose', 'dasar_alokasi', 'mapping_dasar_alokasi'
    ];
BEGIN
    FOR t IN SELECT unnest(tables) LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I;', 'Allow all for authenticated', t);
        EXECUTE format('CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true);', 'Allow all for authenticated', t);
    END LOOP;
END;
$$;
`;
fs.writeFileSync(path.join(dir, 'phase10_views_functions_rls.sql'), phase10Sql);

console.log('🎉 All SQL migration files successfully generated in scripts/migrations/!');
