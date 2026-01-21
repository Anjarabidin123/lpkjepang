
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface Siswa {
  id: string;
  nama: string;
  nik: string;
  jenis_kelamin: string | null;
}

interface JobOrderAvailableSiswaProps {
  siswa: Siswa[];
  selectedSiswa: string[];
  searchTerm: string;
  onSelectSiswa: (siswaId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
}

export function JobOrderAvailableSiswa({ 
  siswa, 
  selectedSiswa, 
  searchTerm,
  onSelectSiswa,
  onSelectAll 
}: JobOrderAvailableSiswaProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Siswa Tersedia</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedSiswa.length === siswa.length && siswa.length > 0}
                  onCheckedChange={onSelectAll}
                />
              </TableHead>
              <TableHead className="w-16">No</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Jenis Kelamin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {siswa.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  {searchTerm ? 'Tidak ada siswa yang ditemukan' : 'Semua siswa sudah terdaftar sebagai peserta'}
                </TableCell>
              </TableRow>
            ) : (
              siswa.map((siswaItem, index) => (
                <TableRow key={siswaItem.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedSiswa.includes(siswaItem.id)}
                      onCheckedChange={(checked) => onSelectSiswa(siswaItem.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{siswaItem.nama}</div>
                      <div className="text-sm text-gray-500">{siswaItem.nik}</div>
                    </div>
                  </TableCell>
                  <TableCell>{siswaItem.jenis_kelamin || '-'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
