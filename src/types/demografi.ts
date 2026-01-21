
export interface DemografiCountry {
  id: string;
  kode: string;
  nama: string;
  nama_lokal?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DemografiProvince {
  id: string;
  country_id: string;
  kode: string;
  nama: string;
  nama_lokal?: string | null;
  is_active?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
  country?: DemografiCountry;
}

export interface DemografiRegency {
  id: string;
  province_id: string;
  kode: string;
  nama: string;
  nama_lokal?: string | null;
  is_active?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
  province?: DemografiProvince;
}

export type CreateDemografiCountryData = Omit<DemografiCountry, 'id' | 'created_at' | 'updated_at'>;
export type UpdateDemografiCountryData = Partial<DemografiCountry> & { id: string };

export type CreateDemografiProvinceData = Omit<DemografiProvince, 'id' | 'created_at' | 'updated_at' | 'country'>;
export type UpdateDemografiProvinceData = Partial<DemografiProvince> & { id: string };

export type CreateDemografiRegencyData = Omit<DemografiRegency, 'id' | 'created_at' | 'updated_at' | 'province'>;
export type UpdateDemografiRegencyData = Partial<DemografiRegency> & { id: string };
