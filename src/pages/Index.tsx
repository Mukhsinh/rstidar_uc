"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  Building,
  Coins,
  Banknote,
  Wallet,
  PieChart as PieChartIcon,
  Calculator,
  ArrowUpRight,
  Filter,
  Search,
  RefreshCw,
  Bed,
  Stethoscope,
  Scissors,
  CreditCard,
  Layers,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  Database,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useGeneralSettingsContext } from "@/contexts/GeneralSettingsContext";
import { useTenant } from "@/contexts/TenantContext";
import { supabase } from "@/integrations/supabase/client";

// Format currency helper
const formatIDR = (val: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val);
};

// Format concise currency for charts
const formatIDRShort = (val: number) => {
  if (val >= 1_000_000_000) {
    return `${(val / 1_000_000_000).toFixed(1)} M`;
  }
  if (val >= 1_000_000) {
    return `${(val / 1_000_000).toFixed(0)} Jt`;
  }
  return val.toLocaleString("id-ID");
};

const pieColors = ["#10b981", "#0284c7", "#f59e0b", "#8b5cf6", "#ec4899"];

const Index = () => {
  const { settings: generalSettings } = useGeneralSettingsContext();
  const { tenant } = useTenant();

  // Filters State
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Real Database Data State
  const [unitList, setUnitList] = useState<any[]>([]);
  const [loadingDb, setLoadingDb] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Fetch real database records from Supabase
  useEffect(() => {
    fetchLiveDashboardData();
  }, [selectedYear]);

  const fetchLiveDashboardData = async () => {
    setIsRefreshing(true);
    setLoadingDb(true);
    try {
      // 1. Fetch real unit_kerja from database
      const { data: dbUnits, error: unitErr } = await supabase
        .from("unit_kerja")
        .select("*")
        .order("created_at", { ascending: false });

      if (unitErr) console.warn("Notice: Error fetching unit_kerja:", unitErr);

      // 2. Fetch real data_biaya from database
      const { data: dbBiaya, error: biayaErr } = await supabase
        .from("data_biaya")
        .select("*");

      if (biayaErr) console.warn("Notice: Error fetching data_biaya:", biayaErr);

      // 3. Fetch real data_pendapatan from database
      const { data: dbPendapatan, error: revErr } = await supabase
        .from("data_pendapatan")
        .select("*");

      if (revErr) console.warn("Notice: Error fetching data_pendapatan:", revErr);

      const units = dbUnits || [];
      const biayaItems = dbBiaya || [];
      const pendapatanItems = dbPendapatan || [];

      if (units.length > 0) {
        const mapped = units.map((u: any) => {
          // Calculate direct & indirect costs from data_biaya
          const unitBiaya = biayaItems.filter(
            (b: any) => b.unit_kerja_id === u.id || b.unit_id === u.id || b.kode_unit === u.kode
          );

          const direct = unitBiaya.reduce(
            (acc: number, curr: any) => acc + Number(curr.biaya_langsung || curr.jumlah_biaya || curr.biaya || 0),
            0
          );

          const indirect = unitBiaya.reduce(
            (acc: number, curr: any) => acc + Number(curr.biaya_tidak_langsung || 0),
            0
          );

          const totalBiayaCalculated = direct + indirect;

          // Calculate revenue from data_pendapatan
          const unitRev = pendapatanItems.filter(
            (p: any) => p.unit_kerja_id === u.id || p.unit_id === u.id || p.kode_unit === u.kode
          );

          const totalRevCalculated = unitRev.reduce(
            (acc: number, curr: any) => acc + Number(curr.jumlah_pendapatan || curr.pendapatan || curr.total || 0),
            0
          );

          // Categorize group based on unit properties
          let groupLabel = "Unit Pelayanan";
          if (u.kategori === "Pusat Biaya") groupLabel = "Unit Penunjang";
          if (u.jenis === 2 || u.jenis === "Rawat Inap") groupLabel = "Unit Keperawatan";
          if (u.jenis === 1 || u.jenis === "Rawat Jalan") groupLabel = "Unit Pelayanan";
          if (u.jenis === 4 || u.jenis === "Non Layanan") groupLabel = "Unit Diklat";

          return {
            id: u.id,
            name: u.nama || u.nama_unit || `Unit ${u.kode || u.id}`,
            group: groupLabel,
            directBiaya: direct,
            indirectBiaya: indirect,
            totalBiaya: totalBiayaCalculated,
            pendapatan: totalRevCalculated,
            volume: u.luas_ruangan || u.kapasitas || 0,
            unitCost: totalBiayaCalculated > 0 && u.luas_ruangan ? Math.round(totalBiayaCalculated / u.luas_ruangan) : 0,
            targetTarif: totalRevCalculated > 0 && u.luas_ruangan ? Math.round(totalRevCalculated / u.luas_ruangan) : 0,
          };
        });
        setUnitList(mapped);
      } else {
        // If database has 0 unit_kerja records, set to empty array []
        setUnitList([]);
      }
    } catch (err) {
      console.error("Dashboard DB fetch exception:", err);
      setUnitList([]);
    } finally {
      setLoadingDb(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchLiveDashboardData();
  };

  // Filtered dataset based on user filter selections
  const filteredData = useMemo(() => {
    return unitList.filter((item) => {
      const matchGroup = selectedGroup === "all" || item.group === selectedGroup;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.group.toLowerCase().includes(searchQuery.toLowerCase());

      const cr = item.totalBiaya > 0 ? (item.pendapatan / item.totalBiaya) * 100 : 0;
      let status = "defisit";
      if (cr >= 105) status = "profit";
      else if (cr >= 95) status = "breakeven";

      const matchStatus = selectedStatus === "all" || selectedStatus === status;

      return matchGroup && matchSearch && matchStatus;
    });
  }, [unitList, selectedGroup, searchQuery, selectedStatus]);

  // Aggregate Metrics from database
  const totalBiaya = useMemo(() => filteredData.reduce((acc, curr) => acc + curr.totalBiaya, 0), [filteredData]);
  const totalDirectBiaya = useMemo(() => filteredData.reduce((acc, curr) => acc + curr.directBiaya, 0), [filteredData]);
  const totalIndirectBiaya = useMemo(() => filteredData.reduce((acc, curr) => acc + curr.indirectBiaya, 0), [filteredData]);
  const totalPendapatan = useMemo(() => filteredData.reduce((acc, curr) => acc + curr.pendapatan, 0), [filteredData]);
  const avgCostRecovery = useMemo(() => (totalBiaya > 0 ? (totalPendapatan / totalBiaya) * 100 : 0), [totalBiaya, totalPendapatan]);

  // Chart Data: Group Breakdown (Composed Bar)
  const groupChartData = useMemo(() => {
    if (filteredData.length === 0) return [];
    const map = new Map<string, { group: string; Direct: number; Indirect: number; Pendapatan: number }>();
    filteredData.forEach((item) => {
      const existing = map.get(item.group) || { group: item.group, Direct: 0, Indirect: 0, Pendapatan: 0 };
      existing.Direct += item.directBiaya;
      existing.Indirect += item.indirectBiaya;
      existing.Pendapatan += item.pendapatan;
      map.set(item.group, existing);
    });
    return Array.from(map.values());
  }, [filteredData]);

  // Chart Data: Cost Structure Breakdown (Pie Chart)
  const costStructurePie = useMemo(() => {
    if (totalBiaya === 0) return [];
    return [
      { name: "Biaya Direct / Operasional", value: totalDirectBiaya },
      { name: "Biaya Indirect / Overhead", value: totalIndirectBiaya },
    ];
  }, [totalBiaya, totalDirectBiaya, totalIndirectBiaya]);

  const instansiTitle = generalSettings?.nama_instansi || tenant?.name || "RSUD Kerinci";

  return (
    <div className="flex flex-col gap-6 pb-12 w-full">
      {/* 1. Fresh Light Emerald Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 p-6 md:p-8 text-white shadow-xl border border-emerald-300/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-teal-300/20 blur-xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold backdrop-blur-md shadow-2xs">
              <Building className="h-3.5 w-3.5" />
              <span>{instansiTitle}</span>
              <span className="text-emerald-100">•</span>
              <span>Periode Tahun {selectedYear}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow-xs">
              Dashboard Eksekutif Unit Cost & Cost Recovery
            </h1>
            <p className="text-emerald-50 text-xs md:text-sm font-medium leading-relaxed max-w-xl">
              Ringkasan integratif kalkulasi biaya langsung, biaya tidak langsung, dan kinerja keuangan real-time dari database.
            </p>
          </div>

          <div className="flex items-center gap-3 self-stretch md:self-auto shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-md text-xs font-semibold h-10 px-4 rounded-xl shadow-xs"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh Data DB
            </Button>
            <Link to="/rekapitulasi-unit-cost">
              <Button size="sm" className="bg-white text-emerald-800 hover:bg-emerald-50 font-bold h-10 px-5 rounded-xl shadow-md text-xs border border-white/50">
                <BarChart3 className="mr-2 h-4 w-4 text-emerald-600" />
                Rekapitulasi Unit Cost
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Interactive Filter Bar */}
      <Card className="border-slate-200/80 shadow-xs bg-white rounded-2xl">
        <CardContent className="p-4 md:p-5">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm shrink-0">
              <Filter className="h-4 w-4 text-emerald-600" />
              <span>Filter Data Database</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
              {/* Filter Unit Kerja */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-500">Kelompok Unit</label>
                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                  <SelectTrigger className="h-9 text-xs rounded-xl bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Pilih Kelompok Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kelompok Unit</SelectItem>
                    <SelectItem value="Unit Pelayanan">Unit Pelayanan</SelectItem>
                    <SelectItem value="Unit Penunjang">Unit Penunjang</SelectItem>
                    <SelectItem value="Unit Keperawatan">Unit Keperawatan</SelectItem>
                    <SelectItem value="Unit Diklat">Unit Diklat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter Tahun */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-500">Tahun Anggaran</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="h-9 text-xs rounded-xl bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Pilih Tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2026">Tahun 2026</SelectItem>
                    <SelectItem value="2025">Tahun 2025</SelectItem>
                    <SelectItem value="2024">Tahun 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter Status Margin */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-500">Status Cost Recovery</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="h-9 text-xs rounded-xl bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="profit">Surplus / Profit (&gt;105%)</SelectItem>
                    <SelectItem value="breakeven">Break Even (95% - 105%)</SelectItem>
                    <SelectItem value="defisit">Subsidized / Defisit (&lt;95%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Live Search */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-500">Cari Unit Kerja</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Nama unit..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 text-xs rounded-xl bg-slate-50 border-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Summary KPI Cards (No $ icons used) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Biaya Operasional (Using Banknote icon, NO $) */}
        <Card className="border-slate-200/80 shadow-xs hover:shadow-md transition-all rounded-2xl bg-white overflow-hidden group">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Biaya Operasional</span>
              <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Banknote className="h-5 w-5" />
              </div>
            </div>
            <div className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              {formatIDR(totalBiaya)}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs border-t border-slate-100 pt-2.5">
              <span className="text-slate-500">Direct / Indirect</span>
              <span className="font-semibold text-slate-700">
                {formatIDRShort(totalDirectBiaya)} / {formatIDRShort(totalIndirectBiaya)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Total Pendapatan RS (Using Coins icon, NO $) */}
        <Card className="border-slate-200/80 shadow-xs hover:shadow-md transition-all rounded-2xl bg-white overflow-hidden group">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Pendapatan RS</span>
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Coins className="h-5 w-5" />
              </div>
            </div>
            <div className="text-xl md:text-2xl font-extrabold text-emerald-700 tracking-tight">
              {formatIDR(totalPendapatan)}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs border-t border-slate-100 pt-2.5">
              <span className="text-slate-500">Realisasi Pendapatan</span>
              <Badge className="bg-emerald-100 text-emerald-700 border-none px-2 py-0.5 text-[10px] font-bold">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> Database Real
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Cost Recovery Rate */}
        <Card className="border-slate-200/80 shadow-xs hover:shadow-md transition-all rounded-2xl bg-white overflow-hidden group">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cost Recovery Rate</span>
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Calculator className="h-5 w-5" />
              </div>
            </div>
            <div className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-2">
              <span>{avgCostRecovery.toFixed(1)}%</span>
              <span className="text-xs font-normal text-slate-500">Rata-rata</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs border-t border-slate-100 pt-2.5">
              <span className="text-slate-500">Status Margin</span>
              <Badge className={avgCostRecovery >= 100 ? "bg-emerald-100 text-emerald-800 font-bold" : "bg-slate-100 text-slate-700 font-bold"}>
                {avgCostRecovery >= 100 ? "Surplus / Rentabel" : totalBiaya === 0 ? "Belum Ada Data" : "Defisit Subsidized"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Jumlah Unit & Layanan */}
        <Card className="border-slate-200/80 shadow-xs hover:shadow-md transition-all rounded-2xl bg-white overflow-hidden group">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unit Kerja Terdaftar</span>
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Building className="h-5 w-5" />
              </div>
            </div>
            <div className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              {filteredData.length} <span className="text-xs font-normal text-slate-500">Unit Kerja</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs border-t border-slate-100 pt-2.5">
              <span className="text-slate-500">Sumber Data</span>
              <span className="font-semibold text-teal-700 flex items-center gap-1">
                <Database className="h-3 w-3" /> Tabel unit_kerja
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Biaya Direct, Indirect & Pendapatan per Kelompok Unit */}
        <Card className="lg:col-span-2 border-slate-200/80 shadow-xs rounded-2xl bg-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Perbandingan Biaya & Pendapatan Database</CardTitle>
                <CardDescription className="text-xs text-slate-500">Distribusi Biaya Direct, Biaya Indirect, dan Total Pendapatan per Kelompok Unit Kerja</CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] font-semibold bg-slate-50">Integrasi DB</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {groupChartData.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={groupChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="group" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={formatIDRShort} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      formatter={(val: number) => formatIDR(val)}
                      contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                    <Bar dataKey="Direct" name="Biaya Direct" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={45} />
                    <Bar dataKey="Indirect" name="Biaya Indirect" fill="#6ee7b7" radius={[6, 6, 0, 0]} maxBarSize={45} />
                    <Line type="monotone" dataKey="Pendapatan" name="Total Pendapatan" stroke="#0284c7" strokeWidth={3} dot={{ r: 5, fill: "#0284c7" }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-slate-400 gap-2 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <Database className="h-8 w-8 text-slate-300" />
                <p className="text-xs font-medium">Belum ada data unit kerja di database untuk ditampilkan pada grafik.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chart 2: Komposisi Biaya (Pie Chart) */}
        <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-slate-900">Komposisi Biaya RS</CardTitle>
            <CardDescription className="text-xs text-slate-500">Perbandingan Biaya Direct vs Indirect dari DB</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 flex-1 flex flex-col justify-center">
            {costStructurePie.length > 0 ? (
              <>
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={costStructurePie}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {costStructurePie.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val: number) => formatIDR(val)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 gap-2 mt-2 pt-2 border-t border-slate-100">
                  {costStructurePie.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: pieColors[idx] }}></span>
                        <span className="text-slate-600 text-[11px] font-medium">{item.name}</span>
                      </div>
                      <span className="font-bold text-slate-900">{formatIDR(item.value)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[260px] flex flex-col items-center justify-center text-slate-400 gap-2 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <PieChartIcon className="h-8 w-8 text-slate-300" />
                <p className="text-xs text-center font-medium px-4">Belum ada data rincian biaya pada database.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 5. Data Tabulasi Ringkasan Unit Cost */}
      <Card className="border-slate-200/80 shadow-xs rounded-2xl bg-white overflow-hidden">
        <CardHeader className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="h-5 w-5 text-emerald-600" />
              <span>Data Tabulasi Unit Cost Real-Time Database</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Rincian kalkulasi unit cost terintegrasi langsung dari tabel database
            </CardDescription>
          </div>
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1 text-xs">
            {filteredData.length} Data Unit Terhubung
          </Badge>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Nama Unit Kerja</th>
                <th className="py-3.5 px-4">Kelompok</th>
                <th className="py-3.5 px-4 text-right">Biaya Direct</th>
                <th className="py-3.5 px-4 text-right">Biaya Indirect</th>
                <th className="py-3.5 px-4 text-right">Total Unit Cost</th>
                <th className="py-3.5 px-4 text-right">Total Pendapatan</th>
                <th className="py-3.5 px-4 text-center">Cost Recovery (%)</th>
                <th className="py-3.5 px-4 text-center">Status Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length > 0 ? (
                filteredData.map((item) => {
                  const cr = item.totalBiaya > 0 ? (item.pendapatan / item.totalBiaya) * 100 : 0;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">{item.name}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-[10px] font-medium bg-white text-slate-600">
                          {item.group}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-slate-600">{formatIDR(item.directBiaya)}</td>
                      <td className="py-3 px-4 text-right font-medium text-slate-500">{formatIDR(item.indirectBiaya)}</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900">{formatIDR(item.totalBiaya)}</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-700">{formatIDR(item.pendapatan)}</td>
                      <td className="py-3 px-4 text-center font-bold">
                        <span className={cr >= 100 ? "text-emerald-600" : "text-slate-600"}>
                          {cr.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {cr >= 105 ? (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] font-bold inline-flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Surplus
                          </Badge>
                        ) : cr >= 95 ? (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-[10px] font-bold inline-flex items-center gap-1">
                            Break Even
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-[10px] font-bold inline-flex items-center gap-1">
                            Belum Ada Pendapatan
                          </Badge>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-medium">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="p-3 rounded-full bg-slate-100 text-slate-400">
                        <Database className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-semibold text-slate-700">Belum ada data unit kerja di database.</p>
                      <p className="text-xs text-slate-400 max-w-sm">
                        Silakan tambahkan unit kerja baru di halaman Data Master untuk memulai kalkulasi unit cost.
                      </p>
                      <Link to="/data-master/unit-kerja">
                        <Button size="sm" className="mt-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold">
                          <PlusCircle className="h-4 w-4 mr-1.5" /> Tambah Unit Kerja Baru
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* 6. Quick Access Navigation Grid (Akses Cepat Modul Utama) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ChevronRight className="h-5 w-5 text-emerald-600" />
            <span>Akses Cepat Modul Utama Unit Cost</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">Pintas navigasi analisis dan kalkulasi</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Rekapitulasi Unit Cost */}
          <Link to="/rekapitulasi-unit-cost" className="group">
            <Card className="h-full border-slate-200/80 hover:border-emerald-500/60 shadow-xs hover:shadow-md transition-all rounded-2xl bg-white p-4 group-hover:-translate-y-0.5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 truncate">Rekapitulasi Unit Cost</h3>
                  <p className="text-[11px] text-slate-500 truncate">Laporan komprehensif unit cost</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </div>
            </Card>
          </Link>

          {/* Card 2: Skenario Tarif Tindakan */}
          <Link to="/skenario-tarif-tindakan" className="group">
            <Card className="h-full border-slate-200/80 hover:border-teal-500/60 shadow-xs hover:shadow-md transition-all rounded-2xl bg-white p-4 group-hover:-translate-y-0.5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <Scissors className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 truncate">Skenario Tarif Tindakan</h3>
                  <p className="text-[11px] text-slate-500 truncate">Simulasi penetapan tarif layanan</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
              </div>
            </Card>
          </Link>

          {/* Card 3: Skenario Tarif Akomodasi */}
          <Link to="/skenario-tarif-akomodasi" className="group">
            <Card className="h-full border-slate-200/80 hover:border-blue-500/60 shadow-xs hover:shadow-md transition-all rounded-2xl bg-white p-4 group-hover:-translate-y-0.5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Bed className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 truncate">Skenario Tarif Akomodasi</h3>
                  <p className="text-[11px] text-slate-500 truncate">Calculated tarif kelas rawat inap</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </Card>
          </Link>

          {/* Card 4: Skenario Tarif Visit & Konsultasi */}
          <Link to="/skenario-tarif-visit" className="group">
            <Card className="h-full border-slate-200/80 hover:border-indigo-500/60 shadow-xs hover:shadow-md transition-all rounded-2xl bg-white p-4 group-hover:-translate-y-0.5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 truncate">Tarif Visit & Konsultasi</h3>
                  <p className="text-[11px] text-slate-500 truncate">Simulasi jasa dokter & visitasi</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </div>
            </Card>
          </Link>

          {/* Card 5: Distribusi Biaya */}
          <Link to="/distribusi-biaya-rekap" className="group">
            <Card className="h-full border-slate-200/80 hover:border-purple-500/60 shadow-xs hover:shadow-md transition-all rounded-2xl bg-white p-4 group-hover:-translate-y-0.5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 truncate">Distribusi Biaya Rekap</h3>
                  <p className="text-[11px] text-slate-500 truncate">Double Distribution ABC Costing</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
              </div>
            </Card>
          </Link>

          {/* Card 6: Budgeting BHP */}
          <Link to="/budgeting-bhp/rupiah" className="group">
            <Card className="h-full border-slate-200/80 hover:border-amber-500/60 shadow-xs hover:shadow-md transition-all rounded-2xl bg-white p-4 group-hover:-translate-y-0.5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 truncate">Budgeting BHP (Rupiah)</h3>
                  <p className="text-[11px] text-slate-500 truncate">Anggaran bahan habis pakai</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
              </div>
            </Card>
          </Link>

          {/* Card 7: Cost Recovery Analysis */}
          <Link to="/cost-recovery" className="group">
            <Card className="h-full border-slate-200/80 hover:border-cyan-500/60 shadow-xs hover:shadow-md transition-all rounded-2xl bg-white p-4 group-hover:-translate-y-0.5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                  <PieChartIcon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-cyan-700 truncate">Cost Recovery Analysis</h3>
                  <p className="text-[11px] text-slate-500 truncate">Analisis margin & profitabilitas</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-cyan-600 transition-colors" />
              </div>
            </Card>
          </Link>

          {/* Card 8: Data Master Unit Kerja */}
          <Link to="/data-master/unit-kerja" className="group">
            <Card className="h-full border-slate-200/80 hover:border-rose-500/60 shadow-xs hover:shadow-md transition-all rounded-2xl bg-white p-4 group-hover:-translate-y-0.5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  <Building className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-rose-700 truncate">Data Master Unit Kerja</h3>
                  <p className="text-[11px] text-slate-500 truncate">Kelola struktur unit RS</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-rose-600 transition-colors" />
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;