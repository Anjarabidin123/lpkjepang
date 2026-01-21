
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
import { Plus, Eye, Edit, Trash2, ClipboardList } from "lucide-react";
import { useProgram } from "@/hooks/useProgram";
import { ProgramInlineForm } from "@/components/ProgramInlineForm";
import { ProgramDetail } from "@/components/ProgramDetail";
import { useInlineEdit } from "@/hooks/useInlineEdit";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { Tables } from "@/integrations/supabase/types";

export default function Program() {
  const { program, isLoading, deleteProgram, isDeleting } = useProgram();
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
  } = useInlineEdit<Tables<'program'>>();

  const getStatusBadge = (status: string) => {
    return status === "Aktif" 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const handleDelete = (id: string) => {
    deleteProgram(id);
  };

  const handleSuccess = () => {
    cancelEdit();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const totalProgram = program?.length || 0;
  const programAktif = program?.filter(p => (p as any).status === 'Aktif').length || 0;
  const totalPeserta = program?.reduce((sum, p) => sum + (p.peserta_terdaftar || 0), 0) || 0;
  const totalKuota = program?.reduce((sum, p) => sum + (p.kuota || 0), 0) || 0;
  const tingkatKelulusan = totalKuota > 0 ? Math.round((totalPeserta / totalKuota) * 100) : 0;

  // Show form when creating or editing
  if (isCreating || isEditing) {
    return (
      <div className="space-y-6">
        <ProgramInlineForm
          open={true}
          onOpenChange={cancelEdit}
          program={editingItem || undefined}
        />
      </div>
    );
  }

  // Show detail view
  if (isViewing && viewingItem) {
    return (
      <div className="space-y-6">
        <ProgramDetail
          program={viewingItem}
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
          <h1 className="text-2xl font-bold text-gray-900">Data Program</h1>
          <p className="text-muted-foreground">Kelola program pelatihan pemagangan</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={startCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Program
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <ClipboardList className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{totalProgram}</p>
                <p className="text-sm text-muted-foreground">Total Program</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <ClipboardList className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{programAktif}</p>
                <p className="text-sm text-muted-foreground">Program Aktif</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <ClipboardList className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{totalPeserta}</p>
                <p className="text-sm text-muted-foreground">Total Peserta</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <ClipboardList className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{tingkatKelulusan}%</p>
                <p className="text-sm text-muted-foreground">Tingkat Kelulusan</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Program</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Nama Program</TableHead>
                <TableHead>Durasi</TableHead>
                <TableHead>Biaya</TableHead>
                <TableHead>Peserta</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {program?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.kode}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.nama}</div>
                      <div className="text-sm text-muted-foreground">{item.deskripsi}</div>
                    </div>
                  </TableCell>
                  <TableCell>{item.durasi} {item.satuan_durasi}</TableCell>
                  <TableCell>{item.biaya ? formatCurrency(Number(item.biaya)) : '-'}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <span className="font-medium">{item.peserta_terdaftar}</span>
                      <span className="text-muted-foreground">/{item.kuota}</span>
                    </div>
                  </TableCell>
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
                            <AlertDialogTitle>Hapus Program</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus program "{item.nama}"? Tindakan ini tidak dapat dibatalkan.
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
