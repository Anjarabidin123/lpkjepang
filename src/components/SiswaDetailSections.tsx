
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GraduationCap } from "lucide-react";
import { Siswa } from "@/hooks/useSiswa";
import { PendidikanForm } from "./siswa-forms/PendidikanForm";
import { KontakKeluargaForm } from "./siswa-forms/KontakKeluargaForm";

interface SiswaDetailSectionsProps {
  siswa: Siswa;
}

export function SiswaDetailSections({ siswa }: SiswaDetailSectionsProps) {
  return (
    <div className="space-y-6">
      {/* Pendidikan Section - Now shows basic school info in table format */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5" />
            <span>Informasi Sekolah Dasar</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Sekolah</TableHead>
                  <TableHead>Jurusan</TableHead>
                  <TableHead>Tahun Masuk</TableHead>
                  <TableHead>Tahun Lulus</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{siswa.nama_sekolah || '-'}</TableCell>
                  <TableCell>{siswa.jurusan || '-'}</TableCell>
                  <TableCell>{siswa.tahun_masuk_sekolah || '-'}</TableCell>
                  <TableCell>{siswa.tahun_lulus_sekolah || '-'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* CRUD Forms for Related Data - All in tabular format */}
      <PendidikanForm siswaId={siswa.id} />
      <KontakKeluargaForm siswaId={siswa.id} />
    </div>
  );
}
