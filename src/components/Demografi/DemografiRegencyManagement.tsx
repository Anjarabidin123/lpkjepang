
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Trash2, Building2, Filter } from 'lucide-react';
import { useDemografiProvinces } from '@/hooks/useDemografiProvinces';
import { useDemografiRegencies } from '@/hooks/useDemografiRegencies';
import { DemografiRegencyForm } from './DemografiRegencyForm';
import type { DemografiRegency } from '@/types/demografi';

interface DemografiRegencyManagementProps {
  countryId: string;
}

export function DemografiRegencyManagement({ countryId }: DemografiRegencyManagementProps) {
  const { provinces } = useDemografiProvinces(countryId);
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('');
  const { regencies, isLoading, deleteRegency } = useDemografiRegencies(selectedProvinceId);
  const [showForm, setShowForm] = useState(false);
  const [editingRegency, setEditingRegency] = useState<DemografiRegency | null>(null);

  const handleEdit = (regency: DemografiRegency) => {
    setEditingRegency(regency);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kabupaten ini?')) {
      deleteRegency(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRegency(null);
  };

  if (showForm) {
    return (
      <DemografiRegencyForm
        provinces={provinces}
        regency={editingRegency}
        onClose={handleCloseForm}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Manajemen Kabupaten</h3>
        </div>
        <Button onClick={() => setShowForm(true)} disabled={!selectedProvinceId}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Kabupaten
        </Button>
      </div>

      {/* Province Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Provinsi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedProvinceId} onValueChange={setSelectedProvinceId}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Pilih provinsi" />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((province) => (
                <SelectItem key={province.id} value={province.id}>
                  {province.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Regencies Table */}
      {selectedProvinceId && (
        <Card>
          <CardHeader>
            <CardTitle>
              Daftar Kabupaten - {provinces.find(p => p.id === selectedProvinceId)?.nama}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode</TableHead>
                    <TableHead>Nama Kabupaten</TableHead>
                    <TableHead>Nama Lokal</TableHead>
                    <TableHead>Urutan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {regencies.map((regency) => (
                    <TableRow key={regency.id}>
                      <TableCell className="font-medium">{regency.kode}</TableCell>
                      <TableCell>{regency.nama}</TableCell>
                      <TableCell>{regency.nama_lokal || '-'}</TableCell>
                      <TableCell>{regency.sort_order || 0}</TableCell>
                      <TableCell>
                        <Badge variant={regency.is_active ? 'default' : 'secondary'}>
                          {regency.is_active ? 'Aktif' : 'Tidak Aktif'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(regency)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(regency.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {regencies.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Belum ada data kabupaten untuk provinsi ini
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
