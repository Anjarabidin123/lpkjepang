
// Education Page - Optimized for Student Mobile
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEducation } from "@/hooks/useEducation";
import { useAuth } from "@/hooks/useAuth";
import { GraduationCap, CheckCircle2, XCircle, Calendar, Trash2, Search, Medal, Target, Plus, UserCheck, Clock } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";
import { authFetch } from "@/lib/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileEducation } from "@/pages/student/MobileEducation";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSiswa } from "@/hooks/useSiswa";

// SUB-COMPONENTS FOR ADMIN
function AttendanceAdminView({ attendance }: { attendance: any[] }) {
    const [isBulkOpen, setIsBulkOpen] = useState(false);
    const { bulkAttendance } = useEducation();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100/50">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500 rounded-2xl text-white shadow-lg shadow-emerald-200">
                        <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800 font-sans uppercase">Absensi Harian</h2>
                        <p className="text-emerald-600 text-xs font-bold tracking-wide">Input kehadiran siswa secara masal</p>
                    </div>
                </div>
                <Button onClick={() => setIsBulkOpen(true)} className="bg-slate-900 hover:bg-black text-white rounded-2xl px-6 font-bold shadow-xl shadow-slate-200">
                    <Plus className="w-4 h-4 mr-2" />
                    Input Absensi Baru
                </Button>
            </div>

            <Card className="flat-card overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent border-slate-50">
                                <TableHead className="font-black text-slate-400 text-[11px] uppercase tracking-widest h-14 pl-8">Tanggal</TableHead>
                                <TableHead className="font-black text-slate-400 text-[11px] uppercase tracking-widest h-14">Siswa</TableHead>
                                <TableHead className="font-black text-slate-400 text-[11px] uppercase tracking-widest h-14">Status</TableHead>
                                <TableHead className="font-black text-slate-400 text-[11px] uppercase tracking-widest h-14">Catatan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {attendance.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-20 opacity-30 font-black text-xs uppercase tracking-widest">Belum ada data absensi</TableCell>
                                </TableRow>
                            ) : (
                                attendance.map((a: any) => (
                                    <TableRow key={a.id} className="border-slate-50 hover:bg-slate-50/30 transition-colors">
                                        <TableCell className="pl-8 font-bold text-slate-400 text-[11px]">{format(new Date(a.date), 'dd/MM/yyyy')}</TableCell>
                                        <TableCell className="font-bold text-slate-900 py-5">{a.siswa?.nama}</TableCell>
                                        <TableCell>
                                            <Badge className={`rounded-lg font-black text-[10px] tracking-widest ${a.status === 'hadir' ? 'bg-emerald-50 text-emerald-600 shadow-none border-emerald-100' : 'bg-red-50 text-red-600 shadow-none border-red-100'}`}>
                                                {a.status.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-500 font-medium italic">{a.notes || '-'}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <BulkAttendanceModal isOpen={isBulkOpen} onClose={() => setIsBulkOpen(false)} onSave={async (data) => {
                await bulkAttendance.mutateAsync(data);
                setIsBulkOpen(false);
            }} />
        </div>
    );
}

function GradesAdminView({ grades, onDelete, onAdd }: { grades: any[], onDelete: (id: string) => void, onAdd: () => void }) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500 rounded-2xl text-white shadow-lg shadow-blue-200">
                        <Target className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800 font-sans uppercase">Penilaian Ujian</h2>
                        <p className="text-blue-600 text-xs font-bold tracking-wide">Kelola hasil tes dan JLPT/NAT siswa</p>
                    </div>
                </div>
                <Button onClick={onAdd} className="bg-slate-900 hover:bg-black text-white rounded-2xl px-6 font-bold shadow-xl shadow-slate-200">
                    <Plus className="w-4 h-4 mr-2" />
                    Input Nilai Baru
                </Button>
            </div>

            <Card className="flat-card overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent border-slate-50">
                                <TableHead className="font-black text-slate-400 text-[11px] uppercase tracking-widest h-14 pl-8">Siswa</TableHead>
                                <TableHead className="font-black text-slate-400 text-[11px] uppercase tracking-widest h-14">Mata Pelajaran</TableHead>
                                <TableHead className="font-black text-slate-400 text-[11px] uppercase tracking-widest h-14 text-center">Skor</TableHead>
                                <TableHead className="font-black text-slate-400 text-[11px] uppercase tracking-widest h-14 text-center">Status</TableHead>
                                <TableHead className="font-black text-slate-400 text-[11px] uppercase tracking-widest h-14 text-right pr-8">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {grades.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-20 opacity-30 font-black text-xs uppercase tracking-widest">Belum ada data nilai</TableCell>
                                </TableRow>
                            ) : (
                                grades.map((g: any) => (
                                    <TableRow key={g.id} className="border-slate-50 hover:bg-slate-50/30 transition-colors">
                                        <TableCell className="pl-8 font-bold text-slate-900 py-5">{g.siswa?.nama}</TableCell>
                                        <TableCell className="font-bold text-slate-600">{g.subject}</TableCell>
                                        <TableCell className="text-center font-black text-lg font-sans text-slate-900">{g.score}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge className={`rounded-lg font-black text-[10px] tracking-widest ${g.result === 'pass' ? 'bg-emerald-50 text-emerald-600 shadow-none border-emerald-100' : 'bg-red-50 text-red-600 shadow-none border-red-100'}`}>
                                                {g.result === 'pass' ? 'LULUS' : 'GAGAL'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-8">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                                                onClick={() => onDelete(g.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

// NEW COMPONENT: SCHEUDLES ADMIN VIEW
function SchedulesAdminView({ schedules, onDelete, onAdd }: { schedules: any[], onDelete: (id: string) => void, onAdd: () => void }) {
    const daysOrder = { 'Senin': 1, 'Selasa': 2, 'Rabu': 3, 'Kamis': 4, 'Jumat': 5, 'Sabtu': 6, 'Minggu': 7 };

    // Sort schedules manually roughly
    const sortedSchedules = [...schedules].sort((a, b) => {
        const da = daysOrder[a.day_of_week] || 0;
        const db = daysOrder[b.day_of_week] || 0;
        return da - db || a.start_time.localeCompare(b.start_time);
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-violet-50/50 p-6 rounded-3xl border border-violet-100/50">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-violet-500 rounded-2xl text-white shadow-lg shadow-violet-200">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800 font-sans uppercase">Jadwal Kelas</h2>
                        <p className="text-violet-600 text-xs font-bold tracking-wide">Kelola jadwal pelajaran mingguan siswa</p>
                    </div>
                </div>
                <Button onClick={onAdd} className="bg-slate-900 hover:bg-black text-white rounded-2xl px-6 font-bold shadow-xl shadow-slate-200">
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Jadwal Baru
                </Button>
            </div>

            <Card className="flat-card overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent border-slate-50">
                                <TableHead className="font-black text-slate-400 text-[11px] uppercase tracking-widest h-14 pl-8">Hari</TableHead>
                                <TableHead className="font-black text-slate-400 text-[11px] uppercase tracking-widest h-14">Jam</TableHead>
                                <TableHead className="font-black text-slate-400 text-[11px] uppercase tracking-widest h-14">Mata Pelajaran</TableHead>
                                <TableHead className="font-black text-slate-400 text-[11px] uppercase tracking-widest h-14">Ruangan / Pengajar</TableHead>
                                <TableHead className="font-black text-slate-400 text-[11px] uppercase tracking-widest h-14 text-right pr-8">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedSchedules.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-20 opacity-30 font-black text-xs uppercase tracking-widest">Belum ada jadwal</TableCell>
                                </TableRow>
                            ) : (
                                sortedSchedules.map((s: any) => (
                                    <TableRow key={s.id} className="border-slate-50 hover:bg-slate-50/30 transition-colors">
                                        <TableCell className="pl-8 font-bold text-slate-900 py-5">
                                            <Badge variant="outline" className="rounded-lg border-violet-200 bg-violet-50 text-violet-700 font-bold uppercase tracking-wider text-[10px]">
                                                {s.day_of_week}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-bold text-slate-600 font-mono text-xs">{s.start_time.slice(0, 5)} - {s.end_time.slice(0, 5)}</TableCell>
                                        <TableCell className="font-black text-slate-800 font-sans uppercase tracking-tight">{s.subject}</TableCell>
                                        <TableCell className="text-xs font-medium text-slate-500">
                                            {s.room} {s.teacher_name && `• ${s.teacher_name}`}
                                        </TableCell>
                                        <TableCell className="text-right pr-8">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                                                onClick={() => onDelete(s.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

// MODAL COMPONENTS
function AddScheduleModal({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: (data: any) => Promise<void> }) {
    const [formData, setFormData] = useState({
        subject: '',
        day_of_week: 'Senin',
        start_time: '08:00',
        end_time: '10:00',
        room: '',
        teacher_name: '',
        is_active: true
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Buat Jadwal Kelas</DialogTitle>
                    <DialogDescription className="text-xs text-slate-500 font-medium">
                        Atur jadwal mata pelajaran mingguan.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Mata Pelajaran</Label>
                        <Input placeholder="Contoh: Bahasa Jepang N4" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Hari</Label>
                            <Select defaultValue="Senin" onValueChange={(val) => setFormData({ ...formData, day_of_week: val })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map(d => (
                                        <SelectItem key={d} value={d}>{d}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Ruangan</Label>
                            <Input placeholder="R. 101" value={formData.room} onChange={(e) => setFormData({ ...formData, room: e.target.value })} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Jam Mulai</Label>
                            <Input type="time" value={formData.start_time} onChange={(e) => setFormData({ ...formData, start_time: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Jam Selesai</Label>
                            <Input type="time" value={formData.end_time} onChange={(e) => setFormData({ ...formData, end_time: e.target.value })} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Pengajar (Opsional)</Label>
                        <Input placeholder="Nama Sensei" value={formData.teacher_name} onChange={(e) => setFormData({ ...formData, teacher_name: e.target.value })} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Batal</Button>
                    <Button onClick={() => onSave(formData)} className="bg-black text-white">Simpan Jadwal</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function AddGradeModal({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: (data: any) => Promise<void> }) {
    const { siswa } = useSiswa();
    const [formData, setFormData] = useState({
        siswa_id: '',
        subject: '',
        score: '',
        exam_date: format(new Date(), 'yyyy-MM-dd'),
        result: 'pass',
        teacher_comments: ''
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Input Nilai Baru</DialogTitle>
                    <DialogDescription className="text-xs text-slate-500 font-medium">
                        Masukkan hasil ujian siswa untuk mata pelajaran atau level bahasa tertentu.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Siswa</Label>
                        <Select onValueChange={(val) => setFormData({ ...formData, siswa_id: val })}>
                            <SelectTrigger><SelectValue placeholder="Pilih Siswa" /></SelectTrigger>
                            <SelectContent>
                                {(siswa || []).map((s: any) => (
                                    <SelectItem key={s.id} value={s.id}>{s.nama}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Mata Pelajaran / Level</Label>
                        <Input placeholder="Contoh: Hiragana Test atau JLPT N4" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Skor (0-100)</Label>
                            <Input type="number" value={formData.score} onChange={(e) => setFormData({ ...formData, score: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select defaultValue="pass" onValueChange={(val) => setFormData({ ...formData, result: val })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pass">Lulus</SelectItem>
                                    <SelectItem value="fail">Gagal</SelectItem>
                                    <SelectItem value="remidi">Remidi</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Tanggal Ujian</Label>
                        <Input type="date" value={formData.exam_date} onChange={(e) => setFormData({ ...formData, exam_date: e.target.value })} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Batal</Button>
                    <Button onClick={() => onSave(formData)} className="bg-black text-white">Simpan Nilai</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function BulkAttendanceModal({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: (data: any[]) => Promise<void> }) {
    const { siswa } = useSiswa();
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [attendanceData, setAttendanceData] = useState<Record<string, string>>({});

    const handleSave = () => {
        const payload = Object.entries(attendanceData).map(([siswaId, status]) => ({
            siswa_id: siswaId,
            date: date,
            status: status
        }));
        if (payload.length === 0) {
            toast.error("Tidak ada data absensi untuk disimpan");
            return;
        }
        onSave(payload);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Absensi Harian Masal</DialogTitle>
                    <DialogDescription className="text-xs text-slate-500 font-medium">
                        Tandai kehadiran seluruh siswa untuk hari ini atau tanggal tertentu sekaligus.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-6">
                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <Label className="font-black text-xs uppercase text-slate-400">Tanggal Absensi</Label>
                        <Input type="date" className="max-w-[200px] border-none shadow-none font-bold" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>

                    <div className="space-y-1">
                        {(siswa || []).map((s: any) => (
                            <div key={s.id} className="flex items-center justify-between p-4 bg-white border border-slate-50 rounded-2xl hover:border-slate-200 transition-all">
                                <div className="font-bold text-slate-700">{s.nama}</div>
                                <div className="flex gap-2">
                                    {['hadir', 'izin', 'sakit', 'alpha'].map((status) => (
                                        <Button
                                            key={status}
                                            variant="ghost"
                                            size="sm"
                                            className={`rounded-lg px-3 h-8 font-black text-[10px] uppercase tracking-widest transition-all ${attendanceData[s.id] === status ? (status === 'hadir' ? 'bg-emerald-50 text-emerald-600 shadow-lg shadow-emerald-100' : 'bg-red-500 text-white shadow-lg shadow-red-100') : 'text-slate-400 hover:bg-slate-100'}`}
                                            onClick={() => setAttendanceData({ ...attendanceData, [s.id]: status })}
                                        >
                                            {status.slice(0, 1)}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <DialogFooter className="bg-white sticky bottom-0 pt-4">
                    <Button variant="outline" onClick={onClose} className="rounded-xl">Batal</Button>
                    <Button onClick={handleSave} className="bg-black text-white rounded-xl px-8 shadow-xl shadow-slate-200 uppercase text-xs font-black tracking-widest">Simpan Absensi</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function EducationPage() {
    const { userRole } = useAuth();
    const { attendance, grades, schedules, loading, bulkAttendance, addGrade, addSchedule, deleteSchedule } = useEducation();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();

    // MODAL STATE
    const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
    const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false); // Not used currently (using bulk view)
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

    const handleDeleteGrade = async (id: string) => {
        if (!confirm('Hapus nilai ini?')) return;
        const resp = await authFetch(`/education/grades/${id}`, { method: 'DELETE' });
        if (resp.ok) {
            toast.success('Nilai berhasil dihapus');
            queryClient.invalidateQueries({ queryKey: ['education-grades'] });
        }
    };

    const handleDeleteSchedule = async (id: string) => {
        if (!confirm('Hapus jadwal ini?')) return;
        await deleteSchedule.mutateAsync(id);
        toast.success("Jadwal dihapus");
    };

    // Mobile view check
    const isMobile = useIsMobile();

    if (loading) return <div className="flex justify-center p-20"><LoadingSpinner size={48} /></div>;

    // STUDENT VIEW
    if (userRole === 'student') {
        const presencePercentage = Array.isArray(attendance) && attendance.length > 0
            ? Math.round((attendance.filter((a: any) => a.status === 'hadir').length / attendance.length) * 100)
            : 100;

        if (isMobile) {
            return (
                <div className="p-2">
                    <MobileEducation
                        attendance={attendance}
                        grades={grades}
                        schedules={schedules}
                        presencePercentage={presencePercentage}
                    />
                </div>
            );
        }

        return (
            <div className="space-y-8 animate-fade-in p-4">
                <div className="flex items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight font-sans uppercase">Pendidikan Saya</h1>
                        <p className="text-slate-500 font-medium tracking-wide">Pantau kehadiran dan kualifikasi bahasa Jepang Anda</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white p-4 rounded-3xl shadow-sm border border-slate-50">
                        <div className="p-3 bg-blue-50 rounded-2xl">
                            <Medal className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <div className="text-3xl font-black text-slate-900 font-sans leading-none">{presencePercentage}%</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Presensi Belajar</div>
                        </div>
                    </div>
                </div>

                {/* SCHEDULES SECTION */}
                <div className="mb-8">
                    <Card className="flat-card overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-50 p-6">
                            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 text-slate-500">
                                <Calendar className="h-4 w-4 text-violet-500" />
                                Jadwal Pelajaran
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {schedules.length === 0 ? <div className="col-span-4 text-center text-slate-400 text-xs italic py-4">Belum ada jadwal</div> :
                                    schedules.map((s: any) => (
                                        <div key={s.id} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
                                            <div className="flex justify-between items-start mb-2">
                                                <Badge variant="outline" className=" bg-violet-50 text-violet-600 border-violet-100">{s.day_of_week}</Badge>
                                                <span className="text-xs font-mono font-bold text-slate-400">{s.start_time.slice(0, 5)}</span>
                                            </div>
                                            <h4 className="font-bold text-slate-800 mb-1">{s.subject}</h4>
                                            <p className="text-xs text-slate-500">{s.room}</p>
                                        </div>
                                    ))
                                }
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
                    <Card className="flat-card overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-50 p-6">
                            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 text-slate-500">
                                <Calendar className="h-4 w-4 text-primary" />
                                Riwayat Absensi Terakhir
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-50">
                                {attendance.length === 0 ? (
                                    <div className="text-center py-20 text-slate-300 font-bold text-xs uppercase tracking-widest">Belum ada riwayat</div>
                                ) : (
                                    attendance.slice(0, 10).map((a: any) => (
                                        <div key={a.id} className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
                                            <div className="text-sm font-bold text-slate-700">
                                                {format(new Date(a.date), 'eeee, dd MMMM yyyy', { locale: id })}
                                            </div>
                                            <Badge className={`rounded-lg font-black text-[10px] tracking-widest ${a.status === 'hadir' ? 'bg-emerald-50 text-emerald-600 shadow-none border-emerald-100' : 'bg-red-50 text-red-600 shadow-none border-red-100'}`}>
                                                {a.status.toUpperCase()}
                                            </Badge>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="flat-card overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-50 p-6">
                            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 text-slate-500">
                                <Target className="h-4 w-4 text-orange-500" />
                                Transkrip Nilai Ujian
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-50">
                                {grades.length === 0 ? (
                                    <div className="text-center py-20 text-slate-300 font-bold text-xs uppercase tracking-widest">Belum ada nilai</div>
                                ) : (
                                    grades.map((g: any) => (
                                        <div key={g.id} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
                                            <div>
                                                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{format(new Date(g.exam_date), 'dd/MM/yyyy')}</div>
                                                <div className="text-sm font-black text-slate-800 font-sans uppercase tracking-tight">{g.subject}</div>
                                            </div>
                                            <div className="flex items-center gap-5">
                                                <div className="text-right">
                                                    <div className={`text-2xl font-black font-sans ${g.score >= 70 ? 'text-emerald-600' : 'text-red-600'}`}>
                                                        {g.score}
                                                    </div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nilai Akhir</div>
                                                </div>
                                                <div className={`p-2 rounded-xl ${g.result === 'pass' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                                    {g.result === 'pass' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // ADMIN VIEW: With sub-routes handling
    const isAdmin = ['admin', 'super_admin', 'instructor'].includes(userRole || '');

    return (
        <div className="space-y-8 animate-fade-in p-2 sm:p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight font-sans uppercase">Pusat Pendidikan LPK</h1>
                    <p className="text-slate-500 font-medium tracking-wide">Monitoring absensi dan penilaian akademik siswa</p>
                </div>
                {isAdmin && (
                    <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto">
                        <Button
                            variant={location.pathname.includes('/attendance') ? 'default' : 'ghost'}
                            size="sm"
                            className="rounded-xl font-bold h-9 bg-white text-slate-600 shadow-none border-none hover:bg-white/80"
                            style={{ backgroundColor: location.pathname.includes('/attendance') ? '#000' : 'transparent', color: location.pathname.includes('/attendance') ? '#fff' : '#64748b' }}
                            onClick={() => navigate('/education/attendance')}
                        >
                            <Calendar className="w-4 h-4 mr-2" />
                            Absensi
                        </Button>
                        <Button
                            variant={location.pathname.includes('/grades') ? 'default' : 'ghost'}
                            size="sm"
                            className="rounded-xl font-bold h-9"
                            style={{ backgroundColor: location.pathname.includes('/grades') ? '#000' : 'transparent', color: location.pathname.includes('/grades') ? '#fff' : '#64748b' }}
                            onClick={() => navigate('/education/grades')}
                        >
                            <Target className="w-4 h-4 mr-2" />
                            Nilai Ujian
                        </Button>
                        <Button
                            variant={location.pathname.includes('/schedules') || location.pathname === '/education' ? 'default' : 'ghost'}
                            size="sm"
                            className="rounded-xl font-bold h-9"
                            style={{ backgroundColor: (location.pathname.includes('/schedules') || location.pathname === '/education') ? '#000' : 'transparent', color: (location.pathname.includes('/schedules') || location.pathname === '/education') ? '#fff' : '#64748b' }}
                            onClick={() => navigate('/education/schedules')}
                        >
                            <Clock className="w-4 h-4 mr-2" />
                            Jadwal Kelas
                        </Button>
                    </div>
                )}
            </div>

            <Routes>
                <Route path="attendance" element={<AttendanceAdminView attendance={attendance} />} />
                <Route path="grades" element={<GradesAdminView grades={grades} onDelete={handleDeleteGrade} onAdd={() => setIsGradeModalOpen(true)} />} />
                <Route path="schedules" element={<SchedulesAdminView schedules={schedules} onDelete={handleDeleteSchedule} onAdd={() => setIsScheduleModalOpen(true)} />} />
                <Route path="/" element={<SchedulesAdminView schedules={schedules} onDelete={handleDeleteSchedule} onAdd={() => setIsScheduleModalOpen(true)} />} />
            </Routes>

            {/* MODALS */}
            <AddGradeModal
                isOpen={isGradeModalOpen}
                onClose={() => setIsGradeModalOpen(false)}
                onSave={async (data) => {
                    await addGrade.mutateAsync(data);
                    setIsGradeModalOpen(false);
                }}
            />

            <AddScheduleModal
                isOpen={isScheduleModalOpen}
                onClose={() => setIsScheduleModalOpen(false)}
                onSave={async (data) => {
                    await addSchedule.mutateAsync(data);
                    setIsScheduleModalOpen(false);
                }}
            />
        </div>
    );
}

