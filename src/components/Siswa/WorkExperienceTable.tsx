import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { useFormContext, useFieldArray } from "react-hook-form";

export function WorkExperienceTable() {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "pengalaman_kerja"
  });

  const addWorkExperience = () => {
    append({
      tahun_masuk: '',
      tahun_keluar: '',
      nama_perusahaan: '',
      jenis_pekerjaan: ''
    });
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
          {fields.map((field, index) => (
            <TableRow key={field.id}>
              <TableCell className="border-r border-gray-400">
                <Input
                  type="number"
                  {...register(`pengalaman_kerja.${index}.tahun_masuk` as const)}
                  placeholder="2020"
                  className="text-center"
                />
              </TableCell>
              <TableCell className="border-r border-gray-400">
                <Input
                  type="number"
                  {...register(`pengalaman_kerja.${index}.tahun_keluar` as const)}
                  placeholder="2023"
                  className="text-center"
                />
              </TableCell>
              <TableCell className="border-r border-gray-400">
                <Input
                  {...register(`pengalaman_kerja.${index}.nama_perusahaan` as const)}
                  placeholder="Nama perusahaan"
                />
              </TableCell>
              <TableCell className="border-r border-gray-400">
                <Input
                  {...register(`pengalaman_kerja.${index}.jenis_pekerjaan` as const)}
                  placeholder="Posisi/jabatan"
                />
              </TableCell>
              <TableCell className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {fields.length === 0 && (
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

