
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, ArrowLeft } from "lucide-react";

// Use the proper type that includes joined data from the hook
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
  status: string | null;
  tanggal_buka: string | null;
  tanggal_tutup: string | null;
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

interface PosisiKerjaDetailProps {
  posisiKerja: PosisiKerjaWithRelations;
  onEdit: () => void;
  onBack: () => void;
}

export function PosisiKerjaDetail({ posisiKerja, onEdit, onBack }: PosisiKerjaDetailProps) {
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

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Detail Posisi Kerja</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <Button onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Kode Posisi</h3>
            <p className="text-lg">{posisiKerja.kode}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Nama Posisi</h3>
            <p className="text-lg">{posisiKerja.posisi}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Perusahaan</h3>
            <p>{posisiKerja.perusahaan?.nama || '-'}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Jenis Kerja</h3>
            <p>{posisiKerja.jenis_kerja?.nama || '-'}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm text-gray-500 mb-1">Lokasi</h3>
          <p>{posisiKerja.lokasi || '-'}</p>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Kuota</h3>
            <p>{posisiKerja.kuota}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Terisi</h3>
            <p>{posisiKerja.terisi}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Gaji Harian</h3>
            <p>{posisiKerja.gaji_harian ? formatYen(posisiKerja.gaji_harian) : '-'}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Jam Kerja</h3>
            <p>{posisiKerja.jam_kerja || '-'}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm text-gray-500 mb-1">Persyaratan</h3>
          <p>{posisiKerja.persyaratan || '-'}</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Status</h3>
            <Badge className={getStatusBadge(posisiKerja.status || 'Tutup')}>
              {posisiKerja.status}
            </Badge>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Tanggal Buka</h3>
            <p>{posisiKerja.tanggal_buka || '-'}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Tanggal Tutup</h3>
            <p>{posisiKerja.tanggal_tutup || '-'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
