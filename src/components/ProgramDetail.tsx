import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, ArrowLeft } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

interface ProgramDetailProps {
  program: Tables<'program'>;
  onEdit: () => void;
  onBack: () => void;
}

export function ProgramDetail({ program, onEdit, onBack }: ProgramDetailProps) {
  const getStatusBadge = (status?: string) => {
    return status === "Aktif" 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800";
  };

  const formatCurrency = (amount: number) => {
    return `Rp${amount.toLocaleString()}`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Detail Program</CardTitle>
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
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Nama Program</h3>
            <p className="text-lg">{program.nama}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Kode Program</h3>
            <p className="text-lg">{program.kode}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm text-gray-500 mb-1">Deskripsi</h3>
          <p>{program.deskripsi || '-'}</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Tanggal Mulai</h3>
            <p>{program.tanggal_mulai}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Tanggal Selesai</h3>
            <p>{program.tanggal_selesai}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Durasi</h3>
            <p>{program.durasi} {program.satuan_durasi}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Kuota</h3>
            <p>{program.kuota}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm text-gray-500 mb-1">Biaya</h3>
          <p>{program.biaya ? formatCurrency(program.biaya) : '-'}</p>
        </div>

        <div>
          <h3 className="font-semibold text-sm text-gray-500 mb-1">Status Program</h3>
          {/* Replace status with a computed status based on dates */}
          <Badge className="bg-green-100 text-green-800">
            {program.tanggal_selesai && new Date(program.tanggal_selesai) < new Date() 
              ? 'Selesai' 
              : program.tanggal_mulai && new Date(program.tanggal_mulai) <= new Date()
                ? 'Berlangsung'
                : 'Belum Dimulai'
            }
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
