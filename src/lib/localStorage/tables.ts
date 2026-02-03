// localStorage table definitions for local caching and offline capabilities

import {
  generateId,
  getFromStorage,
  setToStorage,
  addToStorage,
  updateInStorage,
  deleteFromStorage,
  findInStorage,
  notifyStorageChange
} from './core';

// Table keys
export const TABLES = {
  SISWA: 'siswa',
  SISWA_MAGANG: 'siswa_magang',
  JOB_ORDER: 'job_order',
  PROGRAM: 'program',
  LPK_MITRA: 'lpk_mitra',
  PERUSAHAAN: 'perusahaan',
  KUMIAI: 'kumiai',
  JENIS_KERJA: 'jenis_kerja',
  POSISI_KERJA: 'posisi_kerja',
  DEMOGRAFI_PROVINCES: 'demografi_provinces',
  DEMOGRAFI_REGENCIES: 'demografi_regencies',
  DEMOGRAFI_COUNTRIES: 'demografi_countries',
  PROFILES: 'profiles',
  USER_ROLES: 'user_roles',
  PEMASUKAN: 'pemasukan',
  PENGELUARAN: 'pengeluaran',
  KATEGORI_PEMASUKAN: 'kategori_pemasukan',
  KATEGORI_PENGELUARAN: 'kategori_pengeluaran',
  ITEM_PEMBAYARAN: 'item_pembayaran',
  PEMBAYARAN: 'pembayaran',
  INVOICE: 'invoice',
  INVOICE_ITEMS: 'invoice_items',
  ARUS_KAS: 'arus_kas',
  JOURNAL: 'journal',
  KEWAJIBAN_PEMBAYARAN: 'kewajiban_pembayaran',
  INTERNAL_PAYMENT: 'internal_payment',
  PROFIL_LPK: 'profil_lpk',
  INVOICE_SETTINGS: 'invoice_settings',
  SISWA_PENDIDIKAN: 'siswa_pendidikan',
  SISWA_KELUARGA_INDONESIA: 'siswa_keluarga_indonesia',
  SISWA_KELUARGA_JEPANG: 'siswa_keluarga_jepang',
  SISWA_KONTAK_KELUARGA: 'siswa_kontak_keluarga',
  SISWA_PENGALAMAN_KERJA: 'siswa_pengalaman_kerja',
  JOB_ORDER_PESERTA: 'job_order_peserta',
  RBAC_PERMISSIONS: 'rbac_permissions',
  RBAC_ROLES: 'rbac_roles',
  RBAC_ROLE_PERMISSIONS: 'rbac_role_permissions',
  TASKS: 'tasks',
  DOCUMENT_TEMPLATES: 'document_templates',
  DOCUMENT_VARIABLES: 'document_variables',
  SISWA_DOCUMENTS: 'siswa_documents',
} as const;

