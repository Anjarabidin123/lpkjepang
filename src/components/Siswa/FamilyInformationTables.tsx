import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";

interface FamilyMember {
  id: string;
  nama: string;
  hubungan: string;
  umur: number | '';
  pekerjaan: string;
}

interface ContactPerson {
  nama: string;
  alamat: string;
  rt_rw: string;
  kelurahan: string;
  kecamatan: string;
  kab_kota: string;
  provinsi: string;
  kode_pos: string;
  no_hp: string;
  penghasilan_per_bulan: number | '';
}

const hubunganOptions = [
  "Ayah", "Ibu", "Suami", "Istri", "Anak", "Kakak", "Adik",
  "Kakek", "Nenek", "Paman", "Bibi", "Sepupu", "Keponakan", "Lainnya"
];

export function FamilyInformationTables() {
  const [familyIndonesia, setFamilyIndonesia] = useState<FamilyMember[]>([]);
  const [familyJapan, setFamilyJapan] = useState<FamilyMember[]>([]);
  const [emergencyContact, setEmergencyContact] = useState<ContactPerson>({
    nama: '',
    alamat: '',
    rt_rw: '',
    kelurahan: '',
    kecamatan: '',
    kab_kota: '',
    provinsi: '',
    kode_pos: '',
    no_hp: '',
    penghasilan_per_bulan: ''
  });

  const addFamilyMember = (type: 'indonesia' | 'japan') => {
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      nama: '',
      hubungan: '',
      umur: '',
      pekerjaan: ''
    };

    if (type === 'indonesia') {
      setFamilyIndonesia([...familyIndonesia, newMember]);
    } else {
      setFamilyJapan([...familyJapan, newMember]);
    }
  };

  const removeFamilyMember = (type: 'indonesia' | 'japan', id: string) => {
    if (type === 'indonesia') {
      setFamilyIndonesia(familyIndonesia.filter(member => member.id !== id));
    } else {
      setFamilyJapan(familyJapan.filter(member => member.id !== id));
    }
  };

  const updateFamilyMember = (type: 'indonesia' | 'japan', id: string, field: keyof FamilyMember, value: any) => {
    const updateList = (members: FamilyMember[]) =>
      members.map(member =>
        member.id === id ? { ...member, [field]: value } : member
      );

    if (type === 'indonesia') {
      setFamilyIndonesia(updateList(familyIndonesia));
    } else {
      setFamilyJapan(updateList(familyJapan));
    }
  };

  const updateEmergencyContact = (field: keyof ContactPerson, value: any) => {
    setEmergencyContact(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Emergency Contact in Indonesia */}
      <div className="border-t-2 border-gray-400 pt-6">
        <h3 className="text-lg font-bold mb-4">緊急連絡先 Kontak Darurat di Indonesia</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">名前 Nama / Name</Label>
            <Input
              value={emergencyContact.nama}
              onChange={(e) => updateEmergencyContact('nama', e.target.value)}
              className="mt-1"
              placeholder="Nama lengkap kontak darurat"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">電話番号 No. HP / Phone</Label>
            <Input
              value={emergencyContact.no_hp}
              onChange={(e) => updateEmergencyContact('no_hp', e.target.value)}
              className="mt-1"
              placeholder="+62"
            />
          </div>
        </div>

        <div className="mt-4">
          <Label className="text-sm font-medium">住所 Alamat / Address</Label>
          <Input
            value={emergencyContact.alamat}
            onChange={(e) => updateEmergencyContact('alamat', e.target.value)}
            className="mt-1"
            placeholder="Alamat lengkap"
          />
        </div>

        <div className="grid grid-cols-4 gap-4 mt-4">
          <div>
            <Label className="text-sm">RT/RW</Label>
            <Input
              value={emergencyContact.rt_rw}
              onChange={(e) => updateEmergencyContact('rt_rw', e.target.value)}
              className="mt-1"
              placeholder="001/002"
            />
          </div>
          <div>
            <Label className="text-sm">Kelurahan</Label>
            <Input
              value={emergencyContact.kelurahan}
              onChange={(e) => updateEmergencyContact('kelurahan', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm">Kecamatan</Label>
            <Input
              value={emergencyContact.kecamatan}
              onChange={(e) => updateEmergencyContact('kecamatan', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm">Kab/Kota</Label>
            <Input
              value={emergencyContact.kab_kota}
              onChange={(e) => updateEmergencyContact('kab_kota', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <Label className="text-sm">Provinsi</Label>
            <Input
              value={emergencyContact.provinsi}
              onChange={(e) => updateEmergencyContact('provinsi', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm">Kode Pos</Label>
            <Input
              value={emergencyContact.kode_pos}
              onChange={(e) => updateEmergencyContact('kode_pos', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm">収入 Penghasilan/Bulan (Rp)</Label>
            <Input
              type="number"
              value={emergencyContact.penghasilan_per_bulan}
              onChange={(e) => updateEmergencyContact('penghasilan_per_bulan', parseInt(e.target.value) || '')}
              className="mt-1"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Family Members in Indonesia */}
      <div className="border-t-2 border-gray-400 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">家族構成 Keluarga di Indonesia</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addFamilyMember('indonesia')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Anggota
          </Button>
        </div>

        <Table className="border border-gray-400">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="border-r border-gray-400 text-center font-medium text-sm">
                名前 Nama / Name
              </TableHead>
              <TableHead className="border-r border-gray-400 text-center font-medium text-sm">
                続柄 Hubungan / Relation
              </TableHead>
              <TableHead className="border-r border-gray-400 text-center font-medium text-sm">
                年齢 Umur / Age
              </TableHead>
              <TableHead className="border-r border-gray-400 text-center font-medium text-sm">
                職業 Pekerjaan / Job
              </TableHead>
              <TableHead className="text-center font-medium text-sm">
                アクション Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {familyIndonesia.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="border-r border-gray-400">
                  <Input
                    value={member.nama}
                    onChange={(e) => updateFamilyMember('indonesia', member.id, 'nama', e.target.value)}
                    placeholder="Nama lengkap"
                  />
                </TableCell>
                <TableCell className="border-r border-gray-400">
                  <Select
                    value={member.hubungan}
                    onValueChange={(value) => updateFamilyMember('indonesia', member.id, 'hubungan', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih hubungan" />
                    </SelectTrigger>
                    <SelectContent>
                      {hubunganOptions.map((hubungan) => (
                        <SelectItem key={hubungan} value={hubungan}>
                          {hubungan}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="border-r border-gray-400">
                  <Input
                    type="number"
                    value={member.umur}
                    onChange={(e) => updateFamilyMember('indonesia', member.id, 'umur', parseInt(e.target.value) || '')}
                    placeholder="Umur"
                  />
                </TableCell>
                <TableCell className="border-r border-gray-400">
                  <Input
                    value={member.pekerjaan}
                    onChange={(e) => updateFamilyMember('indonesia', member.id, 'pekerjaan', e.target.value)}
                    placeholder="Pekerjaan"
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFamilyMember('indonesia', member.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {familyIndonesia.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                  Belum ada data keluarga. Klik "Tambah Anggota" untuk menambah.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Family Members in Japan */}
      <div className="border-t-2 border-gray-400 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">日本の家族・知人 Keluarga/Teman di Jepang</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addFamilyMember('japan')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Kontak
          </Button>
        </div>

        <Table className="border border-gray-400">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="border-r border-gray-400 text-center font-medium text-sm">
                名前 Nama / Name
              </TableHead>
              <TableHead className="border-r border-gray-400 text-center font-medium text-sm">
                続柄 Hubungan / Relation
              </TableHead>
              <TableHead className="border-r border-gray-400 text-center font-medium text-sm">
                年齢 Umur / Age
              </TableHead>
              <TableHead className="border-r border-gray-400 text-center font-medium text-sm">
                職業 Pekerjaan / Job
              </TableHead>
              <TableHead className="text-center font-medium text-sm">
                アクション Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {familyJapan.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="border-r border-gray-400">
                  <Input
                    value={member.nama}
                    onChange={(e) => updateFamilyMember('japan', member.id, 'nama', e.target.value)}
                    placeholder="Nama lengkap"
                  />
                </TableCell>
                <TableCell className="border-r border-gray-400">
                  <Select
                    value={member.hubungan}
                    onValueChange={(value) => updateFamilyMember('japan', member.id, 'hubungan', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih hubungan" />
                    </SelectTrigger>
                    <SelectContent>
                      {hubunganOptions.map((hubungan) => (
                        <SelectItem key={hubungan} value={hubungan}>
                          {hubungan}
                        </SelectItem>
                      ))}
                      <SelectItem value="Teman">友人 Teman</SelectItem>
                      <SelectItem value="Kenalan">知人 Kenalan</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="border-r border-gray-400">
                  <Input
                    type="number"
                    value={member.umur}
                    onChange={(e) => updateFamilyMember('japan', member.id, 'umur', parseInt(e.target.value) || '')}
                    placeholder="Umur"
                  />
                </TableCell>
                <TableCell className="border-r border-gray-400">
                  <Input
                    value={member.pekerjaan}
                    onChange={(e) => updateFamilyMember('japan', member.id, 'pekerjaan', e.target.value)}
                    placeholder="Pekerjaan"
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFamilyMember('japan', member.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {familyJapan.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                  Belum ada data keluarga/teman di Jepang. Klik "Tambah Kontak" untuk menambah.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
