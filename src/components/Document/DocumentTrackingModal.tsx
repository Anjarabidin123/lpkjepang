
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DocumentTracking } from "@/hooks/useDocumentTracking";
import { toast } from "sonner";

interface DocumentTrackingModalProps {
    isOpen: boolean;
    onClose: () => void;
    tracking: DocumentTracking | null;
    onSave: (data: Partial<DocumentTracking>) => Promise<void>;
}

export function DocumentTrackingModal({ isOpen, onClose, tracking, onSave }: DocumentTrackingModalProps) {
    const { register, handleSubmit, reset, setValue, watch } = useForm<Partial<DocumentTracking>>();

    useEffect(() => {
        if (tracking) {
            reset({
                id: tracking.id,
                siswa_id: tracking.siswa_id,
                passport_status: tracking.passport_status,
                passport_expiry: tracking.passport_expiry ? tracking.passport_expiry.split('T')[0] : '',
                mcu_status: tracking.mcu_status,
                mcu_date: tracking.mcu_date ? tracking.mcu_date.split('T')[0] : '',
                language_cert_status: tracking.language_cert_status,
                language_cert_level: tracking.language_cert_level || '',
                coe_status: tracking.coe_status,
                coe_number: tracking.coe_number || '',
                coe_issue_date: tracking.coe_issue_date ? tracking.coe_issue_date.split('T')[0] : '',
                visa_status: tracking.visa_status,
                visa_expiry: tracking.visa_expiry ? tracking.visa_expiry.split('T')[0] : '',
                flight_status: tracking.flight_status,
                departure_datetime: tracking.departure_datetime ? tracking.departure_datetime.split('T')[0] : '',
                notes: tracking.notes || ''
            });
        }
    }, [tracking, reset]);

    const onSubmit = async (data: any) => {
        try {
            await onSave(data);
            toast.success('Data tracking berhasil diperbarui');
            onClose();
        } catch (error) {
            toast.error('Gagal memperbarui data');
        }
    };

    const statusValue = (field: keyof DocumentTracking) => watch(field as any);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Update Status Dokumen: {tracking?.siswa?.nama}</DialogTitle>
                    <DialogDescription className="sr-only">
                        Formulir untuk memperbarui status dokumen keberangkatan siswa.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Passport Section */}
                        <div className="space-y-4 p-4 border rounded-lg bg-slate-50/50">
                            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500">1. Paspor</h3>
                            <div className="space-y-2">
                                <Label>Status Paspor</Label>
                                <Select
                                    value={statusValue('passport_status')}
                                    onValueChange={(val) => setValue('passport_status', val as any)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="not_started">Belum Mulai</SelectItem>
                                        <SelectItem value="in_progress">Dalam Proses</SelectItem>
                                        <SelectItem value="ready">Ready (Tersedia)</SelectItem>
                                        <SelectItem value="expired">Expired</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Tanggal Kadaluarsa Paspor</Label>
                                <Input type="date" {...register('passport_expiry')} />
                            </div>
                        </div>

                        {/* MCU Section */}
                        <div className="space-y-4 p-4 border rounded-lg bg-slate-50/50">
                            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500">2. Medical Check-up</h3>
                            <div className="space-y-2">
                                <Label>Status MCU</Label>
                                <Select
                                    value={statusValue('mcu_status')}
                                    onValueChange={(val) => setValue('mcu_status', val as any)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="not_started">Belum Mulai</SelectItem>
                                        <SelectItem value="done">Selesai (Fit)</SelectItem>
                                        <SelectItem value="expired">Expired</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Tanggal MCU</Label>
                                <Input type="date" {...register('mcu_date')} />
                            </div>
                        </div>

                        {/* Language Cert Section */}
                        <div className="space-y-4 p-4 border rounded-lg bg-slate-50/50">
                            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500">3. Sertifikat Bahasa</h3>
                            <div className="space-y-2">
                                <Label>Status Sertifikat</Label>
                                <Select
                                    value={statusValue('language_cert_status')}
                                    onValueChange={(val) => setValue('language_cert_status', val as any)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="not_started">Belum Ada</SelectItem>
                                        <SelectItem value="not_passed">Gagal Ujian</SelectItem>
                                        <SelectItem value="passed">Lulus</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Level (JLPT/NAT/J-TEST)</Label>
                                <Input {...register('language_cert_level')} placeholder="Contoh: JLPT N4" />
                            </div>
                        </div>

                        {/* COE Section */}
                        <div className="space-y-4 p-4 border rounded-lg bg-slate-50/50">
                            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500">4. Certificate of Eligibility (CoE)</h3>
                            <div className="space-y-2">
                                <Label>Status CoE</Label>
                                <Select
                                    value={statusValue('coe_status')}
                                    onValueChange={(val) => setValue('coe_status', val as any)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="not_submitted">Belum Submit</SelectItem>
                                        <SelectItem value="submitted">Sudah Submit</SelectItem>
                                        <SelectItem value="approved">Approved (Turun)</SelectItem>
                                        <SelectItem value="rejected">Rejected (Gagal)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Nomor CoE</Label>
                                <Input {...register('coe_number')} placeholder="Masukkan nomor CoE" />
                            </div>
                        </div>

                        {/* Visa Section */}
                        <div className="space-y-4 p-4 border rounded-lg bg-slate-50/50">
                            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500">5. Visa</h3>
                            <div className="space-y-2">
                                <Label>Status Visa</Label>
                                <Select
                                    value={statusValue('visa_status')}
                                    onValueChange={(val) => setValue('visa_status', val as any)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="not_applied">Belum Apply</SelectItem>
                                        <SelectItem value="applied">Sudah Apply</SelectItem>
                                        <SelectItem value="granted">Granted (Disetujui)</SelectItem>
                                        <SelectItem value="denied">Denied (Ditolak)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Tanggal Kadaluarsa Visa</Label>
                                <Input type="date" {...register('visa_expiry')} />
                            </div>
                        </div>

                        {/* Flight Section */}
                        <div className="space-y-4 p-4 border rounded-lg bg-slate-50/50">
                            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500">6. Penerbangan</h3>
                            <div className="space-y-2">
                                <Label>Status Terbang</Label>
                                <Select
                                    value={statusValue('flight_status')}
                                    onValueChange={(val) => setValue('flight_status', val as any)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="not_booked">Belum Pesan</SelectItem>
                                        <SelectItem value="booked">Sudah Pesan</SelectItem>
                                        <SelectItem value="departed">Sudah Berangkat</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Tanggal Keberangkatan</Label>
                                <Input type="date" {...register('departure_datetime')} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Catatan Tambahan</Label>
                        <Input {...register('notes')} placeholder="Keterangan lainnya (opsional)" />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
                        <Button type="submit">Simpan Perubahan</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
