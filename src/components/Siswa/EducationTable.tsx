import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { useFormContext, useFieldArray } from "react-hook-form";

export function EducationTable() {
    const { control, register } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "pendidikan"
    });

    const addEducation = () => {
        append({
            jenjang_pendidikan: '',
            nama_institusi: '',
            jurusan: '',
            tahun_masuk: '',
            tahun_lulus: '',
            nilai_akhir: ''
        });
    };

    return (
        <div className="border-t-2 border-gray-400 pt-6 mt-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">学歴 Riwayat Pendidikan / Education History</h3>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addEducation}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Pendidikan
                </Button>
            </div>

            <Table className="border border-gray-400">
                <TableHeader>
                    <TableRow className="bg-gray-100">
                        <TableHead className="border-r border-gray-400 text-center font-medium text-sm">
                            入学年 FROM
                        </TableHead>
                        <TableHead className="border-r border-gray-400 text-center font-medium text-sm">
                            卒業年 TO
                        </TableHead>
                        <TableHead className="border-r border-gray-400 text-center font-medium text-sm min-w-[200px]">
                            学校名 School Name
                        </TableHead>
                        <TableHead className="border-r border-gray-400 text-center font-medium text-sm">
                            専攻 Major
                        </TableHead>
                        <TableHead className="border-r border-gray-400 text-center font-medium text-sm">
                            備考 Notes/Jenjang
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
                                    {...register(`pendidikan.${index}.tahun_masuk` as const)}
                                    placeholder="2020"
                                    className="text-center"
                                />
                            </TableCell>
                            <TableCell className="border-r border-gray-400">
                                <Input
                                    type="number"
                                    {...register(`pendidikan.${index}.tahun_lulus` as const)}
                                    placeholder="2023"
                                    className="text-center"
                                />
                            </TableCell>
                            <TableCell className="border-r border-gray-400">
                                <Input
                                    {...register(`pendidikan.${index}.nama_institusi` as const)}
                                    placeholder="Nama sekolah"
                                />
                            </TableCell>
                            <TableCell className="border-r border-gray-400">
                                <Input
                                    {...register(`pendidikan.${index}.jurusan` as const)}
                                    placeholder="Jurusan"
                                />
                            </TableCell>
                            <TableCell className="border-r border-gray-400">
                                <Input
                                    {...register(`pendidikan.${index}.jenjang_pendidikan` as const)}
                                    placeholder="SMA/SMK/S1"
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
                            <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                                Belum ada data riwayat pendidikan. Klik "Tambah Pendidikan" untuk menambah.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
