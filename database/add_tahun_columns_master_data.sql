-- ==============================================================================
-- Migrasi Database: Penambahan Kolom 'tahun' (Default 2025) untuk Data Master
-- Jalankan skrip ini di Supabase SQL Editor
-- ==============================================================================

-- 1. Data Unit Kerja
ALTER TABLE IF EXISTS public.data_unit_kerja ADD COLUMN IF NOT EXISTS tahun INTEGER DEFAULT 2025;
UPDATE public.data_unit_kerja SET tahun = 2025 WHERE tahun IS NULL;

-- 2. Barang Farmasi
ALTER TABLE IF EXISTS public.data_barang_farmasi ADD COLUMN IF NOT EXISTS tahun INTEGER DEFAULT 2025;
UPDATE public.data_barang_farmasi SET tahun = 2025 WHERE tahun IS NULL;

-- 3. Barang Gizi
ALTER TABLE IF EXISTS public.data_barang_gizi ADD COLUMN IF NOT EXISTS tahun INTEGER DEFAULT 2025;
UPDATE public.data_barang_gizi SET tahun = 2025 WHERE tahun IS NULL;

-- 4. Data Kamar
ALTER TABLE IF EXISTS public.data_kamar ADD COLUMN IF NOT EXISTS tahun INTEGER DEFAULT 2025;
UPDATE public.data_kamar SET tahun = 2025 WHERE tahun IS NULL;

-- 5. Data Klinik
ALTER TABLE IF EXISTS public.data_klinik ADD COLUMN IF NOT EXISTS tahun INTEGER DEFAULT 2025;
UPDATE public.data_klinik SET tahun = 2025 WHERE tahun IS NULL;

-- 6. Data Dokter
ALTER TABLE IF EXISTS public.data_dokter ADD COLUMN IF NOT EXISTS tahun INTEGER DEFAULT 2025;
UPDATE public.data_dokter SET tahun = 2025 WHERE tahun IS NULL;

-- 7. Menu Gizi
ALTER TABLE IF EXISTS public.data_menu_gizi ADD COLUMN IF NOT EXISTS tahun INTEGER DEFAULT 2025;
UPDATE public.data_menu_gizi SET tahun = 2025 WHERE tahun IS NULL;

-- 8. Daftar Tindakan
ALTER TABLE IF EXISTS public.daftar_tindakan ADD COLUMN IF NOT EXISTS tahun INTEGER DEFAULT 2025;
UPDATE public.daftar_tindakan SET tahun = 2025 WHERE tahun IS NULL;

-- 9. Tindakan Laboratorium
ALTER TABLE IF EXISTS public.tindakan_laboratorium ADD COLUMN IF NOT EXISTS tahun INTEGER DEFAULT 2025;
UPDATE public.tindakan_laboratorium SET tahun = 2025 WHERE tahun IS NULL;

-- 10. Tindakan Radiologi
ALTER TABLE IF EXISTS public.tindakan_radiologi ADD COLUMN IF NOT EXISTS tahun INTEGER DEFAULT 2025;
UPDATE public.tindakan_radiologi SET tahun = 2025 WHERE tahun IS NULL;

-- 11. Tindakan Operatif
ALTER TABLE IF EXISTS public.tindakan_operatif ADD COLUMN IF NOT EXISTS tahun INTEGER DEFAULT 2025;
UPDATE public.tindakan_operatif SET tahun = 2025 WHERE tahun IS NULL;

-- 12. Tindakan BDRS
ALTER TABLE IF EXISTS public.tindakan_bdrs ADD COLUMN IF NOT EXISTS tahun INTEGER DEFAULT 2025;
UPDATE public.tindakan_bdrs SET tahun = 2025 WHERE tahun IS NULL;

-- 13. Tindakan Cathlab
ALTER TABLE IF EXISTS public.tindakan_cathlab ADD COLUMN IF NOT EXISTS tahun INTEGER DEFAULT 2025;
UPDATE public.tindakan_cathlab SET tahun = 2025 WHERE tahun IS NULL;

-- Verifikasi hasil penambahan kolom
SELECT table_name, column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND column_name = 'tahun'
  AND table_name IN (
    'data_unit_kerja', 'data_barang_farmasi', 'data_barang_gizi', 'data_kamar',
    'data_klinik', 'data_dokter', 'data_menu_gizi', 'daftar_tindakan',
    'tindakan_laboratorium', 'tindakan_radiologi', 'tindakan_operatif',
    'tindakan_bdrs', 'tindakan_cathlab', 'daftar_laboratorium_eksternal',
    'daftar_radiologi_eksternal'
  )
ORDER BY table_name;
