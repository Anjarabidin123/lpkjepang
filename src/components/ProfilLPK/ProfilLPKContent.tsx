
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, RefreshCw, Building2 } from 'lucide-react';
import { useProfilLPK, type ProfilLPK } from '@/hooks/useProfilLPK';

export function ProfilLPKContent() {
  const { profiles, loading, createProfile, updateProfile, deleteProfile, fetchProfiles } = useProfilLPK();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<ProfilLPK | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    pemilik: '',
    alamat: '',
    no_telp: '',
    email: '',
    website: '',
    is_active: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProfile) {
        await updateProfile(editingProfile.id, formData);
      } else {
        await createProfile(formData);
      }
      
      setIsDialogOpen(false);
      setEditingProfile(null);
      setFormData({
        nama: '',
        pemilik: '',
        alamat: '',
        no_telp: '',
        email: '',
        website: '',
        is_active: true
      });
    } catch (error) {
      console.error('Error saving LPK profile:', error);
    }
  };

  const handleEdit = (profile: ProfilLPK) => {
    setEditingProfile(profile);
    setFormData({
      nama: profile.nama,
      pemilik: profile.pemilik || '',
      alamat: profile.alamat || '',
      no_telp: profile.no_telp || '',
      email: profile.email || '',
      website: profile.website || '',
      is_active: profile.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this LPK profile?')) {
      try {
        await deleteProfile(id);
      } catch (error) {
        console.error('Error deleting LPK profile:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nama: '',
      pemilik: '',
      alamat: '',
      no_telp: '',
      email: '',
      website: '',
      is_active: true
    });
    setEditingProfile(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">Profil LPK</h1>
            <p className="text-gray-600">Kelola profil dan identitas Lembaga Pelatihan Kerja</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchProfiles} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Profil
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingProfile ? 'Edit Profil LPK' : 'Tambah Profil LPK Baru'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nama">Nama LPK *</Label>
                    <Input
                      id="nama"
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="pemilik">Pemilik</Label>
                    <Input
                      id="pemilik"
                      value={formData.pemilik}
                      onChange={(e) => setFormData({ ...formData, pemilik: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="alamat">Alamat</Label>
                  <Textarea
                    id="alamat"
                    value={formData.alamat}
                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="no_telp">No. Telepon</Label>
                    <Input
                      id="no_telp"
                      value={formData.no_telp}
                      onChange={(e) => setFormData({ ...formData, no_telp: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Profil Aktif</Label>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingProfile ? 'Update' : 'Simpan'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Profil LPK</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama LPK</TableHead>
                  <TableHead>Pemilik</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : profiles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Belum ada profil LPK
                    </TableCell>
                  </TableRow>
                ) : (
                  profiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{profile.nama}</div>
                          {profile.website && (
                            <a href={profile.website} target="_blank" rel="noopener noreferrer" 
                               className="text-sm text-blue-600 hover:underline">
                              {profile.website}
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{profile.pemilik || '-'}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {profile.no_telp && <div>{profile.no_telp}</div>}
                          {profile.email && <div>{profile.email}</div>}
                          {!profile.no_telp && !profile.email && '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={profile.is_active ? "default" : "secondary"}>
                          {profile.is_active ? 'Aktif' : 'Tidak Aktif'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(profile.created_at).toLocaleDateString('en-US')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(profile)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(profile.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
