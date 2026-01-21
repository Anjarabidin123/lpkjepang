
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { JobOrderPeserta } from '@/types/jobOrder';

interface JobOrderCurrentPesertaProps {
  peserta: JobOrderPeserta[];
  onUpdatePeserta: (data: { id: string; status: string; keterangan: string }) => void;
  isUpdatingPeserta: boolean;
}

export function JobOrderCurrentPeserta({ 
  peserta, 
  onUpdatePeserta,
  isUpdatingPeserta 
}: JobOrderCurrentPesertaProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Lulus': return 'text-green-600 bg-green-50';
      case 'Tidak Lulus': return 'text-red-600 bg-red-50';
      case 'Cadangan': return 'text-yellow-600 bg-yellow-50';
      case 'Batal': return 'text-gray-600 bg-gray-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  if (peserta.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Peserta Terdaftar</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">No</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Jenis Kelamin</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Keterangan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {peserta.map((pesertaItem, index) => (
              <TableRow key={pesertaItem.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{pesertaItem.siswa?.nama || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{pesertaItem.siswa?.nik || 'N/A'}</div>
                  </div>
                </TableCell>
                <TableCell>{pesertaItem.siswa?.jenis_kelamin || '-'}</TableCell>
                <TableCell>
                  <select
                    value={pesertaItem.status}
                    onChange={(e) => onUpdatePeserta({
                      id: pesertaItem.id,
                      status: e.target.value,
                      keterangan: pesertaItem.keterangan || ''
                    })}
                    className={`px-2 py-1 rounded text-sm border-0 ${getStatusColor(pesertaItem.status)}`}
                    disabled={isUpdatingPeserta}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Lulus">Lulus</option>
                    <option value="Tidak Lulus">Tidak Lulus</option>
                    <option value="Cadangan">Cadangan</option>
                    <option value="Batal">Batal</option>
                  </select>
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Keterangan..."
                    value={pesertaItem.keterangan || ''}
                    onChange={(e) => onUpdatePeserta({
                      id: pesertaItem.id,
                      status: pesertaItem.status,
                      keterangan: e.target.value
                    })}
                    className="text-sm"
                    disabled={isUpdatingPeserta}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
