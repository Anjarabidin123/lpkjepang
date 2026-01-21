
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Save, X } from "lucide-react";
import { useSiswaPendidikan, SiswaPendidikan } from "@/hooks/useSiswaPendidikan";
import { PendidikanFormFields } from "./pendidikan/PendidikanFormFields";
import { PendidikanTable } from "./pendidikan/PendidikanTable";

interface PendidikanFormProps {
  siswaId: string;
}

export function PendidikanForm({ siswaId }: PendidikanFormProps) {
  const { pendidikan, create, update, delete: deletePendidikan, isCreating, isUpdating, isDeleting } = useSiswaPendidikan(siswaId);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    jenjang_pendidikan: '',
    nama_institusi: '',
    jurusan: '',
    tahun_masuk: '',
    tahun_lulus: '',
    nilai_akhir: '',
    sertifikat_url: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      siswa_id: siswaId,
      jenjang_pendidikan: formData.jenjang_pendidikan,
      nama_institusi: formData.nama_institusi,
      jurusan: formData.jurusan || null,
      tahun_masuk: formData.tahun_masuk ? parseInt(formData.tahun_masuk) : null,
      tahun_lulus: formData.tahun_lulus ? parseInt(formData.tahun_lulus) : null,
      nilai_akhir: formData.nilai_akhir || null,
      sertifikat_url: formData.sertifikat_url || null
    };

    if (editingId) {
      update({ id: editingId, ...data });
    } else {
      create(data);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      jenjang_pendidikan: '',
      nama_institusi: '',
      jurusan: '',
      tahun_masuk: '',
      tahun_lulus: '',
      nilai_akhir: '',
      sertifikat_url: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (item: SiswaPendidikan) => {
    setFormData({
      jenjang_pendidikan: item.jenjang_pendidikan,
      nama_institusi: item.nama_institusi,
      jurusan: item.jurusan || '',
      tahun_masuk: item.tahun_masuk?.toString() || '',
      tahun_lulus: item.tahun_lulus?.toString() || '',
      nilai_akhir: item.nilai_akhir || '',
      sertifikat_url: item.sertifikat_url || ''
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data pendidikan ini?')) {
      deletePendidikan(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Informasi Pendidikan</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(!showForm)}
            disabled={isCreating || isUpdating}
          >
            <Plus className="w-4 h-4 mr-1" />
            Tambah
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-gray-50 space-y-3">
            <PendidikanFormFields formData={formData} setFormData={setFormData} />
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={isCreating || isUpdating}>
                <Save className="w-4 h-4 mr-1" />
                {editingId ? 'Update' : 'Simpan'}
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={resetForm}>
                <X className="w-4 h-4 mr-1" />
                Batal
              </Button>
            </div>
          </form>
        )}

        <PendidikanTable
          pendidikan={pendidikan}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
        />
      </CardContent>
    </Card>
  );
}
