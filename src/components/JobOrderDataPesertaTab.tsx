import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  UserPlus, 
  Search, 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  ArrowLeft,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  CreditCard
} from "lucide-react";
import { JobOrder } from '@/types/jobOrder';
import { useJobOrderPeserta } from '@/hooks/useJobOrderPeserta';
import { useSiswa } from '@/hooks/useSiswa';
import { useToast } from '@/hooks/use-toast';

interface JobOrderDataPesertaTabProps {
  jobOrder: JobOrder;
}

export function JobOrderDataPesertaTab({ jobOrder }: JobOrderDataPesertaTabProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { siswa } = useSiswa();
  const { 
    peserta, 
    isLoading: isLoadingPeserta, 
    addPeserta, 
    updatePeserta, 
    isAddingPeserta,
    isUpdatingPeserta 
  } = useJobOrderPeserta(jobOrder.id);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSiswa, setSelectedSiswa] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const availableSiswa = (siswa || []).filter(s => 
    !(peserta || []).some(p => p.siswa_id === s.id) &&
    (searchTerm === '' || 
     (s.nama || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
     (s.nik || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredPeserta = (peserta || []).filter(p => 
    statusFilter === 'all' || p.status === statusFilter
  );

  const handleAddPeserta = () => {
    if (selectedSiswa.length === 0) {
      toast({
        title: "Error",
        description: "Pilih minimal satu siswa untuk ditambahkan",
        variant: "destructive",
      });
      return;
    }

    addPeserta({ 
      siswa_ids: selectedSiswa, 
      job_order_id: jobOrder.id 
    });
    setSelectedSiswa([]);
  };

  const handleUpdateStatus = (participantId: string, newStatus: string, keterangan: string = '') => {
    updatePeserta({ id: participantId, status: newStatus, keterangan });
  };

  const handleSiswaSelection = (siswaId: string, checked: boolean) => {
    setSelectedSiswa(prev => 
      checked 
        ? [...prev, siswaId]
        : prev.filter(id => id !== siswaId)
    );
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Lulus': 
        return { 
          badge: "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100",
          dot: "bg-emerald-500"
        };
      case 'Tidak Lulus': 
        return { 
          badge: "bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100",
          dot: "bg-rose-500"
        };
      case 'Cadangan': 
        return { 
          badge: "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100",
          dot: "bg-amber-500"
        };
      case 'Batal': 
        return { 
          badge: "bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-100",
          dot: "bg-slate-500"
        };
      default: 
        return { 
          badge: "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100",
          dot: "bg-blue-500"
        };
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  if (isLoadingPeserta) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-xl">
        <div className="text-center space-y-4">
          <div className="relative w-12 h-12 mx-auto">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-slate-500 font-semibold text-xs">Menyiapkan Data Peserta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Statistics Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Peserta", value: peserta?.length || 0, icon: Users, color: "blue", trend: "Peserta Aktif" },
          { label: "Lulus", value: peserta?.filter(p => p.status === 'Lulus').length || 0, icon: UserCheck, color: "emerald", trend: "Seleksi Berhasil" },
          { label: "Pending", value: peserta?.filter(p => p.status === 'Pending').length || 0, icon: Clock, color: "amber", trend: "Menunggu Proses" },
          { label: "Tidak Lulus", value: peserta?.filter(p => p.status === 'Tidak Lulus').length || 0, icon: UserX, color: "rose", trend: "Seleksi Gagal" },
        ].map((stat, i) => (
          <Card key={i} className="border-0 shadow-lg shadow-slate-200/40 rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 bg-white/80 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl ring-1 ring-${stat.color}-100/50`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold text-${stat.color}-600/70 bg-${stat.color}-50 px-2 py-0.5 rounded-md uppercase tracking-wider`}>{stat.trend}</span>
              </div>
              <div className="space-y-0.5">
                <h4 className="text-2xl font-bold text-slate-900 leading-none">{stat.value}</h4>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-tight">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar: Add Participant */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-0 shadow-xl shadow-slate-200/40 rounded-2xl bg-white/80 backdrop-blur-xl overflow-hidden sticky top-6">
            <CardHeader className="bg-gradient-to-br from-slate-900 to-slate-800 p-5">
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md ring-1 ring-white/20">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-base font-bold">Tambah Peserta</span>
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Pendaftaran Seleksi</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-3">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder="Cari Siswa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-10 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-xs font-medium"
                  />
                </div>

                <div className="border border-slate-100 rounded-xl bg-slate-50/30 overflow-hidden">
                  <div className="max-h-[350px] overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
                    {availableSiswa.length > 0 ? (
                      availableSiswa.map((s) => (
                        <div 
                          key={s.id} 
                          className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                            selectedSiswa.includes(s.id) 
                            ? 'bg-primary/5 border-primary/20 shadow-sm' 
                            : 'bg-white border-transparent hover:border-slate-200'
                          }`}
                          onClick={() => handleSiswaSelection(s.id, !selectedSiswa.includes(s.id))}
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                            selectedSiswa.includes(s.id)
                            ? 'bg-primary border-primary text-white scale-110'
                            : 'bg-white border-slate-200'
                          }`}>
                            {selectedSiswa.includes(s.id) && <UserCheck className="w-2.5 h-2.5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-900 truncate text-[13px]">{s.nama}</div>
                            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-tight">NIK: {s.nik}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center space-y-2">
                        <Users className="w-8 h-8 text-slate-200 mx-auto" />
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          {searchTerm ? 'Siswa tidak ditemukan' : 'Semua siswa terdaftar'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleAddPeserta}
                disabled={selectedSiswa.length === 0 || isAddingPeserta}
                className="w-full h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-lg shadow-slate-200 transition-all active:scale-95 disabled:opacity-50"
              >
                {isAddingPeserta ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>MEMPROSES...</span>
                  </div>
                ) : (
                  `DAFTARKAN ${selectedSiswa.length} PESERTA`
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content: Enhanced Data Table */}
        <div className="lg:col-span-9 space-y-6">
          <Card className="border-0 shadow-xl shadow-slate-200/40 rounded-2xl bg-white/80 backdrop-blur-xl overflow-hidden min-h-[600px]">
            <CardHeader className="p-6 border-b border-slate-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/5 text-primary rounded-xl ring-1 ring-primary/10">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xl font-bold text-slate-900 tracking-tight">Daftar Peserta Seleksi</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{filteredPeserta.length} Personel Terdaftar</span>
                    </div>
                  </div>
                </CardTitle>
                
                <div className="flex items-center gap-3">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-44 h-10 rounded-xl border-slate-100 bg-slate-50 font-bold text-xs text-slate-600 focus:ring-primary/20">
                      <SelectValue placeholder="Filter Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                      <SelectItem value="all" className="text-xs font-bold">SEMUA STATUS</SelectItem>
                      <SelectItem value="Pending" className="text-xs font-bold">PENDING</SelectItem>
                      <SelectItem value="Lulus" className="text-xs font-bold text-emerald-600">LULUS</SelectItem>
                      <SelectItem value="Tidak Lulus" className="text-xs font-bold text-rose-600">TIDAK LULUS</SelectItem>
                      <SelectItem value="Cadangan" className="text-xs font-bold text-amber-600">CADANGAN</SelectItem>
                      <SelectItem value="Batal" className="text-xs font-bold text-slate-400">BATAL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredPeserta.length > 0 ? (
                <div className="relative">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="hover:bg-transparent border-slate-100">
                        <TableHead className="w-[80px] text-[10px] font-bold uppercase tracking-widest text-slate-400">Peserta</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Informasi Pribadi</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Kontak & NIK</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Status Seleksi</TableHead>
                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPeserta.map((participant, index) => {
                        const styles = getStatusStyles(participant.status || 'Pending');
                        return (
                          <TableRow 
                            key={participant.id} 
                            className="group border-slate-50 hover:bg-slate-50/50 transition-colors duration-300"
                          >
                            <TableCell>
                              <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100">
                                <AvatarImage src={participant.siswa?.foto_profil} />
                                <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 font-bold text-xs">
                                  {getInitials(participant.siswa?.nama || 'Unknown')}
                                </AvatarFallback>
                              </Avatar>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-bold text-slate-900 group-hover:text-primary transition-colors text-[14px]">
                                  {participant.siswa?.nama}
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                                    <Calendar className="w-3 h-3" />
                                    {participant.siswa?.tanggal_lahir ? new Date(participant.siswa.tanggal_lahir).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
                                  </div>
                                  <Badge variant="outline" className="text-[9px] font-bold uppercase border-slate-100 text-slate-500 bg-white">
                                    {participant.siswa?.jenis_kelamin || '-'}
                                  </Badge>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
                                  <CreditCard className="w-3 h-3 text-slate-400" />
                                  {participant.siswa?.nik || '-'}
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                                  <Phone className="w-3 h-3" />
                                  {participant.siswa?.telepon || '-'}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={`h-7 px-3 rounded-full text-[10px] font-bold uppercase tracking-tight flex items-center gap-1.5 transition-all shadow-sm ${styles.badge}`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
                                {participant.status || 'Pending'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end">
                                <Select
                                  value={participant.status || 'Pending'}
                                  onValueChange={(value) => handleUpdateStatus(participant.id, value, participant.keterangan || '')}
                                  disabled={isUpdatingPeserta}
                                >
                                  <SelectTrigger className="w-32 h-9 rounded-xl border-slate-200 bg-white shadow-sm hover:shadow-md transition-all font-bold text-[10px] uppercase tracking-tighter">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                                    <SelectItem value="Pending" className="text-[10px] font-bold uppercase">PENDING</SelectItem>
                                    <SelectItem value="Lulus" className="text-[10px] font-bold uppercase text-emerald-600">SET LULUS</SelectItem>
                                    <SelectItem value="Tidak Lulus" className="text-[10px] font-bold uppercase text-rose-600">SET GAGAL</SelectItem>
                                    <SelectItem value="Cadangan" className="text-[10px] font-bold uppercase text-amber-600">CADANGAN</SelectItem>
                                    <SelectItem value="Batal" className="text-[10px] font-bold uppercase text-slate-400">BATAL</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
                  <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-3xl flex items-center justify-center ring-1 ring-slate-100 shadow-inner rotate-3">
                    <Users className="w-12 h-12 -rotate-3" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-slate-900">
                      {statusFilter === 'all' 
                        ? 'Belum Ada Peserta Terdaftar'
                        : `Tidak Ada Peserta ${statusFilter}`
                      }
                    </h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider max-w-xs mx-auto leading-relaxed">
                      {statusFilter === 'all'
                        ? 'Pilih siswa di panel samping untuk memulai'
                        : `Ganti filter status untuk melihat data lain`
                      }
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 px-6 py-2 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300"
        >
          <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-widest">Kembali</span>
        </Button>
      </div>
    </div>
  );
}
