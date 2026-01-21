import React from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Edit, Trash2, Camera } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { Siswa } from "@/hooks/useSiswa";
import type { SiswaRegularColumnConfig } from "@/hooks/useSiswaRegularColumnVisibility";

interface SiswaRegularTableProps {
  siswa: Siswa[];
  visibleColumns: SiswaRegularColumnConfig[];
  onEdit: (item: Siswa) => void;
  onView: (item: Siswa) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  getProvinceName: (provinceId: string | null) => string;
  getRegencyName: (regencyId: string | null) => string;
  getStatusBadge: (status: string) => string;
}

export function SiswaRegularTable({
  siswa,
  visibleColumns,
  onEdit,
  onView,
  onDelete,
  isDeleting,
  getProvinceName,
  getRegencyName,
  getStatusBadge
}: SiswaRegularTableProps) {
  // Helper function to check if column is visible
  const isColumnVisible = (key: string) => {
    return visibleColumns.some(col => col.key === key && col.visible);
  };

  return (
    <div className="flat-table overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {isColumnVisible('foto') && <TableHead className="min-w-[60px]">Foto</TableHead>}
            {isColumnVisible('nik') && <TableHead className="min-w-[120px]">NIK</TableHead>}
            {isColumnVisible('nama') && <TableHead className="min-w-[150px]">Nama</TableHead>}
            {isColumnVisible('umur') && <TableHead className="min-w-[80px]">Umur</TableHead>}
            {isColumnVisible('jenis_kelamin') && <TableHead className="min-w-[120px]">Jenis Kelamin</TableHead>}
            {isColumnVisible('telepon') && <TableHead className="min-w-[120px]">Telepon</TableHead>}
            {isColumnVisible('email') && <TableHead className="min-w-[150px]">Email</TableHead>}
            {isColumnVisible('fisik') && <TableHead className="min-w-[120px]">Tinggi/Berat</TableHead>}
            {isColumnVisible('provinsi') && <TableHead className="min-w-[120px]">Provinsi</TableHead>}
            {isColumnVisible('kabupaten') && <TableHead className="min-w-[120px]">Kabupaten/Kota</TableHead>}
            {isColumnVisible('status') && <TableHead className="min-w-[100px]">Status</TableHead>}
            {isColumnVisible('ketersediaan') && <TableHead className="min-w-[120px]">Ketersediaan</TableHead>}
            {isColumnVisible('aksi') && <TableHead className="min-w-[120px]">Aksi</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {siswa.map((item) => (
            <TableRow 
              key={item.id} 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onView(item)}
            >
              {isColumnVisible('foto') && (
                <TableCell>
                  <div className="relative">
                     <Avatar className="w-10 h-10 border border-border">
                       <AvatarImage 
                         src={item.foto_siswa || item.foto_url || ''} 
                         alt={`Foto ${item.nama}`}
                         className="object-cover"
                       />
                       <AvatarFallback className="bg-primary text-primary-foreground">
                         {item.nama?.charAt(0) || 'S'}
                       </AvatarFallback>
                     </Avatar>
                     {(item.foto_siswa || item.foto_url) && (
                       <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-background flex items-center justify-center">
                         <Camera className="w-1.5 h-1.5 text-white" />
                       </div>
                     )}
                  </div>
                </TableCell>
              )}
              {isColumnVisible('nik') && (
                <TableCell className="font-medium">{item.nik}</TableCell>
              )}
              {isColumnVisible('nama') && (
                <TableCell>
                  <div className="font-medium">{item.nama}</div>
                  <div className="text-xs text-muted-foreground">{item.tempat_lahir || '-'}</div>
                </TableCell>
              )}
              {isColumnVisible('umur') && (
                <TableCell>{item.umur || '-'}</TableCell>
              )}
              {isColumnVisible('jenis_kelamin') && (
                <TableCell>{item.jenis_kelamin || '-'}</TableCell>
              )}
              {isColumnVisible('telepon') && (
                <TableCell>{item.telepon || '-'}</TableCell>
              )}
              {isColumnVisible('email') && (
                <TableCell className="max-w-32 truncate">{item.email || '-'}</TableCell>
              )}
              {isColumnVisible('fisik') && (
                <TableCell>
                  <div className="text-xs">
                    <div>T: {item.tinggi_badan || '-'} cm</div>
                    <div>B: {item.berat_badan || '-'} kg</div>
                  </div>
                </TableCell>
              )}
              {isColumnVisible('provinsi') && (
                <TableCell>{getProvinceName(item.demografi_province_id)}</TableCell>
              )}
              {isColumnVisible('kabupaten') && (
                <TableCell>{getRegencyName(item.demografi_regency_id)}</TableCell>
              )}
              {isColumnVisible('status') && (
                <TableCell>
                  {item.status && (
                    <Badge className={getStatusBadge(item.status)}>
                      {item.status}
                    </Badge>
                  )}
                </TableCell>
              )}
              {isColumnVisible('ketersediaan') && (
                <TableCell>
                  <Badge className={item.is_available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {item.is_available ? 'Tersedia' : 'Tidak Tersedia'}
                  </Badge>
                </TableCell>
              )}
              {isColumnVisible('aksi') && (
                <TableCell>
                   <div className="flex items-center gap-1">
                     <Button 
                       variant="ghost" 
                       size="sm" 
                       onClick={(e) => {
                         e.stopPropagation();
                         onView(item);
                       }}
                     >
                       <Eye className="w-4 h-4" />
                     </Button>
                     <Button 
                       variant="ghost" 
                       size="sm" 
                       onClick={(e) => {
                         e.stopPropagation();
                         onEdit(item);
                       }}
                     >
                       <Edit className="w-4 h-4" />
                     </Button>
                     <AlertDialog>
                       <AlertDialogTrigger asChild>
                         <Button 
                           variant="ghost" 
                           size="sm" 
                           className="text-destructive hover:text-destructive"
                           onClick={(e) => e.stopPropagation()}
                         >
                           <Trash2 className="w-4 h-4" />
                         </Button>
                       </AlertDialogTrigger>
                       <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                         <AlertDialogHeader>
                           <AlertDialogTitle>Hapus Siswa</AlertDialogTitle>
                           <AlertDialogDescription>
                             Apakah Anda yakin ingin menghapus siswa "{item.nama}"? Tindakan ini tidak dapat dibatalkan.
                           </AlertDialogDescription>
                         </AlertDialogHeader>
                         <AlertDialogFooter>
                           <AlertDialogCancel>Batal</AlertDialogCancel>
                           <AlertDialogAction
                             onClick={() => onDelete(item.id)}
                             className="bg-destructive hover:bg-destructive/90"
                             disabled={isDeleting}
                           >
                             Hapus
                           </AlertDialogAction>
                         </AlertDialogFooter>
                       </AlertDialogContent>
                     </AlertDialog>
                   </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}