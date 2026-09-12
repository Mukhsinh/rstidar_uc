-- PHASE 10: VIEWS, FUNCTIONS, TRIGGERS & RLS POLICIES
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
