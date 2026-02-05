
export interface LpkMitra {
  id: string;
  kode: string;
  nama: string;
  pic_nama?: string;
  email?: string;
  phone?: string;
  alamat?: string;
  website?: string;
  logo_url?: string;
  status?: 'Aktif' | 'Nonaktif';
  created_at?: string;
  updated_at?: string;
}

export interface CreateLpkMitraData {
  kode: string;
  nama: string;
  pic_nama?: string;
  email?: string;
  phone?: string;
  alamat?: string;
  website?: string;
  logo_url?: string;
  status?: 'Aktif' | 'Nonaktif';
}

export interface UpdateLpkMitraData extends Partial<CreateLpkMitraData> { }
