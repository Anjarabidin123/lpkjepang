
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, ArrowLeft } from "lucide-react";
import type { JenisKerja } from "@/types";

interface JenisKerjaDetailProps {
  jenisKerja: JenisKerja;
  onEdit: () => void;
  onBack: () => void;
}

export function JenisKerjaDetail({ jenisKerja, onEdit, onBack }: JenisKerjaDetailProps) {
  const getStatusBadge = (status?: string) => {
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

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Detail Jenis Kerja</CardTitle>
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
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Nama Jenis Kerja</h3>
            <p className="text-lg">{jenisKerja.nama}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Kode Jenis Kerja</h3>
            <p className="text-lg">{jenisKerja.kode}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm text-gray-500 mb-1">Deskripsi</h3>
          <p>{jenisKerja.deskripsi || '-'}</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Kategori</h3>
            <p>{jenisKerja.kategori || '-'}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Tingkat Kesulitan</h3>
            <Badge className={getTingkatKesulitanBadge(jenisKerja.tingkat_kesulitan || 'Menengah')}>
              {jenisKerja.tingkat_kesulitan}
            </Badge>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm text-gray-500 mb-1">Syarat Pendidikan</h3>
          <p>{jenisKerja.syarat_pendidikan || '-'}</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Gaji Minimal</h3>
            <p>{jenisKerja.gaji_minimal ? formatYen(jenisKerja.gaji_minimal) : '-'}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Gaji Maksimal</h3>
            <p>{jenisKerja.gaji_maksimal ? formatYen(jenisKerja.gaji_maksimal) : '-'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Total Posisi</h3>
            <p>{jenisKerja.total_posisi}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Status</h3>
            <Badge className="bg-green-100 text-green-800">
              Aktif
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
