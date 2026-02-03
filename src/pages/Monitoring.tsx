
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMonitoringData } from "@/hooks/useMonitoringData";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area,
    LineChart, Line, Legend
} from 'recharts';
import {
    Activity, Target, ShieldCheck, Users, TrendingUp, BarChart3,
    Filter, Calendar, Building2, School
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatNumber } from '@/lib/format';

export default function MonitoringPage() {
    const [period, setPeriod] = useState('monthly');
    const { data: kpiData, isLoading } = useMonitoringData({ period });

    if (isLoading) return <div className="flex justify-center p-20"><LoadingSpinner size={48} /></div>;

    const summary = kpiData?.summary || { totalSiswa: 0, totalSiswaMagang: 0, totalKumiai: 0, totalLpkMitra: 0 };
    const chartData = kpiData?.chartData || [];

    return (
        <div className="space-y-8 animate-fade-in p-2 sm:p-4">
            {/* Dynamic Header with Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight font-outfit uppercase">Monitoring & KPI</h1>
                    <p className="text-slate-500 font-medium tracking-wide flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                        Statistik Real-time Operasional LPK UJC
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Periode:</span>
                    </div>
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-[180px] rounded-2xl border-slate-100 font-bold text-slate-700 bg-white shadow-sm">
                            <SelectValue placeholder="Pilih Periode" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                            <SelectItem value="monthly" className="font-bold">Bulanan</SelectItem>
                            <SelectItem value="quarterly" className="font-bold">Kuartal</SelectItem>
                            <SelectItem value="yearly" className="font-bold">Tahunan</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Siswa', value: summary.totalSiswa, icon: Users, color: 'blue', trend: '+5% Baru' },
                    { label: 'Siswa Magang', value: summary.totalSiswaMagang, icon: ShieldCheck, color: 'emerald', trend: 'On Track' },
                    { label: 'Kumiai Aktif', value: summary.totalKumiai, icon: Building2, color: 'orange', trend: 'Stabil' },
                    { label: 'LPK Mitra', value: summary.totalLpkMitra, icon: School, color: 'purple', trend: '+1 Baru' },
                ].map((stat, idx) => (
                    <Card key={idx} className="flat-card group border-none shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
                        <CardContent className="pt-8">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-4 rounded-3xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform duration-500`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <Badge className="bg-slate-50 text-slate-400 border-none font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full">
                                    {stat.trend}
                                </Badge>
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-1">{stat.label}</p>
                            <h2 className="text-4xl font-black text-slate-900 font-outfit tracking-tighter">
                                {formatNumber(stat.value)}
                            </h2>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <Card className="lg:col-span-8 flat-card border-none overflow-hidden">
                    <CardHeader className="bg-slate-50/50 p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-slate-600">
                                <TrendingUp className="w-4 h-4 text-primary" />
                                Grafik Progres Penempatan
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-10 h-[450px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorSiswa" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="period"
                                    fontSize={10}
                                    fontWeight={900}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8' }}
                                />
                                <YAxis
                                    fontSize={10}
                                    fontWeight={900}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8' }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                                />
                                <Legend iconType="circle" />
                                <Area
                                    type="monotone"
                                    dataKey="siswaMagang"
                                    name="Siswa Magang"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorSiswa)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="pencapaian"
                                    name="Realisasi Target"
                                    stroke="#10b981"
                                    strokeWidth={4}
                                    fill="transparent"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-4 flat-card border-none overflow-hidden h-full">
                    <CardHeader className="bg-slate-50/50 p-8 border-b border-slate-50">
                        <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-slate-600">
                            <BarChart3 className="w-4 h-4 text-orange-500" />
                            Target vs Realisasi
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-10">
                        {[
                            { label: 'Siswa Penempatan', target: 100, current: summary.totalSiswaMagang, color: 'blue' },
                            { label: 'Kumiai Jepang', target: 50, current: summary.totalKumiai, color: 'orange' },
                            { label: 'Siswa Reguler', target: 500, current: summary.totalSiswa, color: 'purple' },
                        ].map((item, idx) => {
                            const percentage = Math.round((item.current / item.target) * 100);
                            return (
                                <div key={idx} className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                                            <p className="text-lg font-black text-slate-800 font-outfit uppercase">{item.current} / {item.target}</p>
                                        </div>
                                        <div className="text-2xl font-black text-slate-900 font-outfit">{percentage}%</div>
                                    </div>
                                    <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                                        <div
                                            className={`h-full rounded-full bg-${item.color}-500 transition-all duration-1000 ease-out`}
                                            style={{ width: `${Math.min(percentage, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 ${className}`}>
            {children}
        </span>
    );
}
