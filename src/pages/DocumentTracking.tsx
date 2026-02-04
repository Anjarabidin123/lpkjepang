import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDocumentTracking, DocumentTracking } from "@/hooks/useDocumentTracking";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import { FileSearch, CheckCircle2, Clock, XCircle, Plane, FileText, Search, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { authFetch } from "@/lib/api-client";
import { DocumentTrackingModal } from "@/components/Document/DocumentTrackingModal";
import { useQueryClient } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileDocumentTracking } from "@/pages/student/MobileDocumentTracking";

export default function DocumentTrackingPage() {
    const { userRole } = useAuth();
    const { trackings, stats, isLoading, updateTracking } = useDocumentTracking();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTracking, setSelectedTracking] = useState<DocumentTracking | null>(null);
    const queryClient = useQueryClient();
    const isMobile = useIsMobile();

    const filteredTrackings = trackings.filter(t =>
        t.siswa?.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.siswa?.nik.includes(searchTerm)
    );

    const handleDelete = async (id: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus data tracking ini?')) return;

        try {
            const response = await authFetch(`/document-tracking/${id}`, { method: 'DELETE' });
            if (response.ok) {
                toast.success('Data tracking berhasil dihapus');
                queryClient.invalidateQueries({ queryKey: ['document-tracking'] });
            } else {
                toast.error('Gagal menghapus data');
            }
        } catch (error) {
            toast.error('Terjadi kesalahan sistem');
        }
    };

    const handleEdit = (tracking: DocumentTracking) => {
        setSelectedTracking(tracking);
        setIsModalOpen(true);
    };

    const handleSave = async (data: Partial<DocumentTracking>) => {
        try {
            await updateTracking.mutateAsync(data);
        } catch (error) {
            console.error('Save failed:', error);
            throw error;
        }
    };

    if (isLoading) return <div className="flex justify-center p-20"><LoadingSpinner size={48} /></div>;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ready':
            case 'done':
            case 'passed':
            case 'approved':
            case 'granted':
            case 'departed':
                return <Badge className="bg-green-100 text-green-800 border-green-200">Selesai</Badge>;
            case 'in_progress':
            case 'submitted':
            case 'applied':
            case 'booked':
                return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Proses</Badge>;
            case 'rejected':
            case 'denied':
            case 'expired':
            case 'fail':
                return <Badge variant="destructive">Gagal/Expired</Badge>;
            default:
                return <Badge variant="outline">Belum Ada</Badge>;
        }
    };

    const getStepIcon = (status: string) => {
        if (['ready', 'done', 'passed', 'approved', 'granted', 'departed'].includes(status)) {
            return <CheckCircle2 className="w-5 h-5 text-green-500" />;
        }
        if (['in_progress', 'submitted', 'applied', 'booked'].includes(status)) {
            return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />;
        }
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    };

    // SISWA VIEW: Progress Timeline
    if (userRole === 'student') {
        const myTracking = trackings[0];
        if (!myTracking) return (
            <div className="p-20 text-center space-y-4">
                <FileSearch className="w-16 h-16 mx-auto text-muted-foreground opacity-20" />
                <h3 className="text-xl font-bold">Data Belum Tersedia</h3>
                <p className="text-muted-foreground">Admin belum memulai proses tracking dokumen Anda.</p>
            </div>
        );

        const steps = [
            { name: "Paspor", status: myTracking.passport_status, desc: myTracking.passport_expiry ? `Exp: ${format(new Date(myTracking.passport_expiry), 'dd/MM/yyyy')}` : 'Persiapan paspor' },
            { name: "Medical Check-up", status: myTracking.mcu_status, desc: 'Pemeriksaan kesehatan' },
            { name: "Sertifikat Bahasa", status: myTracking.language_cert_status, desc: myTracking.language_cert_level || 'Belum lulus' },
            { name: "Status CoE", status: myTracking.coe_status, desc: myTracking.coe_number || 'Proses pengajuan ke Jepang' },
            { name: "Status Visa", status: myTracking.visa_status, desc: 'Pengajuan ke Kedutaan' },
            { name: "Keberangkatan", status: myTracking.flight_status, desc: 'Tiket & Jadwal Terbang' },
        ];

        if (isMobile) {
            return (
                <div className="p-2">
                    <MobileDocumentTracking
                        steps={steps}
                        getStatusBadge={getStatusBadge}
                        getStepIcon={getStepIcon}
                    />
                </div>
            );
        }

        return (
            <div className="space-y-4 sm:space-y-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans uppercase">Tracking Dokumen Saya</h1>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">Pantau setiap tahapan persiapan dokumen Anda</p>
                </div>

                <Card className="border-none shadow-xl shadow-slate-200/50 rounded-2xl sm:rounded-3xl overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-50 p-4 sm:p-6">
                        <CardTitle className="text-sm sm:text-lg font-bold flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            Proses Persiapan Keberangkatan
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-8">
                        <div className="relative space-y-6 sm:space-y-8">
                            <div className="absolute left-[11px] sm:left-[15px] top-2 bottom-2 w-0.5 bg-slate-100" />
                            {steps.map((step, idx) => (
                                <div key={idx} className="flex gap-4 sm:gap-6 relative z-10">
                                    <div className="bg-white border-2 border-slate-50 rounded-full p-0.5 sm:p-1 shadow-sm">
                                        {getStepIcon(step.status)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-800 text-sm sm:text-base truncate">{step.name}</h3>
                                        <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5">{step.desc}</p>
                                        <div className="mt-2">{getStatusBadge(step.status)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // ADMIN VIEW: Table with CRUD
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Monitoring CoE & Dokumen</h1>
                    <p className="text-muted-foreground text-sm">Kelola status dokumen keberangkatan siswa (CRUD AKTIF)</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari siswa..."
                            className="pl-10 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama Siswa</TableHead>
                                <TableHead>Paspor</TableHead>
                                <TableHead>CoE Status</TableHead>
                                <TableHead>Visa</TableHead>
                                <TableHead>Terbang</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTrackings.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-20">
                                        <div className="flex flex-col items-center gap-2 opacity-50">
                                            <Search className="w-10 h-10" />
                                            <p>Data tidak ditemukan</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredTrackings.map((t) => (
                                    <TableRow key={t.id} className="hover:bg-muted/50 transition-colors">
                                        <TableCell>
                                            <div className="font-bold text-slate-900">{t.siswa?.nama}</div>
                                            <div className="text-[10px] text-muted-foreground font-mono">{t.siswa?.nik}</div>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(t.passport_status)}</TableCell>
                                        <TableCell>{getStatusBadge(t.coe_status)}</TableCell>
                                        <TableCell>{getStatusBadge(t.visa_status)}</TableCell>
                                        <TableCell>{getStatusBadge(t.flight_status)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-blue-600"
                                                    onClick={() => handleEdit(t)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-600 hover:bg-red-50"
                                                    onClick={() => handleDelete(t.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <DocumentTrackingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                tracking={selectedTracking}
                onSave={handleSave}
            />
        </div>
    );
}
