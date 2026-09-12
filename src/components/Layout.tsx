"use client";

import React, { Suspense, useMemo } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu, LogOut, User, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarNav } from "@/components/SidebarNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { SidebarToggleProvider } from "@/components/SidebarToggleContext";
import { useBrandingSettings } from "@/hooks/useBrandingSettings";
import { useGeneralSettingsContext } from "@/contexts/GeneralSettingsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "@/contexts/TenantContext";
import { TenantBranding } from "@/components/TenantBranding";
import { ReportHeader, ReportToolbar } from "@/components/report";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { settings: brandingSettings } = useBrandingSettings();
  const { settings: generalSettings } = useGeneralSettingsContext();
  const { user, signOut, loading } = useAuth();
  const { tenant } = useTenant();

  const segmentLabelMap: Record<string, string> = {
    "data-master": "Data Master",
    "unit-kerja": "Unit Kerja",
    barang: "Barang Farmasi",
    "barang-gizi": "Barang Gizi",
    kamar: "Data Kamar",
    klinik: "Data Klinik",
    "data-dokter": "Data Dokter",
    "menu-gizi": "Menu Gizi",
    "daftar-tindakan": "Daftar Tindakan",
    "tindakan-lab": "Tindakan Laboratorium",
    "tindakan-radiologi": "Tindakan Radiologi",
    "tindakan-operatif": "Tindakan Operatif",
    "tindakan-bdrs": "Tindakan BDRS",
    "tindakan-cathlab": "Tindakan Cathlab",
    "data-operasional": "Data Operasional",
    kegiatan: "Data Kegiatan",
    "kegiatan-rs": "Data Kegiatan RS",
    pendapatan: "Data Pendapatan",
    biaya: "Data Biaya",
    "unit-penunjang": "Unit Penunjang",
    "kalkulasi-biaya-gizi": "Kalkulasi Biaya Gizi",
    "kalkulasi-biaya-laboratorium": "Kalkulasi Biaya Laboratorium",
    "kalkulasi-biaya-radiologi": "Kalkulasi Biaya Radiologi",
    "kalkulasi-biaya-bdrs": "Kalkulasi BDRS",
    "unit-keperawatan": "Unit Keperawatan",
    "manajemen-tindakan-inap": "Manajemen Tindakan Inap",
    "data-akomodasi-inap": "Data Akomodasi Inap",
    "kalkulasi-tindakan-inap": "Kalkulasi Tindakan Inap",
    "kalkulasi-biaya-kelas-akomodasi": "Kalkulasi Biaya Kelas Akomodasi",
    "unit-pelayanan": "Unit Pelayanan",
    "manajemen-tindakan-rawat-jalan": "Manajemen Tindakan Rawat Jalan",
    "kalkulasi-tindakan-rawat-jalan": "Kalkulasi Tindakan Rawat Jalan",
    "kalkulasi-pendaftaran-resep": "Kalkulasi Pendaftaran & Resep",
    "kalkulasi-biaya-operatif": "Kalkulasi Biaya Operatif",
    "kalkulasi-biaya-cathlab": "Kalkulasi Biaya Cathlab",
    "unit-diklat": "Unit Diklat",
    "kalkulasi-biaya-diklat": "Kalkulasi Biaya Diklat",
    "kalkulasi-aktivitas": "Kalkulasi Aktivitas Diklat",
    "rekapitulasi-unit-cost": "Rekapitulasi Unit Cost",
    "skenario-tarif-tindakan": "Skenario Tarif Tindakan",
    "skenario-tarif-akomodasi": "Skenario Tarif Akomodasi",
    "skenario-tarif-visit": "Skenario Tarif Visit",
    "distribusi-biaya": "Distribusi Biaya",
    "distribusi-biaya-pertama": "Distribusi Biaya Pertama",
    "distribusi-biaya-kedua": "Distribusi Biaya Kedua",
    "distribusi-biaya-rekap": "Distribusi Biaya Rekap",
    "analisis-revenue-cost": "Analisis Revenue Cost",
    "total-biaya-jp": "Total Biaya dengan JP",
    "cost-recovery": "Cost Recovery",
    "struktur-biaya": "Struktur Biaya",
    "proyeksi-pendapatan": "Proyeksi Pendapatan Layanan",
    "budgeting-bhp": "Budgeting BHP",
    rupiah: "Budgeting BHP (Rupiah)",
    rincian: "Budgeting BHP (Rincian)",
    "analisis-bisnis": "Analisis Bisnis",
    "produk-layanan": "Produk Layanan",
    "pola-remunerasi": "Pola Remunerasi",
    "pengaturan-umum": "Pengaturan Umum",
    "modul-teknis": "Modul Teknis",
    "manajemen-akses": "Manajemen Akses",
    "audit-trail": "Audit Trail",
    "pengelompokan-data": "Pengelompokan Data",
    "unit-pelayanan-lain": "Unit Pelayanan",
  };

  const formatSegment = (segment: string) => {
    if (!segment) return "";
    if (segmentLabelMap[segment]) return segmentLabelMap[segment];
    return segment
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  };

  const reportMeta = useMemo(() => {
    const path = location.pathname;
    if (path === "/" || path === "") {
      return null;
    }

    const segments = path.split("/").filter(Boolean);

    // Khusus halaman skenario tarif tindakan, tidak menampilkan ReportHeader global
    const lastSegment = segments[segments.length - 1];
    if (lastSegment === "skenario-tarif-tindakan") {
      return null;
    }

    const labels = segments.map(formatSegment);
    const title = labels.join(" · ");
    const subtitle =
      labels.length > 0
        ? `Laporan ${labels[labels.length - 1]}`
        : "Laporan sistem";

    return {
      title,
      subtitle,
      filename: segments.join("-") || "laporan",
    };
  }, [location.pathname]);

  const handleLinkClick = () => {
    if (isMobile) {
      // Pastikan menu mobile tertutup dengan satu klik
      setTimeout(() => {
        setIsSheetOpen(false);
      }, 100); // Small delay to ensure click is processed
    }
  };

  const handleLogout = async () => {
    const error = await signOut();
    if (error) {
      toast.error("Gagal logout: " + error.message);
    } else {
      navigate("/login");
      toast.success("Berhasil logout");
    }
  };

  const logoUrl = generalSettings?.logo_url || tenant?.logo_url || brandingSettings?.logo_url;
  const appTitle = generalSettings?.nama_aplikasi || brandingSettings?.app_title || "PINTAR UC";
  const instansiName = generalSettings?.nama_instansi || tenant?.name || "Unit Cost RS";

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Desktop Sidebar */}
      <div className="hidden bg-white md:block border-r border-slate-200/80 shadow-xs will-change-transform">
        <div className="flex h-full max-h-screen flex-col">
          {/* Brand Header Card */}
          <div className="p-4 border-b border-slate-100">
            <Link to="/dashboard" className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200/70 shadow-2xs transition-all group">
              <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-teal-50/80 border border-teal-200/60 p-2 shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={instansiName}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <Building className="h-8 w-8 text-teal-600" />
                )}
              </div>
              <div className="flex flex-col overflow-hidden min-w-0">
                <span className="text-lg font-extrabold tracking-tight text-slate-900 truncate leading-snug">{appTitle}</span>
                <span className="text-sm text-slate-500 truncate font-medium">{instansiName}</span>
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto px-3 py-2 custom-thin-scrollbar">
            <SidebarNav onLinkClick={handleLinkClick} />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col min-h-screen bg-slate-50 transition-colors will-change-transform">
        {/* Mobile Header */}
        <header className="flex h-14 items-center gap-4 border-b border-slate-200 bg-white px-4 lg:h-[60px] lg:px-6 md:hidden will-change-transform">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col bg-white w-full max-w-[85vw] sm:max-w-sm px-4 py-6">
              <Link to="/dashboard" className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 font-semibold text-lg text-slate-900">
                <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-teal-50 border border-teal-100 p-2 shrink-0 overflow-hidden">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={instansiName}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Building className="h-8 w-8 text-teal-600" />
                  )}
                </div>
                <div className="flex flex-col overflow-hidden min-w-0">
                  <span className="font-bold text-lg text-slate-900 truncate leading-snug">{appTitle}</span>
                  <span className="text-sm text-slate-500 truncate">{instansiName}</span>
                </div>
              </Link>
              <nav className="grid gap-2 text-lg font-medium mt-4">
                <SidebarNav isMobile onLinkClick={handleLinkClick} />
              </nav>
              <div className="mt-auto pt-4">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-red-600 text-white border-red-600 hover:bg-red-700 hover:text-white"
                  onClick={handleLogout}
                  disabled={loading}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <Link to="/dashboard" className="flex-1 flex items-center gap-2 font-semibold text-lg text-slate-900 min-w-0">
            <span className="font-bold truncate">{appTitle}</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto shrink-0 text-slate-700 hover:bg-slate-100"
            onClick={handleLogout}
            disabled={loading}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </header>

        {/* Header dengan nama user dan footer instansi */}
        <header className="hidden md:flex h-14 items-center justify-between border-b border-slate-200/80 bg-white px-6 shadow-xs will-change-transform">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSheetOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 tracking-wide">
                {generalSettings?.footer || generalSettings?.nama_instansi || "Aplikasi Unit Cost RSUD Kerinci"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-auto px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/70 text-slate-800 border border-slate-200/80 shadow-2xs transition-all">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-full bg-teal-600 text-white">
                      <User className="h-3.5 w-3.5" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-slate-900 leading-tight">
                        {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium leading-tight">
                        {user?.email?.split('@')[1] || ''}
                      </div>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal bg-slate-50 border-b border-slate-200/60 p-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-teal-600 text-white shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col space-y-0.5 overflow-hidden">
                      <p className="text-sm font-semibold leading-none text-slate-900 truncate">
                        {user?.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-xs leading-none text-slate-500 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <SidebarToggleProvider onOpen={() => setIsSheetOpen(true)}>
          <main className="flex flex-1 flex-col gap-6 p-4 lg:gap-8 lg:p-6 bg-transparent">
            <Suspense fallback={<div className="flex flex-1 items-center justify-center text-teal-800"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mr-3"></div><span>Memuat konten...</span></div>}>
              {children || <Outlet />}
            </Suspense>
          </main>
        </SidebarToggleProvider>
      </div>
    </div>
  );
};

export default Layout;