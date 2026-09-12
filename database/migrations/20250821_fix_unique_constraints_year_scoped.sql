-- ==============================================================================
-- Migrasi: Perbaikan Unique Constraint agar mendukung data multi-tahun
-- 
-- MASALAH: Unique constraint pada kolom kode (unit_kerja, data_barang_farmasi, dll)
-- tidak menyertakan kolom 'tahun', sehingga data yang sama tidak bisa diduplikasi
-- ke tahun berbeda (fitur "Salin Database antar Tahun").
--
-- SOLUSI: Drop constraint lama, buat constraint komposit baru (kode + tahun + tenant_id)
-- ==============================================================================

-- 1. unit_kerja: unit_kerja_kode_unique → (kode, tahun, tenant_id)
ALTER TABLE IF EXISTS public.unit_kerja DROP CONSTRAINT IF EXISTS unit_kerja_kode_unique;
ALTER TABLE IF EXISTS public.unit_kerja DROP CONSTRAINT IF EXISTS unit_kerja_kode_key;
ALTER TABLE IF EXISTS public.unit_kerja 
  ADD CONSTRAINT unit_kerja_kode_tahun_tenant_unique UNIQUE (kode, tahun, tenant_id);

-- 2. data_barang_farmasi: barang_kode_key → (kode_barang, tahun, tenant_id)
ALTER TABLE IF EXISTS public.data_barang_farmasi DROP CONSTRAINT IF EXISTS barang_kode_key;
ALTER TABLE IF EXISTS public.data_barang_farmasi DROP CONSTRAINT IF EXISTS data_barang_farmasi_kode_barang_key;
ALTER TABLE IF EXISTS public.data_barang_farmasi 
  ADD CONSTRAINT data_barang_farmasi_kode_tahun_tenant_unique UNIQUE (kode_barang, tahun, tenant_id);

-- 3. data_barang_gizi
ALTER TABLE IF EXISTS public.data_barang_gizi DROP CONSTRAINT IF EXISTS data_barang_gizi_kode_barang_key;
ALTER TABLE IF EXISTS public.data_barang_gizi DROP CONSTRAINT IF EXISTS barang_gizi_kode_key;
ALTER TABLE IF EXISTS public.data_barang_gizi 
  ADD CONSTRAINT data_barang_gizi_kode_tahun_tenant_unique UNIQUE (kode_barang, tahun, tenant_id);

-- 4. data_kamar
ALTER TABLE IF EXISTS public.data_kamar DROP CONSTRAINT IF EXISTS data_kamar_kode_key;
ALTER TABLE IF EXISTS public.data_kamar DROP CONSTRAINT IF EXISTS data_kamar_kode_kamar_key;

-- 5. klinik
ALTER TABLE IF EXISTS public.klinik DROP CONSTRAINT IF EXISTS klinik_kode_key;
ALTER TABLE IF EXISTS public.klinik DROP CONSTRAINT IF EXISTS klinik_kode_klinik_key;

-- 6. data_dokter
ALTER TABLE IF EXISTS public.data_dokter DROP CONSTRAINT IF EXISTS data_dokter_kode_key;
ALTER TABLE IF EXISTS public.data_dokter DROP CONSTRAINT IF EXISTS data_dokter_kode_dokter_key;

-- 7. daftar_tindakan
ALTER TABLE IF EXISTS public.daftar_tindakan DROP CONSTRAINT IF EXISTS daftar_tindakan_kode_key;
ALTER TABLE IF EXISTS public.daftar_tindakan DROP CONSTRAINT IF EXISTS daftar_tindakan_kode_tindakan_key;

-- 8. tindakan_laboratorium
ALTER TABLE IF EXISTS public.tindakan_laboratorium DROP CONSTRAINT IF EXISTS tindakan_laboratorium_kode_key;
ALTER TABLE IF EXISTS public.tindakan_laboratorium DROP CONSTRAINT IF EXISTS tindakan_laboratorium_kode_tindakan_key;

-- 9. tindakan_radiologi
ALTER TABLE IF EXISTS public.tindakan_radiologi DROP CONSTRAINT IF EXISTS tindakan_radiologi_kode_key;
ALTER TABLE IF EXISTS public.tindakan_radiologi DROP CONSTRAINT IF EXISTS tindakan_radiologi_kode_tindakan_key;

-- 10. tindakan_operatif
ALTER TABLE IF EXISTS public.tindakan_operatif DROP CONSTRAINT IF EXISTS tindakan_operatif_kode_key;
ALTER TABLE IF EXISTS public.tindakan_operatif DROP CONSTRAINT IF EXISTS tindakan_operatif_kode_tindakan_key;

-- 11. tindakan_bdrs
ALTER TABLE IF EXISTS public.tindakan_bdrs DROP CONSTRAINT IF EXISTS tindakan_bdrs_kode_key;
ALTER TABLE IF EXISTS public.tindakan_bdrs DROP CONSTRAINT IF EXISTS tindakan_bdrs_kode_tindakan_key;

-- 12. tindakan_cathlab  
ALTER TABLE IF EXISTS public.tindakan_cathlab DROP CONSTRAINT IF EXISTS tindakan_cathlab_kode_key;
ALTER TABLE IF EXISTS public.tindakan_cathlab DROP CONSTRAINT IF EXISTS tindakan_cathlab_kode_tindakan_key;

-- 13. skenario_tarif_visit
ALTER TABLE IF EXISTS public.skenario_tarif_visit DROP CONSTRAINT IF EXISTS skenario_tarif_visit_kode_key;
ALTER TABLE IF EXISTS public.skenario_tarif_visit DROP CONSTRAINT IF EXISTS skenario_tarif_visit_unit_kerja_id_tahun_key;

-- Verifikasi
SELECT tc.table_name, tc.constraint_name, tc.constraint_type,
  string_agg(kcu.column_name, ', ' ORDER BY kcu.ordinal_position) AS cols
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
WHERE tc.table_schema = 'public' AND tc.constraint_type = 'UNIQUE'
GROUP BY tc.table_name, tc.constraint_name, tc.constraint_type
ORDER BY tc.table_name;
