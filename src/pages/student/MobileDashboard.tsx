
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, Clock, Calendar, FileText, ChevronRight, User, Bell, Search, GraduationCap } from 'lucide-react';
import { DashboardActivityFeed } from '@/components/Dashboard/DashboardActivityFeed';
import { useNavigate } from 'react-router-dom';

export function MobileStudentDashboard({ user }: { user?: any }) {
    const navigate = useNavigate();
    const siswa = user?.siswa;

    // Calculate Progress dynamically
    const currentStep = siswa?.current_step || 0;
    const totalSteps = siswa?.total_steps || 6;
    const progressPercent = totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0;
    const processName = siswa?.current_process_name || 'Menunggu Program';

    // Format Date safely
    let targetDate = 'Belum ditentukan';
    if (siswa?.target_completion_date) {
        try {
            const date = new Date(siswa.target_completion_date);
            targetDate = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(date);
        } catch (e) { /* ignore invalid date */ }
    }

    return (
        <div className="space-y-5 pb-24">
            {/* COMPACT HEADER */}
            <div className="flex items-center justify-between px-2 pt-2">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                        <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selamat Pagi,</p>
                        <h1 className="text-lg font-black font-sans text-slate-900 leading-none capitalize">{user?.name?.split(' ')[0] || 'Siswa'}</h1>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="h-10 w-10 rounded-full border border-slate-100 bg-white flex items-center justify-center shadow-sm active:scale-95 transition-transform">
                        <Search className="h-4 w-4 text-slate-500" />
                    </button>
                    <button className="h-10 w-10 rounded-full border border-slate-100 bg-white flex items-center justify-center shadow-sm active:scale-95 transition-transform relative">
                        <Bell className="h-4 w-4 text-slate-500" />
                        <div className="absolute top-2 right-2.5 h-1.5 w-1.5 bg-red-500 rounded-full border border-white"></div>
                    </button>
                </div>
            </div>

            {/* HERO STATUS CARD - COMPACT */}
            <div className="mx-2 bg-slate-900 rounded-3xl p-4 text-white shadow-xl shadow-slate-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status Program</p>
                            <h2 className="text-lg font-black font-sans tracking-tight">{processName}</h2>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                            <span className="text-[9px] font-bold">Langkah {currentStep}/{totalSteps}</span>
                        </div>
                    </div>

                    {/* Progress Visual */}
                    <div className="space-y-1.5">
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                        <p className="text-[9px] text-slate-500 font-medium text-right">Target: {targetDate}</p>
                    </div>
                </div>
            </div>

            {/* QUICK STATS - HORIZONTAL SCROLL / GRID */}
            <div className="grid grid-cols-3 gap-2 px-2">
                <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-1">
                    <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center mb-1">
                        <Clock className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-lg font-black text-slate-900 font-sans leading-none">98%</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Hadir</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-1">
                    <div className="h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center mb-1">
                        <BarChart3 className="w-4 h-4 text-orange-600" />
                    </div>
                    <span className="text-lg font-black text-slate-900 font-sans leading-none">A-</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Nilai</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-1">
                    <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center mb-1">
                        <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-lg font-black text-slate-900 font-sans leading-none">Ok</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Dokumen</span>
                </div>
            </div>

            {/* QUICK ACTIONS MENU */}
            <div className="px-2">
                <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Akses Cepat</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <button onClick={() => navigate('/learning-modules')} className="flex flex-col items-center gap-2 group">
                        <div className="h-14 w-full rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center group-active:scale-95 transition-transform aspect-[5/4]">
                            <GraduationCap className="w-7 h-7 text-indigo-500" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 text-center leading-tight">Materi<br />Belajar</span>
                    </button>
                    <button onClick={() => navigate('/education')} className="flex flex-col items-center gap-2 group">
                        <div className="h-14 w-full rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center group-active:scale-95 transition-transform aspect-[5/4]">
                            <Calendar className="w-7 h-7 text-pink-500" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 text-center leading-tight">Jadwal<br />Kelas</span>
                    </button>
                    <button onClick={() => navigate('/profile')} className="flex flex-col items-center gap-2 group">
                        <div className="h-14 w-full rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center group-active:scale-95 transition-transform aspect-[5/4]">
                            <User className="w-7 h-7 text-emerald-500" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 text-center leading-tight">Profil<br />Saya</span>
                    </button>
                </div>
            </div>

            {/* ACTIVITY FEED - REDESIGNED */}
            <div className="px-2">
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Aktivitas Terbaru</h3>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                    <div className="p-2">
                        <DashboardActivityFeed />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Dummy Activity Feed Wrapper to match aesthetics if needed,
// though DashboardActivityFeed internal style is good but might need tweak if user complains.
