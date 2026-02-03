
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Eye, Edit, Trash2, Users } from "lucide-react";
import { useJenisKerja } from "@/hooks/useJenisKerja";
import { JenisKerjaInlineForm } from "@/components/JenisKerjaInlineForm";
import { JenisKerjaDetail } from "@/components/JenisKerjaDetail";
import { useInlineEdit } from "@/hooks/useInlineEdit";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { JenisKerja } from "@/types";

export default function JenisKerja() {
  const { jenisKerja, isLoading, deleteJenisKerja, isDeleting } = useJenisKerja();
  const {
    editingItem,
    isCreating,
    viewingItem,
    startEdit,
    startCreate,
    startView,
    cancelEdit,
    isEditing,
    isViewing,
  } = useInlineEdit<JenisKerja>();

  const getStatusBadge = (status: string) => {
    return status === "Aktif"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const getTingkatKesulitanBadge = (tingkat: string) => {
    const colors = {
      "Rendah": "bg-green-100 text-green-800",
      "Menengah": "bg-yellow-100 text-yellow-800",
      "Tinggi": "bg-red-100 text-red-800"
    };
    return colors[tingkat as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const formatYen = (amount: number) => {
    return `¥${amount.toLocaleString()}/hari`;
  };

  const handleDelete = (id: string) => {
    deleteJenisKerja(id);
  };

  const handleSuccess = () => {
    cancelEdit();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const totalJenisKerja = jenisKerja?.length || 0;
  const jenisKerjaAktif = jenisKerja?.filter(j => (j as any).status === 'Aktif').length || 0;
  const totalPosisi = jenisKerja?.reduce((sum, j) => sum + (j.total_posisi || 0), 0) || 0;
  const kategori = new Set(jenisKerja?.map(j => j.kategori).filter(Boolean)).size;

  // Show form when creating or editing
  if (isCreating || isEditing) {
    return (
      <div className="space-y-6">
        <JenisKerjaInlineForm
          jenisKerja={editingItem || undefined}
          onCancel={cancelEdit}
          onSuccess={handleSuccess}
        />
      </div>
    );
  }

  // Show detail view
  if (isViewing && viewingItem) {
    return (
      <div className="space-y-6">
        <JenisKerjaDetail
          jenisKerja={viewingItem}
          onEdit={() => startEdit(viewingItem)}
          onBack={cancelEdit}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Jenis Kerja</h1>
          <p className="text-muted-foreground">Kelola jenis pekerjaan yang tersedia</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={startCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Jenis Kerja
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{totalJenisKerja}</p>
                <p className="text-sm text-muted-foreground">Total Jenis Kerja</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Users className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{jenisKerjaAktif}</p>
                <p className="text-sm text-muted-foreground">Jenis Kerja Aktif</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Users className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{totalPosisi}</p>
                <p className="text-sm text-muted-foreground">Total Posisi</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Users className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{kategori}</p>
                <p className="text-sm text-muted-foreground">Kategori</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Jenis Kerja</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Nama Jenis Kerja</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Tingkat</TableHead>
                <TableHead>Gaji</TableHead>
                <TableHead>Posisi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jenisKerja?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.kode}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.nama}</div>
                      <div className="text-sm text-muted-foreground">{item.deskripsi}</div>
                    </div>
                  </TableCell>
                  <TableCell>{item.kategori || '-'}</TableCell>
                  <TableCell>
                    <Badge className={getTingkatKesulitanBadge(item.tingkat_kesulitan || 'Menengah')}>
                      {item.tingkat_kesulitan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.gaji_minimal && item.gaji_maksimal ? (
                      <div className="text-sm">
                        <div>{formatYen(item.gaji_minimal)} - {formatYen(item.gaji_maksimal)}</div>
                      </div>
                    ) : '-'}
                  </TableCell>
                  <TableCell>{item.total_posisi}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge((item as any).status || 'Aktif')}>
                      {(item as any).status || 'Aktif'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => startView(item)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => startEdit(item)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Jenis Kerja</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus jenis kerja "{item.nama}"? Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(item.id)}
                              className="bg-red-600 hover:bg-red-700"
                              disabled={isDeleting}
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
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
