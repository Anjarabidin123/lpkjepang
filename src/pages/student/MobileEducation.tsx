
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Medal, Calendar, Target, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface MobileEducationProps {
    attendance: any[];
    grades: any[];
    schedules?: any[];
    presencePercentage: number;
}

export function MobileEducation({ attendance, grades, schedules = [], presencePercentage }: MobileEducationProps) {
    const dayMap: Record<string, string> = { 'Monday': 'Senin', 'Tuesday': 'Selasa', 'Wednesday': 'Rabu', 'Thursday': 'Kamis', 'Friday': 'Jumat', 'Saturday': 'Sabtu', 'Sunday': 'Minggu' };

    // Helper to sort schedules: Today first, then by day index, then time
    const daysOrder = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    const sortedSchedules = [...schedules].sort((a, b) => {
        const da = daysOrder.indexOf(dayMap[a.day_of_week] || a.day_of_week);
        const db = daysOrder.indexOf(dayMap[b.day_of_week] || b.day_of_week);
        return da - db || a.start_time.localeCompare(b.start_time);
    });

    return (
        <div className="space-y-4 pb-10">
            {/* Minimalist Summary */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-50">
                <div>
                    <h1 className="text-lg font-black text-slate-900 font-outfit uppercase">Pendidikan</h1>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Progress Akademik</p>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
                    <Medal className="w-4 h-4 text-primary" />
                    <span className="text-sm font-black text-primary">{presencePercentage}%</span>
                </div>
            </div>

            {/* Schedules Section - New */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 px-1">
                    <Clock className="w-4 h-4 text-violet-500" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Jadwal Kelas</h3>
                </div>
                {sortedSchedules.length === 0 ? (
                    <Card className="border-none shadow-sm rounded-2xl py-6 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">Belum ada jadwal</Card>
                ) : (
                    <div className="grid grid-cols-1 gap-2">
                        {sortedSchedules.map((s: any) => (
                            <div key={s.id} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-violet-100 bg-violet-50 text-violet-600 rounded-md uppercase tracking-wider">{s.day_of_week}</Badge>
                                        <span className="text-[10px] font-mono font-bold text-slate-400">{s.start_time.slice(0, 5)}</span>
                                    </div>
                                    <div className="font-bold text-slate-800 text-sm">{s.subject}</div>
                                    <div className="text-[10px] text-slate-500 font-medium">{s.room} {s.teacher_name && `• ${s.teacher_name}`}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Attendance - Horizontal Scroll or List */}
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="p-4 border-b border-slate-50 flex flex-row items-center justify-between">
                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        Absensi Terakhir
                    </CardTitle>
                    {attendance.length > 0 && (
                        <span className="text-[9px] font-bold text-blue-500 uppercase">Lihat Semua</span>
                    )}
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-50">
                        {attendance.length === 0 ? (
                            <div className="py-10 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">Belum ada riwayat</div>
                        ) : (
                            attendance.slice(0, 5).map((a: any) => (
                                <div key={a.id} className="p-4 flex items-center justify-between">
                                    <div className="text-xs font-bold text-slate-700">
                                        {format(new Date(a.date), 'dd MMM yyyy', { locale: id })}
                                    </div>
                                    <Badge className={`rounded-lg font-black text-[9px] tracking-widest ${a.status === 'hadiir' ? 'bg-emerald-50 text-emerald-600 border-none' : 'bg-red-50 text-red-600 border-none'}`}>
                                        {a.status.toUpperCase()}
                                    </Badge>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Grades - Compact Cards */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                    <Target className="w-4 h-4 text-orange-500" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Transkrip Nilai</h3>
                </div>
                {grades.length === 0 ? (
                    <Card className="border-none shadow-sm rounded-2xl py-10 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">Belum ada nilai</Card>
                ) : (
                    grades.map((g: any) => (
                        <Card key={g.id} className="border-none shadow-sm rounded-2xl overflow-hidden">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl ${g.result === 'pass' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                        {g.result === 'pass' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <div className="text-xs font-black text-slate-800 uppercase tracking-tight">{g.subject}</div>
                                        <div className="text-[9px] font-bold text-slate-400">{format(new Date(g.exam_date), 'dd/MM/yyyy')}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-lg font-black font-outfit ${g.score >= 70 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {g.score}
                                    </div>
                                    <div className="text-[8px] font-bold text-slate-300 uppercase">Score</div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
