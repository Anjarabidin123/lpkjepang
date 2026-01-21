
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { useDemografiProvinces } from '@/hooks/useDemografiProvinces';
import { DemografiProvinceForm } from './DemografiProvinceForm';
import type { DemografiProvince } from '@/types/demografi';

interface DemografiProvinceManagementProps {
  countryId: string;
}

export function DemografiProvinceManagement({ countryId }: DemografiProvinceManagementProps) {
  const { provinces, isLoading, deleteProvince } = useDemografiProvinces(countryId);
  const [showForm, setShowForm] = useState(false);
  const [editingProvince, setEditingProvince] = useState<DemografiProvince | null>(null);

  const handleEdit = (province: DemografiProvince) => {
    setEditingProvince(province);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus provinsi ini?')) {
      deleteProvince(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProvince(null);
  };

  if (showForm) {
    return (
      <DemografiProvinceForm
        countryId={countryId}
        province={editingProvince}
        onClose={handleCloseForm}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Manajemen Provinsi</h3>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Tambah Provinsi
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Provinsi</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama Provinsi</TableHead>
                  <TableHead>Nama Lokal</TableHead>
                  <TableHead>Urutan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {provinces.map((province) => (
                  <TableRow key={province.id}>
                    <TableCell className="font-medium">{province.kode}</TableCell>
                    <TableCell>{province.nama}</TableCell>
                    <TableCell>{province.nama_lokal || '-'}</TableCell>
                    <TableCell>{province.sort_order || 0}</TableCell>
                    <TableCell>
                      <Badge variant={province.is_active ? 'default' : 'secondary'}>
                        {province.is_active ? 'Aktif' : 'Tidak Aktif'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(province)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(province.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {provinces.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Belum ada data provinsi
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
