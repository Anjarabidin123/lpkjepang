import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";

interface WorkExperience {
  id: string;
  tahun_masuk: number | '';
  tahun_keluar: number | '';
  nama_perusahaan: string;
  jenis_pekerjaan: string;
}

export function WorkExperienceTable() {
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);

  const addWorkExperience = () => {
    const newExperience: WorkExperience = {
      id: Date.now().toString(),
      tahun_masuk: '',
      tahun_keluar: '',
      nama_perusahaan: '',
      jenis_pekerjaan: ''
    };
    setWorkExperiences([...workExperiences, newExperience]);
  };

  const removeWorkExperience = (id: string) => {
    setWorkExperiences(workExperiences.filter(exp => exp.id !== id));
  };

  const updateWorkExperience = (id: string, field: keyof WorkExperience, value: any) => {
    setWorkExperiences(prevExperiences =>
      prevExperiences.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  return (
    <div className="border-t-2 border-gray-400 pt-6 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">職歴 Pengalaman Kerja / Work Experience</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addWorkExperience}
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Pengalaman
        </Button>
      </div>

      <Table className="border border-gray-400">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="border-r border-gray-400 text-center font-medium text-sm">
              入社年 FROM
            </TableHead>
            <TableHead className="border-r border-gray-400 text-center font-medium text-sm">
              退社年 TO
            </TableHead>
            <TableHead className="border-r border-gray-400 text-center font-medium text-sm">
              会社名 Nama Perusahaan / Company
            </TableHead>
            <TableHead className="border-r border-gray-400 text-center font-medium text-sm">
              職種 Jenis Pekerjaan / Position
            </TableHead>
            <TableHead className="text-center font-medium text-sm">
              アクション Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workExperiences.map((experience) => (
            <TableRow key={experience.id}>
              <TableCell className="border-r border-gray-400">
                <Input
                  type="number"
                  value={experience.tahun_masuk}
                  onChange={(e) => updateWorkExperience(experience.id, 'tahun_masuk', parseInt(e.target.value) || '')}
                  placeholder="2020"
                  className="text-center"
                />
              </TableCell>
              <TableCell className="border-r border-gray-400">
                <Input
                  type="number"
                  value={experience.tahun_keluar}
                  onChange={(e) => updateWorkExperience(experience.id, 'tahun_keluar', parseInt(e.target.value) || '')}
                  placeholder="2023"
                  className="text-center"
                />
              </TableCell>
              <TableCell className="border-r border-gray-400">
                <Input
                  value={experience.nama_perusahaan}
                  onChange={(e) => updateWorkExperience(experience.id, 'nama_perusahaan', e.target.value)}
                  placeholder="Nama perusahaan"
                />
              </TableCell>
              <TableCell className="border-r border-gray-400">
                <Input
                  value={experience.jenis_pekerjaan}
                  onChange={(e) => updateWorkExperience(experience.id, 'jenis_pekerjaan', e.target.value)}
                  placeholder="Posisi/jabatan"
                />
              </TableCell>
              <TableCell className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeWorkExperience(experience.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {workExperiences.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                Belum ada data pengalaman kerja. Klik "Tambah Pengalaman" untuk menambah.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}