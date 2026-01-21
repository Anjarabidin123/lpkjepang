
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
import { Plus, Eye, Edit, Trash2, MapPin } from "lucide-react";
import { usePosisiKerja } from "@/hooks/usePosisiKerja";
import { PosisiKerjaInlineForm } from "@/components/PosisiKerjaInlineForm";
import { PosisiKerjaDetail } from "@/components/PosisiKerjaDetail";
import { useInlineEdit } from "@/hooks/useInlineEdit";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// Use the type that matches what usePosisiKerja hook returns (with joined data)
type PosisiKerjaWithRelations = {
  id: string;
  kode: string;
  posisi: string;
  lokasi: string | null;
  kuota: number | null;
  terisi: number | null;
  gaji_harian: number | null;
  jam_kerja: string | null;
  persyaratan: string | null;
  status: "Buka" | "Penuh" | "Tutup" | null;
  tanggal_buka: string | null;
  tanggal_tutup: string | null;
  created_at: string | null;
  updated_at: string | null;
  perusahaan_id: string | null;
  jenis_kerja_id: string | null;
  perusahaan: {
    id: string;
    nama: string;
    kode: string;
  } | null;
  jenis_kerja: {
    id: string;
    nama: string;
    kode: string;
  } | null;
};

export default function PosisiKerja() {
  const { posisiKerja, isLoading, deletePosisiKerja, isDeleting } = usePosisiKerja();
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
  } = useInlineEdit<PosisiKerjaWithRelations>();

  const getStatusBadge = (status: string) => {
    const colors = {
      "Buka": "bg-green-100 text-green-800",
      "Penuh": "bg-yellow-100 text-yellow-800", 
      "Tutup": "bg-red-100 text-red-800"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const formatYen = (amount: number) => {
    return `¥${amount.toLocaleString()}/hari`;
  };

  const handleDelete = (id: string) => {
    deletePosisiKerja(id);
  };

  const handleSuccess = () => {
    cancelEdit();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const totalPosisi = posisiKerja?.length || 0;
  const posisiBuka = posisiKerja?.filter(p => p.status === 'Buka').length || 0;
  const posisiPenuh = posisiKerja?.filter(p => p.status === 'Penuh').length || 0;
  const pekerjaTempatkan = posisiKerja?.reduce((sum, p) => sum + (p.terisi || 0), 0) || 0;

  // Show form when creating or editing
  if (isCreating || isEditing) {
    return (
      <div className="space-y-6">
        <PosisiKerjaInlineForm
          posisiKerja={editingItem || undefined}
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
        <PosisiKerjaDetail
          posisiKerja={viewingItem}
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
          <h1 className="text-2xl font-bold text-gray-900">Data Posisi Kerja</h1>
          <p className="text-muted-foreground">Kelola posisi kerja yang tersedia</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={startCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Posisi Kerja
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <MapPin className="w-8 h-8 text-blue-600" />
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
              <MapPin className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{posisiBuka}</p>
                <p className="text-sm text-muted-foreground">Posisi Buka</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <MapPin className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{posisiPenuh}</p>
                <p className="text-sm text-muted-foreground">Posisi Penuh</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <MapPin className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{pekerjaTempatkan}</p>
                <p className="text-sm text-muted-foreground">Pekerja Ditempatkan</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Posisi Kerja</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Posisi</TableHead>
                <TableHead>Perusahaan</TableHead>
                <TableHead>Jenis Kerja</TableHead>
                <TableHead>Kuota</TableHead>
                <TableHead>Gaji</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posisiKerja?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.kode}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.posisi}</div>
                      <div className="text-sm text-muted-foreground">{item.lokasi}</div>
                    </div>
                  </TableCell>
                  <TableCell>{item.perusahaan?.nama || '-'}</TableCell>
                  <TableCell>{item.jenis_kerja?.nama || '-'}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <span className="font-medium">{item.terisi}</span>
                      <span className="text-muted-foreground">/{item.kuota}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.gaji_harian ? formatYen(item.gaji_harian) : '-'}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(item.status || 'Tutup')}>
                      {item.status}
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
                            <AlertDialogTitle>Hapus Posisi Kerja</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus posisi kerja "{item.posisi}"? Tindakan ini tidak dapat dibatalkan.
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
