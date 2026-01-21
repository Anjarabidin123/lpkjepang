
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Building } from 'lucide-react';
import { useLpkMitra } from '@/hooks/useLpkMitra';
import { LpkMitraForm } from '@/components/LpkMitraForm';
import { LpkMitra as LpkMitraType } from '@/types/lpkMitra';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ModulePageLayout, ModuleStatCard } from '@/components/layout/ModulePageLayout';
import { ErrorBoundary, DataErrorFallback } from '@/components/ErrorBoundary';

export default function LpkMitra() {
  const { lpkMitras, isLoading, create, update, delete: deleteLpkMitra, isCreating, isUpdating, isDeleting, error } = useLpkMitra();
  const [selectedLpkMitra, setSelectedLpkMitra] = useState<LpkMitraType | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLpkMitras = (lpkMitras || []).filter(lpk => {
    const search = searchTerm.toLowerCase();
    return (
      (lpk.nama_lpk || '').toLowerCase().includes(search) ||
      (lpk.kode || '').toLowerCase().includes(search) ||
      (lpk.pic_nama || '').toLowerCase().includes(search)
    );
  });

  const handleSave = (data: any) => {
    if (selectedLpkMitra) {
      update({ id: selectedLpkMitra.id, data });
    } else {
      create(data);
    }
    setShowForm(false);
    setSelectedLpkMitra(null);
  };

  const handleDelete = (id: string) => {
    deleteLpkMitra(id);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  if (error && !isLoading) {
    return <DataErrorFallback error={error} retry={() => window.location.reload()} />;
  }

  if (showForm) {
    return (
      <div className="space-y-4 animate-in fade-in duration-300">
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <h1 className="text-xl font-bold">
              {selectedLpkMitra ? 'Edit LPK Mitra' : 'Tambah LPK Mitra'}
            </h1>
            <p className="text-xs text-slate-500">
              {selectedLpkMitra ? `Mengedit ${selectedLpkMitra.nama_lpk}` : 'Tambah data LPK Mitra baru ke sistem'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowForm(false);
              setSelectedLpkMitra(null);
            }}
          >
            Batal
          </Button>
        </div>
        
        <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6">
            <LpkMitraForm
              lpkMitra={selectedLpkMitra || undefined}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setSelectedLpkMitra(null);
              }}
              isLoading={isCreating || isUpdating}
            />
          </div>
        </div>
      </div>
    );
  }

  const totalLpk = lpkMitras?.length || 0;
  const lpkAktif = lpkMitras?.filter(l => l.status === 'Aktif').length || 0;
  const lpkNonaktif = totalLpk - lpkAktif;

  return (
    <ModulePageLayout
      title="LPK Mitra"
      subtitle="Kelola jaringan LPK mitra pengirim"
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      actions={
        <Button 
          size="sm"
          onClick={() => {
            setSelectedLpkMitra(null);
            setShowForm(true);
          }}
          className="h-8"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Tambah LPK
        </Button>
      }
      stats={
        <>
          <ModuleStatCard label="Total LPK" value={totalLpk} icon={<Building className="w-4 h-4" />} color="primary" />
          <ModuleStatCard label="LPK Aktif" value={lpkAktif} icon={<Building className="w-4 h-4" />} color="success" />
          <ModuleStatCard label="Non-Aktif" value={lpkNonaktif} icon={<Building className="w-4 h-4" />} color="error" />
        </>
      }
    >
      <div className="p-0 overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[100px]">Kode</TableHead>
                <TableHead>Nama LPK</TableHead>
                <TableHead>PIC / Kontak</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dibuat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLpkMitras.map((lpk) => (
                <TableRow key={lpk.id} className="group transition-colors">
                  <TableCell className="font-mono text-xs font-semibold">{lpk.kode}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{lpk.nama_lpk}</span>
                      <span className="text-[10px] text-slate-500 line-clamp-1">{lpk.email || 'No Email'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium">{lpk.pic_nama || '-'}</span>
                      <span className="text-[10px] text-slate-500">{lpk.phone || '-'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={lpk.status === 'Aktif' ? "default" : "secondary"} className="text-[10px] h-5 px-1.5">
                      {lpk.status || 'Aktif'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 tabular-nums">
                    {formatDate(lpk.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => {
                          setSelectedLpkMitra(lpk);
                          setShowForm(true);
                        }}
                        disabled={isUpdating}
                      >
                        <Edit className="h-3.5 h-3.5" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive"
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-3.5 h-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus LPK Mitra</AlertDialogTitle>
                            <AlertDialogDescription>
                              Yakin ingin menghapus "{lpk.nama_lpk}"? Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(lpk.id)}
                              className="bg-destructive text-destructive-foreground"
                            >
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredLpkMitras.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                    Tidak ada data LPK Mitra ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </ModulePageLayout>
  );
}
