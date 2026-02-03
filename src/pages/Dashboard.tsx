import React from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { DashboardHero } from '@/components/Dashboard/DashboardHero';
import { DashboardStatsGrid } from '@/components/Dashboard/DashboardStatsGrid';
import { DashboardCharts } from '@/components/DashboardCharts';
import { DashboardActivityFeed } from '@/components/Dashboard/DashboardActivityFeed';
import { DashboardLocationDistribution } from '@/components/Dashboard/DashboardLocationDistribution';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileStudentDashboard } from '@/pages/student/MobileDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, Building2, Briefcase, GraduationCap } from 'lucide-react';

export default function DashboardPage() {
    const { user, userRole } = useAuth();
    const isMobile = useIsMobile();
    const {
        siswa,
        jobOrders,
        kumiai,
        perusahaan,
        isLoading
    } = useDashboardData();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <LoadingSpinner size={48} />
            </div>
        );
    }

    // Jika Siswa dan Mobile, tampilkan Dashboard khusus Mobile
    if (userRole === 'student' && isMobile) {
        return <MobileStudentDashboard user={user} />;
    }

    // Jika Siswa, tampilkan Dashboard khusus Siswa (Desktop)
    if (userRole === 'student') {
        return (
            <div className="space-y-8 animate-fade-in">
                <DashboardHero />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="flat-card-hover">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Status Keberangkatan</CardTitle>
                            <div className="p-2 bg-blue-50 rounded-xl">
                                <Briefcase className="h-4 w-4 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-slate-900">PROSES COE</div>
                            <p className="text-xs text-muted-foreground mt-1">Estimasi terbang: April 2026</p>
                        </CardContent>
                    </Card>

                    <Card className="flat-card-hover">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Riwayat Absensi</CardTitle>
                            <div className="p-2 bg-emerald-50 rounded-xl">
                                <GraduationCap className="h-4 w-4 text-emerald-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-slate-900">98%</div>
                            <p className="text-xs text-muted-foreground mt-1">Sangat Bagus (Excellent)</p>
                        </CardContent>
                    </Card>

                    <Card className="flat-card-hover">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Total Nilai</CardTitle>
                            <div className="p-2 bg-orange-50 rounded-xl">
                                <BarChart3 className="h-4 w-4 text-orange-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-slate-900">A- (89)</div>
                            <p className="text-xs text-muted-foreground mt-1">Kesiapan Bahasa: Siap</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <DashboardCharts />
                    </div>
                    <div className="lg:col-span-1">
                        <DashboardActivityFeed />
                    </div>
                </div>
            </div>
        );
    }

    // Dashboard Admin / Super Admin
    return (
        <div className="space-y-8 animate-fade-in p-2 sm:p-4">
            <DashboardHero />

            <DashboardStatsGrid
                stats={{
                    siswa: siswa.length,
                    jobOrders: jobOrders.length,
                    kumiai: kumiai.length,
                    perusahaan: perusahaan.length
                }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-8">
                    <DashboardCharts />
                    <DashboardLocationDistribution />
                </div>

                <div className="lg:col-span-4">
                    <DashboardActivityFeed />
                </div>
            </div>
        </div>
    );
}
