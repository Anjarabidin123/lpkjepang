
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, FileText, Video, Download, Plus, Trash2, Edit, Search, User, Clock, Link as LinkIcon, ExternalLink } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authFetch } from '@/lib/api-client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// Type definitions
interface Module {
    id: string;
    title: string;
    description: string;
    category: string;
    type: 'pdf' | 'video' | 'link';
    url: string;
    author?: { id: number, name: string };
    created_at: string;
}

export default function LearningModules() {
    const { userRole } = useAuth();
    const isMobile = useIsMobile();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const queryClient = useQueryClient();

    // Fetch Data
    const { data: modules = [], isLoading } = useQuery({
        queryKey: ['learning-modules'],
        queryFn: async () => {
            const resp = await authFetch('/learning-modules');
            if (!resp.ok) throw new Error('Gagal mengambil data');
            const data = await resp.json();
            return data.data; // Backend returns { status: 'success', data: [...] }
        }
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: async (newModule: Partial<Module>) => {
            const resp = await authFetch('/learning-modules', {
                method: 'POST',
                body: JSON.stringify(newModule)
            });
            if (!resp.ok) throw new Error('Gagal menambah materi');
            return resp.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['learning-modules'] });
            toast.success("Materi berhasil ditambahkan");
        },
        onError: () => toast.error("Gagal menambah materi")
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const resp = await authFetch(`/learning-modules/${id}`, { method: 'DELETE' });
            if (!resp.ok) throw new Error('Gagal menghapus');
            return resp.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['learning-modules'] });
            toast.success("Materi dihapus");
        },
        onError: () => toast.error("Gagal menghapus materi")
    });

    // Filter Logic
    const filteredModules = modules.filter((m: Module) => {
        const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (m.description || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (isLoading) return <div className="flex justify-center p-20"><LoadingSpinner size={48} /></div>;

    const isAdmin = ['admin', 'super_admin', 'instructor'].includes(userRole || '');

    if (isAdmin) {
        return (
            <AdminModuleView
                modules={filteredModules}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                createMutation={createMutation}
                deleteMutation={deleteMutation}
            />
        );
    }

    return (
        <StudentModuleView
            modules={filteredModules}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            isMobile={isMobile}
        />
    );
}

// ----------------------------------------------------------------------
// STUDENT VIEW - COMPACT LIST STYLE
// ----------------------------------------------------------------------

function StudentModuleView({ modules, searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, isMobile }: any) {
    const categories = ['all', 'Bahasa', 'Budaya', 'Teknis'];

    const getIcon = (type: string) => {
        if (type === 'video') return <Video className="w-4 h-4 text-pink-500" />;
        if (type === 'link') return <LinkIcon className="w-4 h-4 text-blue-500" />;
        return <FileText className="w-4 h-4 text-emerald-500" />;
    }

    return (
        <div className={`space-y-4 ${isMobile ? 'pb-24' : ''}`}>
            {/* Header */}
            <div className="flex flex-col gap-1 px-1">
                <h1 className="text-xl font-black font-sans text-slate-900 uppercase tracking-tight">Materi Belajar</h1>
                <p className="text-xs text-slate-500 font-medium">Modul pembelajaran LPK.</p>
            </div>

            {/* Sticky Search & Filter */}
            <div className="sticky top-0 bg-gray-50/95 backdrop-blur-sm z-10 py-2 space-y-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <Input
                        placeholder="Cari materi..."
                        className="pl-9 h-9 text-xs bg-white border-slate-200 rounded-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors border ${selectedCategory === cat
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            {cat === 'all' ? 'Semua' : cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Compact List Module */}
            <div className="space-y-2">
                {modules.map((module: Module) => (
                    <div key={module.id} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm active:scale-[0.99] transition-transform flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${module.type === 'video' ? 'bg-pink-50' :
                            module.type === 'link' ? 'bg-blue-50' : 'bg-emerald-50'
                            }`}>
                            {getIcon(module.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <Badge variant="outline" className="h-4 px-1 text-[8px] uppercase tracking-wider border-slate-200 text-slate-500 bg-transparent rounded-sm">
                                    {module.category}
                                </Badge>
                                <span className="text-[9px] text-slate-400 font-medium truncate">
                                    {new Date(module.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <h3 className="font-bold text-sm text-slate-800 leading-tight line-clamp-1">{module.title}</h3>
                            <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{module.description}</p>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 shrink-0"
                            onClick={() => window.open(module.url, '_blank')}
                        >
                            {module.type === 'link' ? <ExternalLink className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                        </Button>
                    </div>
                ))}
            </div>

            {modules.length === 0 && (
                <div className="text-center py-10 opacity-50">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Belum ada materi</p>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// ADMIN VIEW - TABLE / LIST
// ----------------------------------------------------------------------

function AdminModuleView({ modules, searchTerm, setSearchTerm, createMutation, deleteMutation }: any) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newModule, setNewModule] = useState<Partial<Module>>({ category: 'Bahasa', type: 'pdf' });

    const handleAdd = () => {
        if (!newModule.title || !newModule.url) {
            toast.error("Judul dan URL wajib diisi");
            return;
        }
        createMutation.mutate(newModule);
        setIsAddOpen(false);
        setNewModule({ category: 'Bahasa', type: 'pdf' });
    };

    return (
        <div className="space-y-6 pt-4 px-4 pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black font-sans text-slate-900 uppercase tracking-tight">Manajemen Materi</h1>
                    <p className="text-sm text-slate-500 font-medium">Upload dan kelola bahan ajar.</p>
                </div>
                <Button onClick={() => setIsAddOpen(true)} className="bg-primary hover:bg-primary/90 rounded-xl shadow-lg font-bold">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Materi
                </Button>
            </div>

            <Card className="border-none shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Cari judul materi..."
                            className="pl-9 bg-white border-slate-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="divide-y divide-slate-50">
                    {modules.map((module: Module) => (
                        <div key={module.id} className="p-4 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
                            <div className="flex items-start gap-3">
                                <div className={`p-2.5 rounded-lg shrink-0 mt-0.5 ${module.type === 'video' ? 'text-pink-500 bg-pink-50' :
                                    module.type === 'link' ? 'text-blue-500 bg-blue-50' : 'text-emerald-500 bg-emerald-50'
                                    }`}>
                                    {module.type === 'video' ? <Video className="w-4 h-4" /> :
                                        module.type === 'link' ? <LinkIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-slate-800 text-sm truncate">{module.title}</h3>
                                    <p className="text-xs text-slate-500 line-clamp-1">{module.description || '-'}</p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <Badge variant="secondary" className="text-[9px] uppercase font-bold h-5 px-1.5">
                                            {module.category}
                                        </Badge>
                                        <span className="text-[10px] text-slate-400 font-medium">
                                            {new Date(module.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-red-600 self-end sm:self-center"
                                onClick={() => {
                                    if (confirm('Hapus materi ini?')) deleteMutation.mutate(module.id);
                                }}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                    {modules.length === 0 && (
                        <div className="p-8 text-center text-sm text-slate-400">
                            Belum ada materi.
                        </div>
                    )}
                </div>
            </Card>

            {/* ADD MODAL */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah Materi Baru</DialogTitle>
                        <DialogDescription>Masukkan link atau file materi.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Judul Materi</Label>
                            <Input
                                placeholder="Contoh: Modul Bahasa Jepang N5"
                                value={newModule.title || ''}
                                onChange={e => setNewModule({ ...newModule, title: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Kategori</Label>
                                <Select
                                    value={newModule.category}
                                    onValueChange={val => setNewModule({ ...newModule, category: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Bahasa">Bahasa</SelectItem>
                                        <SelectItem value="Budaya">Budaya</SelectItem>
                                        <SelectItem value="Teknis">Teknis</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Tipe</Label>
                                <Select
                                    value={newModule.type}
                                    onValueChange={(val: any) => setNewModule({ ...newModule, type: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pdf">Dokumen (PDF)</SelectItem>
                                        <SelectItem value="video">Video</SelectItem>
                                        <SelectItem value="link">Link</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>URL File / Link</Label>
                            <Input
                                placeholder="https://..."
                                value={newModule.url || ''}
                                onChange={e => setNewModule({ ...newModule, url: e.target.value })}
                            />
                            <p className="text-[10px] text-slate-400">*Paste link Google Drive, Youtube, atau file URL.</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Deskripsi (Opsional)</Label>
                            <Input
                                placeholder="Keterangan singkat..."
                                value={newModule.description || ''}
                                onChange={e => setNewModule({ ...newModule, description: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddOpen(false)}>Batal</Button>
                        <Button onClick={handleAdd} disabled={createMutation.isPending}>
                            {createMutation.isPending ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
