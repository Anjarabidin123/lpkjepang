import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, CheckCircle, XCircle, FileText, Edit, Plus, Trash2, Eye, Download } from "lucide-react";
import { Siswa } from "@/hooks/siswa/types";
import { useDemografiProvinces } from "@/hooks/useDemografiProvinces";
import { useDemografiRegencies } from "@/hooks/useDemografiRegencies";
import { useSiswaPendidikan } from "@/hooks/useSiswaPendidikan";
import { useSiswaPengalamanKerja } from "@/hooks/useSiswaPengalamanKerja";
import { useSiswaKeluargaIndonesia } from "@/hooks/useSiswaKeluargaIndonesia";
import { useSiswaKeluargaJepang } from "@/hooks/useSiswaKeluargaJepang";
import { useSiswaKontakKeluarga } from "@/hooks/useSiswaKontakKeluarga";
import { useSiswa } from "@/hooks/useSiswa";
import { toast } from "sonner";


interface SiswaDetailProps {
  siswa: Siswa;
  onBack: () => void;
  onEdit?: (siswa: Siswa) => void;
}

export function SiswaDetail({ siswa, onBack, onEdit }: SiswaDetailProps) {
  const { deleteSiswa } = useSiswa();
  const { provinces } = useDemografiProvinces();
  const { regencies } = useDemografiRegencies();
  const { pendidikan } = useSiswaPendidikan(siswa.id);
  const { pengalamanKerja } = useSiswaPengalamanKerja(siswa.id);
  const { keluargaIndonesia } = useSiswaKeluargaIndonesia(siswa.id);
  const { keluargaJepang } = useSiswaKeluargaJepang(siswa.id);
  const { kontakKeluarga } = useSiswaKontakKeluarga(siswa.id);

  // Helper function to get province name
  const getProvinceName = (provinceId: string | null) => {
    if (!provinceId) return '-';
    const province = provinces?.find(p => p.id === provinceId);
    return province ? province.nama : '-';
  };

  // Helper function to get regency name
  const getRegencyName = (regencyId: string | null) => {
    if (!regencyId) return '-';
    const regency = regencies?.find(r => r.id === regencyId);
    return regency ? regency.nama : '-';
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateJapanese = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return `${date.getFullYear()} 年 ${String(date.getMonth() + 1).padStart(2, '0')} 月 ${String(date.getDate()).padStart(2, '0')} 日`;
  };

  // Check completion status
  const isDataPribadiComplete = siswa.nama && siswa.nik && siswa.jenis_kelamin && siswa.tempat_lahir && siswa.tanggal_lahir;
  const isDataPendidikanComplete = pendidikan && pendidikan.length > 0;
  const isDataPengalamanKerjaComplete = pengalamanKerja && pengalamanKerja.length > 0;
  const isDataKeluargaContactComplete = kontakKeluarga && kontakKeluarga.length > 0;
  const isDataKeluargaIndonesiaComplete = keluargaIndonesia && keluargaIndonesia.length > 0;
  const isDataKeluargaJepangComplete = keluargaJepang && keluargaJepang.length > 0;

  const profileSections = [
    { name: 'Data Pribadi', completed: isDataPribadiComplete },
    { name: 'Data Pendidikan', completed: isDataPendidikanComplete },
    { name: 'Data Pengalaman Kerja', completed: isDataPengalamanKerjaComplete },
    { name: 'Data Keluarga Yang Bisa Dihubungi', completed: isDataKeluargaContactComplete },
    { name: 'Data Keluarga di Indonesia', completed: isDataKeluargaIndonesiaComplete },
    { name: 'Data Keluarga/Saudara/Teman di Jepang', completed: isDataKeluargaJepangComplete },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>
        <h1 className="text-2xl font-bold">Detail Siswa</h1>
      </div>

      {/* Main Layout - Updated: Opsi moved to left sidebar, CV form expanded to right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Profile Completion and Options */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                <span>Kelengkapan Profil</span>
                <Badge variant="outline" className="ml-auto bg-orange-100 text-orange-800">
                  UNVERIFIED
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileSections.map((section, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    {section.completed ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <span className="text-sm text-gray-700">{section.name}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Opsi Buttons */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Opsi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => onEdit?.(siswa)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Siswa
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => toast.info("Fitur download CV akan segera tersedia")}
              >
                <Download className="w-4 h-4 mr-2" />
                Download CV
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => window.print()}
              >
                <FileText className="w-4 h-4 mr-2" />
                Print CV
              </Button>
              <Button
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                variant="outline"
                onClick={async () => {
                  if (confirm('Apakah Anda yakin ingin menghapus data siswa ini?')) {
                    await deleteSiswa(siswa.id);
                    onBack();
                  }
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus Siswa
              </Button>
            </CardContent>
          </Card>

        </div>

        {/* Expanded CV Content - Now takes 3/4 of the width */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-8">
              {/* CV Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">履歴書</h1>
                <h2 className="text-2xl font-semibold">BIODATA - CV</h2>
              </div>

              {/* NIK */}
              <div className="mb-6">
                <p className="text-lg font-semibold">NIK : {siswa.nik}</p>
              </div>

              {/* Main Bio Table */}
              <div className="grid grid-cols-12 gap-0 border border-gray-400 mb-6">
                {/* Photo Section */}
                <div className="col-span-3 border-r border-gray-400 p-4 flex flex-col items-center">
                  <Avatar className="w-32 h-32 mb-4">
                    <AvatarImage
                      src={siswa.foto_siswa || siswa.foto_url || ''}
                      alt={`Foto ${siswa.nama}`}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gray-300 text-gray-600 text-2xl">
                      {siswa.nama?.charAt(0) || 'S'}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm text-blue-600 text-center">
                    (SUDAH BERANGKAT) {siswa.nama?.toUpperCase()}
                  </p>
                </div>

                {/* Personal Info */}
                <div className="col-span-9">
                  <div className="grid grid-cols-2 h-full">
                    {/* Left Side Info */}
                    <div className="border-r border-gray-400">
                      <div className="border-b border-gray-400 p-2">
                        <p className="text-sm font-semibold">Nama</p>
                        <p className="text-sm text-blue-600">氏名</p>
                        <p className="text-sm">: {siswa.nama || '-'}</p>
                        <p className="text-sm text-blue-600">アハマッド　ファウザン</p>
                      </div>
                      <div className="border-b border-gray-400 p-2">
                        <p className="text-sm font-semibold">Tanggal Lahir</p>
                        <p className="text-sm text-blue-600">生年月日</p>
                        <p className="text-sm">: {formatDateJapanese(siswa.tanggal_lahir)}</p>
                      </div>
                      <div className="border-b border-gray-400 p-2">
                        <p className="text-sm font-semibold">Jenis Kelamin</p>
                        <p className="text-sm text-blue-600">性別</p>
                        <p className="text-sm">: {siswa.jenis_kelamin === 'Laki-laki' ? '男性' : siswa.jenis_kelamin === 'Perempuan' ? '女性' : '-'}</p>
                      </div>
                      <div className="p-2">
                        <p className="text-sm font-semibold">Tempat Lahir</p>
                        <p className="text-sm text-blue-600">出生地</p>
                        <p className="text-sm">: {siswa.tempat_lahir || '-'}</p>
                      </div>
                    </div>

                    {/* Right Side Info */}
                    <div>
                      <div className="border-b border-gray-400 p-2">
                        <p className="text-sm font-semibold">Umur</p>
                        <p className="text-sm text-blue-600">年齢</p>
                        <p className="text-sm">: {siswa.umur || '-'} Tahun</p>
                        <p className="text-sm text-blue-600">{siswa.umur || '-'} 歳</p>
                      </div>
                      <div className="border-b border-gray-400 p-2">
                        <p className="text-sm font-semibold">Status Pernikahan</p>
                        <p className="text-sm text-blue-600">配偶者</p>
                        <p className="text-sm">: {siswa.status_pernikahan === 'Belum Menikah' ? '未婚' : siswa.status_pernikahan || '-'}</p>
                      </div>
                      <div className="p-2">
                        <p className="text-sm font-semibold">No Telp</p>
                        <p className="text-sm text-blue-600">電話番号</p>
                        <p className="text-sm">: {siswa.telepon || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="grid grid-cols-2 gap-4 border border-gray-400 mb-6">
                <div className="p-3">
                  <p className="text-sm font-semibold">Alamat Rumah</p>
                  <p className="text-sm text-blue-600">本国の住所地</p>
                  <p className="text-sm">: {siswa.alamat || '-'}</p>
                </div>
                <div className="p-3 border-l border-gray-400">
                  <p className="text-sm font-semibold">Agama</p>
                  <p className="text-sm text-blue-600">宗教</p>
                  <p className="text-sm">: {siswa.agama || '-'}</p>
                </div>
              </div>

              {/* Physical Information */}
              <div className="grid grid-cols-3 gap-0 border border-gray-400 mb-6">
                <div className="p-3 border-r border-gray-400">
                  <p className="text-sm font-semibold">Tinggi Badan</p>
                  <p className="text-sm text-blue-600">身長</p>
                  <p className="text-sm">: {siswa.tinggi_badan || '-'} Cm</p>
                </div>
                <div className="p-3 border-r border-gray-400">
                  <p className="text-sm font-semibold">Berat Badan</p>
                  <p className="text-sm text-blue-600">体重</p>
                  <p className="text-sm">: {siswa.berat_badan || '-'} Kg</p>
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold">Golongan Darah</p>
                  <p className="text-sm text-blue-600">血液型</p>
                  <p className="text-sm">: {siswa.golongan_darah || '-'}</p>
                </div>
              </div>

              {/* Physical Measurements */}
              <div className="grid grid-cols-3 gap-0 border border-gray-400 mb-6">
                <div className="p-3 border-r border-gray-400">
                  <p className="text-sm font-semibold">Ukuran Sepatu</p>
                  <p className="text-sm text-blue-600">靴サイズ</p>
                  <p className="text-sm">: {siswa.ukuran_sepatu || '-'} Cm</p>
                </div>
                <div className="p-3 border-r border-gray-400">
                  <p className="text-sm font-semibold">Ukuran Pinggang</p>
                  <p className="text-sm text-blue-600">ウエスト</p>
                  <p className="text-sm">: {siswa.ukuran_pinggang || '-'} Cm</p>
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold">Ukuran Kepala</p>
                  <p className="text-sm text-blue-600">頭のサイズ</p>
                  <p className="text-sm">: {siswa.ukuran_kepala || '-'} Cm</p>
                </div>
              </div>

              {/* Smoking and Drinking */}
              <div className="grid grid-cols-2 gap-0 border border-gray-400 mb-6">
                <div className="p-3 border-r border-gray-400">
                  <p className="text-sm font-semibold">Merokok</p>
                  <p className="text-sm text-blue-600">タバコ</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">Saat Ini : {siswa.merokok_sekarang || '-'}</p>
                    <p className="text-sm">Di Jepang : {siswa.merokok_jepang || '-'}</p>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold">Minum Sake</p>
                  <p className="text-sm text-blue-600">飲酒</p>
                  <p className="text-sm">: {siswa.minum_sake || '-'}</p>
                </div>
              </div>

              {/* Vision and Handedness */}
              <div className="grid grid-cols-2 gap-0 border border-gray-400 mb-6">
                <div className="p-3 border-r border-gray-400">
                  <p className="text-sm font-semibold">Vision</p>
                  <p className="text-sm text-blue-600">視力</p>
                  <p className="text-sm">右 Kanan : {siswa.mata_kanan || '-'}</p>
                  <p className="text-sm">左 Kiri : {siswa.mata_kiri || '-'}</p>
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold">Penggunaan Tangan</p>
                  <p className="text-sm text-blue-600">利き手</p>
                  <p className="text-sm">: {siswa.penggunaan_tangan || '-'}</p>
                </div>
              </div>

              {/* Hobbies and Skills */}
              <div className="grid grid-cols-2 gap-0 border border-gray-400 mb-6">
                <div className="p-3 border-r border-gray-400">
                  <p className="text-sm font-semibold">Hobi</p>
                  <p className="text-sm text-blue-600">趣味</p>
                  <p className="text-sm">: {siswa.hobi || '-'}</p>
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold">Bakat Khusus</p>
                  <p className="text-sm text-blue-600">特技</p>
                  <p className="text-sm">: {siswa.bakat_khusus || '-'}</p>
                </div>
              </div>

              {/* Color Blindness */}
              <div className="border border-gray-400 mb-6 p-3">
                <p className="text-sm font-semibold">Buta Warna</p>
                <p className="text-sm text-blue-600">色覚障害</p>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={siswa.buta_warna === true}
                      readOnly
                      className="w-4 h-4"
                    />
                    <span className="text-sm">有色：</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={siswa.buta_warna === false}
                      readOnly
                      className="w-4 h-4"
                    />
                    <span className="text-sm">無</span>
                  </label>
                </div>
              </div>

              {/* Strengths and Weaknesses */}
              <div className="border border-gray-400 mb-6">
                <div className="p-3 border-b border-gray-400">
                  <p className="text-sm font-semibold">Kelebihan & Kekurangan 自己の長所と短所</p>
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-blue-600">長所 Kelebihan:</p>
                  <p className="text-sm mb-4">{siswa.kelebihan || '-'}</p>
                  <p className="text-sm font-semibold text-blue-600">短所 Kekurangan:</p>
                  <p className="text-sm">{siswa.kekurangan || '-'}</p>
                </div>
              </div>

              {/* Experience and Interests */}
              <div className="border border-gray-400 mb-6">
                <div className="p-3 border-b border-gray-400">
                  <p className="text-sm font-semibold">Pengalaman & Minat 経験と興味</p>
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-blue-600">経験 Pengalaman:</p>
                  <p className="text-sm mb-4">{siswa.pengalaman || '-'}</p>
                  <p className="text-sm font-semibold text-blue-600">興味 Minat:</p>
                  <p className="text-sm">{siswa.minat || '-'}</p>
                </div>
              </div>

              {/* Goals and Savings */}
              <div className="border border-gray-400 mb-6">
                <div className="p-3 border-b border-gray-400">
                  <p className="text-sm font-semibold">Tujuan ke Jepang</p>
                  <p className="text-sm text-blue-600">日本へ行く目的</p>
                </div>
                <div className="p-3">
                  <p className="text-sm">{siswa.tujuan_jepang || '-'}</p>
                </div>
              </div>

              <div className="border border-gray-400 mb-6">
                <div className="p-3 border-b border-gray-400">
                  <p className="text-sm font-semibold">Target Menabung</p>
                  <p className="text-sm text-blue-600">日本で3年間貯金目標</p>
                </div>
                <div className="p-3">
                  <p className="text-sm">{siswa.target_menabung || '-'}</p>
                </div>
              </div>

              {/* LPK Information */}
              <div className="grid grid-cols-2 gap-0 border border-gray-400 mb-6">
                <div className="p-3 border-r border-gray-400">
                  <p className="text-sm font-semibold">Tgl Masuk LPK</p>
                  <p className="text-sm">: {formatDate(siswa.tanggal_masuk_lpk)}</p>
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold">Lama Belajar</p>
                  <p className="text-sm">: {siswa.lama_belajar || '-'}</p>
                </div>
              </div>

              {/* Notes */}
              <div className="border border-gray-400 mb-6">
                <div className="p-3 border-b border-gray-400">
                  <p className="text-sm font-semibold">Catatan</p>
                </div>
                <div className="p-3">
                  <p className="text-sm">{siswa.catatan || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Education Section */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">PENDIDIKAN 学歴</h3>
              <div className="border border-gray-400">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-400 p-2 text-sm font-semibold">DARI から</th>
                      <th className="border border-gray-400 p-2 text-sm font-semibold">SAMPAI まで</th>
                      <th className="border border-gray-400 p-2 text-sm font-semibold">NAMA SEKOLAH 学校名</th>
                      <th className="border border-gray-400 p-2 text-sm font-semibold">JURUSAN 学校学科理</th>
                    </tr>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-400 p-2 text-sm">THN 年</th>
                      <th className="border border-gray-400 p-2 text-sm">BLN 月</th>
                      <th className="border border-gray-400 p-2 text-sm">THN 年</th>
                      <th className="border border-gray-400 p-2 text-sm">BLN 月</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendidikan?.map((item, index) => (
                      <tr key={index}>
                        <td className="border border-gray-400 p-2 text-sm">{item.tahun_masuk || '-'} 年</td>
                        <td className="border border-gray-400 p-2 text-sm">7 月</td>
                        <td className="border border-gray-400 p-2 text-sm">{item.tahun_lulus || '-'} 年</td>
                        <td className="border border-gray-400 p-2 text-sm">6 月</td>
                        <td className="border border-gray-400 p-2 text-sm">{item.nama_institusi || '-'}</td>
                        <td className="border border-gray-400 p-2 text-sm text-blue-600">{item.jurusan || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Work Experience Section */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">RIWAYAT/PENGALAMAN KERJA 職業歴</h3>
              <div className="border border-gray-400">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-400 p-2 text-sm font-semibold">DARI から</th>
                      <th className="border border-gray-400 p-2 text-sm font-semibold">SAMPAI まで</th>
                      <th className="border border-gray-400 p-2 text-sm font-semibold">NAMA PERUSAHAAN 会社名</th>
                      <th className="border border-gray-400 p-2 text-sm font-semibold">JENIS PEKERJAAN 職業内容</th>
                      <th className="border border-gray-400 p-2 text-sm font-semibold">URUTAN</th>
                      <th className="border border-gray-400 p-2 text-sm font-semibold">OP</th>
                    </tr>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-400 p-2 text-sm">THN 年</th>
                      <th className="border border-gray-400 p-2 text-sm">BLN 月</th>
                      <th className="border border-gray-400 p-2 text-sm">THN 年</th>
                      <th className="border border-gray-400 p-2 text-sm">BLN 月</th>
                      <th className="border border-gray-400 p-2 text-sm"></th>
                      <th className="border border-gray-400 p-2 text-sm"></th>
                      <th className="border border-gray-400 p-2 text-sm"></th>
                      <th className="border border-gray-400 p-2 text-sm"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {pengalamanKerja?.map((item, index) => (
                      <tr key={index}>
                        <td className="border border-gray-400 p-2 text-sm">{item.tahun_masuk || '-'} 年</td>
                        <td className="border border-gray-400 p-2 text-sm">7 月</td>
                        <td className="border border-gray-400 p-2 text-sm">{item.tahun_keluar || '-'} 年</td>
                        <td className="border border-gray-400 p-2 text-sm">12 月</td>
                        <td className="border border-gray-400 p-2 text-sm">{item.nama_perusahaan || '-'}</td>
                        <td className="border border-gray-400 p-2 text-sm">{item.jenis_pekerjaan || '-'}</td>
                        <td className="border border-gray-400 p-2 text-sm">{index + 1}</td>
                        <td className="border border-gray-400 p-2 text-sm">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Family Contact Section */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">KELUARGA YANG BISA DIHUBUNGI 連絡する家族</h3>
              {kontakKeluarga?.map((kontak, index) => (
                <div key={index} className="border border-gray-400 mb-4">
                  <div className="grid grid-cols-2 gap-0">
                    <div className="p-3 border-r border-gray-400">
                      <p className="text-sm font-semibold">Nama 本国の連絡先名</p>
                      <p className="text-sm">: {kontak.nama || '-'}</p>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold">Alamat 本国の連絡先地</p>
                      <p className="text-sm">: {kontak.alamat || '-'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-0 border-t border-gray-400">
                    <div className="p-3 border-r border-gray-400">
                      <p className="text-sm font-semibold">No. HP 電話番号</p>
                      <p className="text-sm">: {kontak.no_hp || '-'}</p>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold">Penghasilan Keluarga Perbulan 家族の1ヶ月の収入</p>
                      <p className="text-sm">: Rp. {kontak.penghasilan_per_bulan?.toLocaleString() || '-'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Family in Indonesia Section */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">KELUARGA DI INDONESIA インドネシアでの家族</h3>
              <div className="border border-gray-400">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-400 p-2 text-sm font-semibold">NAMA 氏名</th>
                      <th className="border border-gray-400 p-2 text-sm font-semibold">UMUR 年齢</th>
                      <th className="border border-gray-400 p-2 text-sm font-semibold">HUBUNGAN 続柄</th>
                      <th className="border border-gray-400 p-2 text-sm font-semibold">PEKERJAAN 職業</th>
                      <th className="border border-gray-400 p-2 text-sm font-semibold">URUTAN</th>
                      <th className="border border-gray-400 p-2 text-sm font-semibold">OPSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keluargaIndonesia?.map((keluarga, index) => (
                      <tr key={index}>
                        <td className="border border-gray-400 p-2 text-sm">{keluarga.nama || '-'}</td>
                        <td className="border border-gray-400 p-2 text-sm">{keluarga.umur || '-'}</td>
                        <td className="border border-gray-400 p-2 text-sm">{keluarga.hubungan || '-'}</td>
                        <td className="border border-gray-400 p-2 text-sm">{keluarga.pekerjaan || '-'}</td>
                        <td className="border border-gray-400 p-2 text-sm">{index + 1}</td>
                        <td className="border border-gray-400 p-2 text-sm">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Family in Japan Section */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">KELUARGA/SAUDARA/TEMAN DI JEPANG JIKA ADA 在日家族・友達</h3>
              <div className="border border-gray-400">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-400 p-2 text-sm font-semibold">NAMA 氏名</th>
                      <th className="border border-gray-400 p-2 text-sm font-semibold">UMUR 年齢</th>
                      <th className="border border-gray-400 p-2 text-sm font-semibold">HUBUNGAN 続柄</th>
                      <th className="border border-gray-400 p-2 text-sm font-semibold">PEKERJAAN 職業</th>
                      <th className="border border-gray-400 p-2 text-sm font-semibold">URUTAN</th>
                      <th className="border border-gray-400 p-2 text-sm font-semibold">OPSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keluargaJepang?.map((keluarga, index) => (
                      <tr key={index}>
                        <td className="border border-gray-400 p-2 text-sm">{keluarga.nama || '-'}</td>
                        <td className="border border-gray-400 p-2 text-sm">{keluarga.umur || '-'}</td>
                        <td className="border border-gray-400 p-2 text-sm">{keluarga.hubungan || '-'}</td>
                        <td className="border border-gray-400 p-2 text-sm">{keluarga.pekerjaan || '-'}</td>
                        <td className="border border-gray-400 p-2 text-sm">{index + 1}</td>
                        <td className="border border-gray-400 p-2 text-sm">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Attachments Section */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">ATTACHMENT 添付ファイル</h3>
              <div className="border border-gray-400">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-400 p-2 text-sm font-semibold">NAMA ファイルネーム</th>
                      <th className="border border-gray-400 p-2 text-sm font-semibold">FILE ファイル</th>
                      <th className="border border-gray-400 p-2 text-sm font-semibold">URUTAN</th>
                      <th className="border border-gray-400 p-2 text-sm font-semibold">OPSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-400 p-2 text-sm">KTP</td>
                      <td className="border border-gray-400 p-2 text-sm">
                        <Button variant="link" size="sm" className="text-blue-600 p-0">
                          <FileText className="w-4 h-4 mr-1" />
                          KTP-1707/CJmQslHX6mKyeGa5EPH2WZVfxTqcjtUiCNAjAuybW...
                        </Button>
                      </td>
                      <td className="border border-gray-400 p-2 text-sm">1</td>
                      <td className="border border-gray-400 p-2 text-sm">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 p-2 text-sm">PRA MCU</td>
                      <td className="border border-gray-400 p-2 text-sm">
                        <Button variant="link" size="sm" className="text-blue-600 p-0">
                          <FileText className="w-4 h-4 mr-1" />
                          PRA MCU-1707/b4aWGeHqPRYw4QlAHovAFxvrxbRK7oTfBN2W...
                        </Button>
                      </td>
                      <td className="border border-gray-400 p-2 text-sm">2</td>
                      <td className="border border-gray-400 p-2 text-sm">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
