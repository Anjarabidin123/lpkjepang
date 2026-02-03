import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateApplication, useUpdateApplication, RecruitmentApplication } from '@/hooks/useRecruitment';
import { useSiswa } from '@/hooks/useSiswa';
import { useProgram } from '@/hooks/useProgram';

interface RecruitmentFormProps {
    open: boolean;
    onClose: () => void;
    application?: RecruitmentApplication | null;
}

export function RecruitmentForm({ open, onClose, application }: RecruitmentFormProps) {
    const [formData, setFormData] = useState({
        siswa_id: '',
        program_id: '',
        status: 'new' as any,
        score: '',
    });

    const { siswa: siswas } = useSiswa();
    const { program: programs } = useProgram();
    const createApplication = useCreateApplication();
    const updateApplication = useUpdateApplication();

    useEffect(() => {
        if (application) {
            setFormData({
                siswa_id: application.siswa_id?.toString() || '',
                program_id: application.program_id?.toString() || '',
                status: application.status || 'new',
                score: application.score?.toString() || '',
            });
        } else {
            setFormData({
                siswa_id: '',
                program_id: '',
                status: 'new',
                score: '',
            });
        }
    }, [application, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.siswa_id) {
            alert('Siswa is required');
            return;
        }

        try {
            const payload = {
                siswa_id: parseInt(formData.siswa_id),
                program_id: formData.program_id ? parseInt(formData.program_id) : undefined,
                status: formData.status,
                score: formData.score ? parseInt(formData.score) : undefined,
            };

            if (application) {
                await updateApplication.mutateAsync({ id: application.id, data: payload as any });
            } else {
                await createApplication.mutateAsync(payload as any);
            }
            onClose();
        } catch (error) {
            console.error('Failed to save application:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{application ? 'Update Application' : 'New Recruitment Application'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="siswa">Siswa *</Label>
                            <Select
                                value={formData.siswa_id}
                                onValueChange={(value) => setFormData({ ...formData, siswa_id: value })}
                                disabled={!!application}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Siswa" />
                                </SelectTrigger>
                                <SelectContent>
                                    {siswas?.map((s: any) => (
                                        <SelectItem key={s.id} value={s.id.toString()}>
                                            {s.nama} ({s.nik})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="program">Program</Label>
                            <Select
                                value={formData.program_id}
                                onValueChange={(value) => setFormData({ ...formData, program_id: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Program" />
                                </SelectTrigger>
                                <SelectContent>
                                    {programs?.map((p: any) => (
                                        <SelectItem key={p.id} value={p.id.toString()}>
                                            {p.nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="new">New</SelectItem>
                                    <SelectItem value="review">Review</SelectItem>
                                    <SelectItem value="interview">Interview</SelectItem>
                                    <SelectItem value="accepted">Accepted</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                    <SelectItem value="withdrawn">Withdrawn</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {['interview', 'accepted', 'rejected'].includes(formData.status) && (
                            <div className="space-y-2">
                                <Label htmlFor="score">Interview Score (0-100)</Label>
                                <input
                                    id="score"
                                    type="number"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.score}
                                    onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                                />
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700"
                            disabled={createApplication.isPending || updateApplication.isPending}
                        >
                            {createApplication.isPending || updateApplication.isPending ? 'Saving...' : 'Save Application'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