// Generic CRUD operations
export function createLocalStorageTable<T extends Record<string, any>>(tableName: string) {
  return {
    getAll: (): (T & { id: string })[] => getFromStorage<T & { id: string }>(tableName),

    getById: (id: string): (T & { id: string }) | null => findInStorage<T & { id: string }>(tableName, id),

    getOneByField: (field: keyof T, value: any): (T & { id: string }) | null => {
      const items = getFromStorage<T & { id: string }>(tableName);
      return items.find(item => item[field as string] === value) || null;
    },

    count: (): number => {
      return getFromStorage(tableName).length;
    },

    create: (data: Omit<T, 'id' | 'created_at' | 'updated_at'>): T & { id: string } => {
      const newItem = addToStorage<T & { id: string }>(tableName, {
        ...data,
        id: (data as any).id || generateId(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as unknown as T & { id: string });
      notifyStorageChange(tableName, newItem);
      return newItem;
    },

    update: (id: string, updates: Partial<T>): (T & { id: string }) | null => {
      const updated = updateInStorage<T & { id: string }>(tableName, id, updates as Partial<T & { id: string }>);
      if (updated) {
        notifyStorageChange(tableName, updated);
      }
      return updated;
    },

    delete: (id: string): boolean => {
      const result = deleteFromStorage<T & { id: string }>(tableName, id);
      if (result) {
        notifyStorageChange(tableName, { deleted: id });
      }
      return result;
    },

    query: (filter: (item: T) => boolean): T[] => {
      const items = getFromStorage<T>(tableName);
      return items.filter(filter);
    },

    setAll: (data: T[]): void => {
      setToStorage(tableName, data);
      notifyStorageChange(tableName, data);
    },
  };
}

// Pre-configured tables
export const siswaTable = createLocalStorageTable(TABLES.SISWA);
export const siswaMagangTable = createLocalStorageTable(TABLES.SISWA_MAGANG);
export const jobOrderTable = createLocalStorageTable(TABLES.JOB_ORDER);
export const programTable = createLocalStorageTable(TABLES.PROGRAM);
export const lpkMitraTable = createLocalStorageTable(TABLES.LPK_MITRA);
export const perusahaanTable = createLocalStorageTable(TABLES.PERUSAHAAN);
export const kumiaiTable = createLocalStorageTable(TABLES.KUMIAI);
export const jenisKerjaTable = createLocalStorageTable(TABLES.JENIS_KERJA);
export const posisiKerjaTable = createLocalStorageTable(TABLES.POSISI_KERJA);
export const demografiProvincesTable = createLocalStorageTable(TABLES.DEMOGRAFI_PROVINCES);
export const demografiRegenciesTable = createLocalStorageTable(TABLES.DEMOGRAFI_REGENCIES);
export const demografiCountriesTable = createLocalStorageTable(TABLES.DEMOGRAFI_COUNTRIES);
export const profilesTable = createLocalStorageTable(TABLES.PROFILES);
export const userRolesTable = createLocalStorageTable(TABLES.USER_ROLES);
export const pemasukanTable = createLocalStorageTable(TABLES.PEMASUKAN);
export const pengeluaranTable = createLocalStorageTable(TABLES.PENGELUARAN);
export const kategoriPemasukanTable = createLocalStorageTable(TABLES.KATEGORI_PEMASUKAN);
export const kategoriPengeluaranTable = createLocalStorageTable(TABLES.KATEGORI_PENGELUARAN);
export const itemPembayaranTable = createLocalStorageTable(TABLES.ITEM_PEMBAYARAN);
export const pembayaranTable = createLocalStorageTable(TABLES.PEMBAYARAN);
export const invoiceTable = createLocalStorageTable(TABLES.INVOICE);
export const invoiceItemsTable = createLocalStorageTable(TABLES.INVOICE_ITEMS);
export const arusKasTable = createLocalStorageTable(TABLES.ARUS_KAS);
export const journalTable = createLocalStorageTable(TABLES.JOURNAL);
export const kewajibanPembayaranTable = createLocalStorageTable(TABLES.KEWAJIBAN_PEMBAYARAN);
export const internalPaymentTable = createLocalStorageTable(TABLES.INTERNAL_PAYMENT);
export const profilLpkTable = createLocalStorageTable(TABLES.PROFIL_LPK);
export const invoiceSettingsTable = createLocalStorageTable(TABLES.INVOICE_SETTINGS);
export const siswaPendidikanTable = createLocalStorageTable(TABLES.SISWA_PENDIDIKAN);
export const siswaKeluargaIndonesiaTable = createLocalStorageTable(TABLES.SISWA_KELUARGA_INDONESIA);
export const siswaKeluargaJepangTable = createLocalStorageTable(TABLES.SISWA_KELUARGA_JEPANG);
export const siswaKontakKeluargaTable = createLocalStorageTable(TABLES.SISWA_KONTAK_KELUARGA);
export const siswaPengalamanKerjaTable = createLocalStorageTable(TABLES.SISWA_PENGALAMAN_KERJA);
export const jobOrderPesertaTable = createLocalStorageTable(TABLES.JOB_ORDER_PESERTA);
export const rbacPermissionsTable = createLocalStorageTable(TABLES.RBAC_PERMISSIONS);
export const rbacRolesTable = createLocalStorageTable(TABLES.RBAC_ROLES);
export const rbacRolePermissionsTable = createLocalStorageTable(TABLES.RBAC_ROLE_PERMISSIONS);
export const tasksTable = createLocalStorageTable(TABLES.TASKS);
export const documentTemplatesTable = createLocalStorageTable(TABLES.DOCUMENT_TEMPLATES);
export const documentVariablesTable = createLocalStorageTable(TABLES.DOCUMENT_VARIABLES);
export const siswaDocumentsTable = createLocalStorageTable(TABLES.SISWA_DOCUMENTS);
