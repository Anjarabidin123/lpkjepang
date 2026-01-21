
export interface LpkMitra {
  id: string;
  kode: string;
  nama_lpk: string;
  pic_nama?: string;
  email?: string;
  phone?: string;
  alamat?: string;
  status?: 'Aktif' | 'Nonaktif';
  created_at?: string;
  updated_at?: string;
}

export interface CreateLpkMitraData {
  kode: string;
  nama_lpk: string;
  pic_nama?: string;
  email?: string;
  phone?: string;
  alamat?: string;
  status?: 'Aktif' | 'Nonaktif';
}

export interface UpdateLpkMitraData extends Partial<CreateLpkMitraData> {}
