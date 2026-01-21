
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Save, X } from "lucide-react";
import { useSiswaKontakKeluarga } from "@/hooks/useSiswaKontakKeluarga";
import { SiswaKontakKeluarga } from "@/hooks/useSiswa";
import { KontakKeluargaFormFields } from "./kontak-keluarga/KontakKeluargaFormFields";
import { KontakKeluargaTable } from "./kontak-keluarga/KontakKeluargaTable";

interface KontakKeluargaFormProps {
  siswaId: string;
}

export function KontakKeluargaForm({ siswaId }: KontakKeluargaFormProps) {
  const { kontakKeluarga, create, update, delete: deleteKontak, isCreating, isUpdating, isDeleting } = useSiswaKontakKeluarga(siswaId);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    alamat: '',
    no_hp: '',
    penghasilan_per_bulan: '',
    rt_rw: '',
    kelurahan: '',
    kecamatan: '',
    kab_kota: '',
    provinsi: '',
    kode_pos: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      siswa_id: siswaId,
      nama: formData.nama,
      alamat: formData.alamat || null,
      no_hp: formData.no_hp || null,
      penghasilan_per_bulan: formData.penghasilan_per_bulan ? parseFloat(formData.penghasilan_per_bulan) : null,
      rt_rw: formData.rt_rw || null,
      kelurahan: formData.kelurahan || null,
      kecamatan: formData.kecamatan || null,
      kab_kota: formData.kab_kota || null,
      provinsi: formData.provinsi || null,
      kode_pos: formData.kode_pos || null
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
      nama: '',
      alamat: '',
      no_hp: '',
      penghasilan_per_bulan: '',
      rt_rw: '',
      kelurahan: '',
      kecamatan: '',
      kab_kota: '',
      provinsi: '',
      kode_pos: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (item: SiswaKontakKeluarga) => {
    setFormData({
      nama: item.nama,
      alamat: item.alamat || '',
      no_hp: item.no_hp || '',
      penghasilan_per_bulan: item.penghasilan_per_bulan?.toString() || '',
      rt_rw: item.rt_rw || '',
      kelurahan: item.kelurahan || '',
      kecamatan: item.kecamatan || '',
      kab_kota: item.kab_kota || '',
      provinsi: item.provinsi || '',
      kode_pos: item.kode_pos || ''
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data kontak keluarga ini?')) {
      deleteKontak(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Keluarga Yang Bisa Dihubungi</CardTitle>
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
            <KontakKeluargaFormFields formData={formData} setFormData={setFormData} />
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

        <KontakKeluargaTable
          kontakKeluarga={kontakKeluarga}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
        />
      </CardContent>
    </Card>
  );
}
