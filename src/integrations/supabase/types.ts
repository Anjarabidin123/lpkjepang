export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      arus_kas: {
        Row: {
          created_at: string | null
          id: string
          jenis: string
          kategori: string
          keterangan: string | null
          nominal: number
          referensi_id: string | null
          referensi_tabel: string | null
          tanggal: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          jenis: string
          kategori: string
          keterangan?: string | null
          nominal: number
          referensi_id?: string | null
          referensi_tabel?: string | null
          tanggal?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          jenis?: string
          kategori?: string
          keterangan?: string | null
          nominal?: number
          referensi_id?: string | null
          referensi_tabel?: string | null
          tanggal?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      demografi_countries: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          kode: string
          nama: string
          nama_lokal: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          kode: string
          nama: string
          nama_lokal?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          kode?: string
          nama?: string
          nama_lokal?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      demografi_provinces: {
        Row: {
          country_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          kode: string
          nama: string
          nama_lokal: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          country_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          kode: string
          nama: string
          nama_lokal?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          country_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          kode?: string
          nama?: string
          nama_lokal?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demografi_provinces_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "demografi_countries"
            referencedColumns: ["id"]
          },
        ]
      }
      demografi_regencies: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          kode: string
          nama: string
          nama_lokal: string | null
          province_id: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          kode: string
          nama: string
          nama_lokal?: string | null
          province_id: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          kode?: string
          nama?: string
          nama_lokal?: string | null
          province_id?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demografi_regencies_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "demografi_provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      internal_payments: {
        Row: {
          created_at: string | null
          id: string
          item_pembayaran_id: string
          keterangan: string | null
          metode_pembayaran: string | null
          nominal: number
          siswa_id: string
          status: string | null
          tanggal_pembayaran: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_pembayaran_id: string
          keterangan?: string | null
          metode_pembayaran?: string | null
          nominal: number
          siswa_id: string
          status?: string | null
          tanggal_pembayaran?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_pembayaran_id?: string
          keterangan?: string | null
          metode_pembayaran?: string | null
          nominal?: number
          siswa_id?: string
          status?: string | null
          tanggal_pembayaran?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "internal_payments_item_pembayaran_id_fkey"
            columns: ["item_pembayaran_id"]
            isOneToOne: false
            referencedRelation: "item_pembayaran"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "internal_payments_siswa_id_fkey"
            columns: ["siswa_id"]
            isOneToOne: false
            referencedRelation: "siswa"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice: {
        Row: {
          created_at: string | null
          id: string
          keterangan: string | null
          kumiai_id: string
          nominal: number
          nomor_invoice: string
          status: Database["public"]["Enums"]["invoice_status"] | null
          tanggal_invoice: string
          tanggal_jatuh_tempo: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          keterangan?: string | null
          kumiai_id: string
          nominal: number
          nomor_invoice: string
          status?: Database["public"]["Enums"]["invoice_status"] | null
          tanggal_invoice?: string
          tanggal_jatuh_tempo?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          keterangan?: string | null
          kumiai_id?: string
          nominal?: number
          nomor_invoice?: string
          status?: Database["public"]["Enums"]["invoice_status"] | null
          tanggal_invoice?: string
          tanggal_jatuh_tempo?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_kumiai_id_fkey"
            columns: ["kumiai_id"]
            isOneToOne: false
            referencedRelation: "kumiai"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          created_at: string | null
          id: string
          invoice_id: string
          keterangan: string | null
          nominal_fee: number
          siswa_magang_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          invoice_id: string
          keterangan?: string | null
          nominal_fee: number
          siswa_magang_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          invoice_id?: string
          keterangan?: string | null
          nominal_fee?: number
          siswa_magang_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoice"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_siswa_magang_id_fkey"
            columns: ["siswa_magang_id"]
            isOneToOne: false
            referencedRelation: "siswa_magang"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_settings: {
        Row: {
          created_at: string
          id: string
          item_pembayaran: string
          kumiai_id: string
          nominal_base: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_pembayaran: string
          kumiai_id: string
          nominal_base?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          item_pembayaran?: string
          kumiai_id?: string
          nominal_base?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_settings_kumiai_id_fkey"
            columns: ["kumiai_id"]
            isOneToOne: false
            referencedRelation: "kumiai"
            referencedColumns: ["id"]
          },
        ]
      }
      item_pembayaran: {
        Row: {
          created_at: string | null
          deskripsi: string | null
          id: string
          is_active: boolean | null
          nama_item: string
          nominal_wajib: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deskripsi?: string | null
          id?: string
          is_active?: boolean | null
          nama_item: string
          nominal_wajib?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deskripsi?: string | null
          id?: string
          is_active?: boolean | null
          nama_item?: string
          nominal_wajib?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      jenis_kerja: {
        Row: {
          created_at: string | null
          deskripsi: string | null
          gaji_maksimal: number | null
          gaji_minimal: number | null
          id: string
          kategori: string | null
          kode: string
          nama: string
          syarat_pendidikan: string | null
          tingkat_kesulitan:
            | Database["public"]["Enums"]["tingkat_kesulitan"]
            | null
          total_posisi: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deskripsi?: string | null
          gaji_maksimal?: number | null
          gaji_minimal?: number | null
          id?: string
          kategori?: string | null
          kode: string
          nama: string
          syarat_pendidikan?: string | null
          tingkat_kesulitan?:
            | Database["public"]["Enums"]["tingkat_kesulitan"]
            | null
          total_posisi?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deskripsi?: string | null
          gaji_maksimal?: number | null
          gaji_minimal?: number | null
          id?: string
          kategori?: string | null
          kode?: string
          nama?: string
          syarat_pendidikan?: string | null
          tingkat_kesulitan?:
            | Database["public"]["Enums"]["tingkat_kesulitan"]
            | null
          total_posisi?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      job_order_peserta: {
        Row: {
          created_at: string
          id: string
          job_order_id: string
          keterangan: string | null
          siswa_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          job_order_id: string
          keterangan?: string | null
          siswa_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          job_order_id?: string
          keterangan?: string | null
          siswa_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_order_peserta_job_order_id_fkey"
            columns: ["job_order_id"]
            isOneToOne: false
            referencedRelation: "job_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_order_peserta_siswa_id_fkey"
            columns: ["siswa_id"]
            isOneToOne: false
            referencedRelation: "siswa"
            referencedColumns: ["id"]
          },
        ]
      }
      job_orders: {
        Row: {
          catatan: string | null
          created_at: string
          id: string
          jenis_kerja_id: string | null
          kumiai_id: string | null
          kuota: number | null
          nama_job_order: string
          updated_at: string
        }
        Insert: {
          catatan?: string | null
          created_at?: string
          id?: string
          jenis_kerja_id?: string | null
          kumiai_id?: string | null
          kuota?: number | null
          nama_job_order: string
          updated_at?: string
        }
        Update: {
          catatan?: string | null
          created_at?: string
          id?: string
          jenis_kerja_id?: string | null
          kumiai_id?: string | null
          kuota?: number | null
          nama_job_order?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_job_orders_jenis_kerja"
            columns: ["jenis_kerja_id"]
            isOneToOne: false
            referencedRelation: "jenis_kerja"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_job_orders_kumiai"
            columns: ["kumiai_id"]
            isOneToOne: false
            referencedRelation: "kumiai"
            referencedColumns: ["id"]
          },
        ]
      }
      kategori_pemasukan: {
        Row: {
          created_at: string | null
          deskripsi: string | null
          id: string
          is_active: boolean | null
          nama_kategori: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deskripsi?: string | null
          id?: string
          is_active?: boolean | null
          nama_kategori: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deskripsi?: string | null
          id?: string
          is_active?: boolean | null
          nama_kategori?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      kategori_pengeluaran: {
        Row: {
          created_at: string | null
          deskripsi: string | null
          id: string
          is_active: boolean | null
          nama_kategori: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deskripsi?: string | null
          id?: string
          is_active?: boolean | null
          nama_kategori: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deskripsi?: string | null
          id?: string
          is_active?: boolean | null
          nama_kategori?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      kewajiban_pembayaran: {
        Row: {
          created_at: string | null
          id: string
          item_pembayaran_id: string
          nominal_terbayar: number
          nominal_wajib: number
          sisa_kewajiban: number
          siswa_id: string
          status_lunas: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_pembayaran_id: string
          nominal_terbayar?: number
          nominal_wajib?: number
          sisa_kewajiban?: number
          siswa_id: string
          status_lunas?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_pembayaran_id?: string
          nominal_terbayar?: number
          nominal_wajib?: number
          sisa_kewajiban?: number
          siswa_id?: string
          status_lunas?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kewajiban_pembayaran_item_pembayaran_id_fkey"
            columns: ["item_pembayaran_id"]
            isOneToOne: false
            referencedRelation: "item_pembayaran"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kewajiban_pembayaran_siswa_id_fkey"
            columns: ["siswa_id"]
            isOneToOne: false
            referencedRelation: "siswa"
            referencedColumns: ["id"]
          },
        ]
      }
      kumiai: {
        Row: {
          alamat: string | null
          created_at: string | null
          email: string | null
          id: string
          jumlah_perusahaan: number | null
          kode: string
          nama: string
          pic_nama: string | null
          pic_telepon: string | null
          tanggal_kerjasama: string | null
          telepon: string | null
          updated_at: string | null
        }
        Insert: {
          alamat?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          jumlah_perusahaan?: number | null
          kode: string
          nama: string
          pic_nama?: string | null
          pic_telepon?: string | null
          tanggal_kerjasama?: string | null
          telepon?: string | null
          updated_at?: string | null
        }
        Update: {
          alamat?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          jumlah_perusahaan?: number | null
          kode?: string
          nama?: string
          pic_nama?: string | null
          pic_telepon?: string | null
          tanggal_kerjasama?: string | null
          telepon?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      lpk_mitra: {
        Row: {
          alamat: string | null
          created_at: string | null
          email: string | null
          id: string
          kode: string
          nama_lpk: string
          phone: string | null
          pic_nama: string | null
          updated_at: string | null
        }
        Insert: {
          alamat?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          kode: string
          nama_lpk: string
          phone?: string | null
          pic_nama?: string | null
          updated_at?: string | null
        }
        Update: {
          alamat?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          kode?: string
          nama_lpk?: string
          phone?: string | null
          pic_nama?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      pemasukan: {
        Row: {
          created_at: string | null
          id: string
          kategori_id: string | null
          keterangan: string | null
          nama_pemasukan: string
          nominal: number
          tanggal_pemasukan: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          kategori_id?: string | null
          keterangan?: string | null
          nama_pemasukan: string
          nominal: number
          tanggal_pemasukan?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          kategori_id?: string | null
          keterangan?: string | null
          nama_pemasukan?: string
          nominal?: number
          tanggal_pemasukan?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pemasukan_kategori_id_fkey"
            columns: ["kategori_id"]
            isOneToOne: false
            referencedRelation: "kategori_pemasukan"
            referencedColumns: ["id"]
          },
        ]
      }
      pembayaran: {
        Row: {
          created_at: string | null
          id: string
          item_pembayaran_id: string | null
          keterangan: string | null
          metode_pembayaran: string | null
          nominal: number
          siswa_id: string
          status: string | null
          tanggal_pembayaran: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_pembayaran_id?: string | null
          keterangan?: string | null
          metode_pembayaran?: string | null
          nominal: number
          siswa_id: string
          status?: string | null
          tanggal_pembayaran?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_pembayaran_id?: string | null
          keterangan?: string | null
          metode_pembayaran?: string | null
          nominal?: number
          siswa_id?: string
          status?: string | null
          tanggal_pembayaran?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pembayaran_item_pembayaran_id_fkey"
            columns: ["item_pembayaran_id"]
            isOneToOne: false
            referencedRelation: "item_pembayaran"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pembayaran_siswa_id_fkey"
            columns: ["siswa_id"]
            isOneToOne: false
            referencedRelation: "siswa"
            referencedColumns: ["id"]
          },
        ]
      }
      pengeluaran: {
        Row: {
          created_at: string | null
          id: string
          kategori_id: string | null
          keterangan: string | null
          nama_pengeluaran: string
          nominal: number
          tanggal_pengeluaran: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          kategori_id?: string | null
          keterangan?: string | null
          nama_pengeluaran: string
          nominal: number
          tanggal_pengeluaran?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          kategori_id?: string | null
          keterangan?: string | null
          nama_pengeluaran?: string
          nominal?: number
          tanggal_pengeluaran?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pengeluaran_kategori_id_fkey"
            columns: ["kategori_id"]
            isOneToOne: false
            referencedRelation: "kategori_pengeluaran"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          action: string
          created_at: string | null
          description: string | null
          display_name: string
          id: string
          is_active: boolean | null
          module: string
          name: string
          updated_at: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          description?: string | null
          display_name: string
          id?: string
          is_active?: boolean | null
          module: string
          name: string
          updated_at?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          description?: string | null
          display_name?: string
          id?: string
          is_active?: boolean | null
          module?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      perusahaan: {
        Row: {
          alamat: string | null
          bidang_usaha: string | null
          created_at: string | null
          email: string | null
          id: string
          kapasitas: number | null
          kode: string
          kumiai_id: string | null
          nama: string
          tanggal_kerjasama: string | null
          telepon: string | null
          updated_at: string | null
        }
        Insert: {
          alamat?: string | null
          bidang_usaha?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          kapasitas?: number | null
          kode: string
          kumiai_id?: string | null
          nama: string
          tanggal_kerjasama?: string | null
          telepon?: string | null
          updated_at?: string | null
        }
        Update: {
          alamat?: string | null
          bidang_usaha?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          kapasitas?: number | null
          kode?: string
          kumiai_id?: string | null
          nama?: string
          tanggal_kerjasama?: string | null
          telepon?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "perusahaan_kumiai_id_fkey"
            columns: ["kumiai_id"]
            isOneToOne: false
            referencedRelation: "kumiai"
            referencedColumns: ["id"]
          },
        ]
      }
      posisi_kerja: {
        Row: {
          created_at: string | null
          gaji_harian: number | null
          id: string
          jam_kerja: string | null
          jenis_kerja_id: string | null
          kode: string
          kuota: number | null
          lokasi: string | null
          persyaratan: string | null
          perusahaan_id: string | null
          posisi: string
          status: Database["public"]["Enums"]["status_posisi"] | null
          tanggal_buka: string | null
          tanggal_tutup: string | null
          terisi: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          gaji_harian?: number | null
          id?: string
          jam_kerja?: string | null
          jenis_kerja_id?: string | null
          kode: string
          kuota?: number | null
          lokasi?: string | null
          persyaratan?: string | null
          perusahaan_id?: string | null
          posisi: string
          status?: Database["public"]["Enums"]["status_posisi"] | null
          tanggal_buka?: string | null
          tanggal_tutup?: string | null
          terisi?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          gaji_harian?: number | null
          id?: string
          jam_kerja?: string | null
          jenis_kerja_id?: string | null
          kode?: string
          kuota?: number | null
          lokasi?: string | null
          persyaratan?: string | null
          perusahaan_id?: string | null
          posisi?: string
          status?: Database["public"]["Enums"]["status_posisi"] | null
          tanggal_buka?: string | null
          tanggal_tutup?: string | null
          terisi?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posisi_kerja_jenis_kerja_id_fkey"
            columns: ["jenis_kerja_id"]
            isOneToOne: false
            referencedRelation: "jenis_kerja"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posisi_kerja_perusahaan_id_fkey"
            columns: ["perusahaan_id"]
            isOneToOne: false
            referencedRelation: "perusahaan"
            referencedColumns: ["id"]
          },
        ]
      }
      profil_lpk: {
        Row: {
          alamat: string | null
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          nama: string
          no_telp: string | null
          pemilik: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          alamat?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          nama: string
          no_telp?: string | null
          pemilik?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          alamat?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          nama?: string
          no_telp?: string | null
          pemilik?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      program: {
        Row: {
          biaya: number | null
          created_at: string | null
          deskripsi: string | null
          durasi: number | null
          id: string
          kode: string
          kuota: number | null
          nama: string
          peserta_terdaftar: number | null
          satuan_durasi: string | null
          tanggal_mulai: string | null
          tanggal_selesai: string | null
          updated_at: string | null
        }
        Insert: {
          biaya?: number | null
          created_at?: string | null
          deskripsi?: string | null
          durasi?: number | null
          id?: string
          kode: string
          kuota?: number | null
          nama: string
          peserta_terdaftar?: number | null
          satuan_durasi?: string | null
          tanggal_mulai?: string | null
          tanggal_selesai?: string | null
          updated_at?: string | null
        }
        Update: {
          biaya?: number | null
          created_at?: string | null
          deskripsi?: string | null
          durasi?: number | null
          id?: string
          kode?: string
          kuota?: number | null
          nama?: string
          peserta_terdaftar?: number | null
          satuan_durasi?: string | null
          tanggal_mulai?: string | null
          tanggal_selesai?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          display_name: string
          id: string
          is_active: boolean | null
          is_system_role: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_name: string
          id?: string
          is_active?: boolean | null
          is_system_role?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_name?: string
          id?: string
          is_active?: boolean | null
          is_system_role?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      siswa: {
        Row: {
          agama: string | null
          alamat: string | null
          bakat_khusus: string | null
          berat_badan: number | null
          buta_warna: boolean | null
          catatan: string | null
          created_at: string | null
          demografi_province_id: string | null
          demografi_regency_id: string | null
          email: string | null
          foto_siswa: string | null
          foto_url: string | null
          golongan_darah: string | null
          hobi: string | null
          id: string
          is_available: boolean | null
          jenis_kelamin: Database["public"]["Enums"]["jenis_kelamin"] | null
          jurusan: string | null
          kekurangan: string | null
          kelebihan: string | null
          lama_belajar: string | null
          lpk_mitra_id: string | null
          mata_kanan: string | null
          mata_kiri: string | null
          merokok_jepang: string | null
          merokok_sekarang: string | null
          minat: string | null
          minum_sake: string | null
          nama: string
          nama_sekolah: string | null
          nik: string
          pengalaman: string | null
          pengalaman_jepang: string | null
          penggunaan_tangan: string | null
          posisi_kerja_id: string | null
          program_id: string | null
          skill_bahasa_jepang: string | null
          status: Database["public"]["Enums"]["status_siswa"] | null
          status_pernikahan: string | null
          tahun_lulus_sekolah: number | null
          tahun_masuk_sekolah: number | null
          tanggal_daftar: string | null
          tanggal_lahir: string | null
          tanggal_masuk_lpk: string | null
          target_gaji: string | null
          target_menabung: string | null
          telepon: string | null
          tempat_lahir: string | null
          tinggi_badan: number | null
          tujuan_jepang: string | null
          ukuran_kepala: number | null
          ukuran_pinggang: number | null
          ukuran_sepatu: number | null
          umur: number | null
          updated_at: string | null
          visi: string | null
          warna_buta: string | null
        }
        Insert: {
          agama?: string | null
          alamat?: string | null
          bakat_khusus?: string | null
          berat_badan?: number | null
          buta_warna?: boolean | null
          catatan?: string | null
          created_at?: string | null
          demografi_province_id?: string | null
          demografi_regency_id?: string | null
          email?: string | null
          foto_siswa?: string | null
          foto_url?: string | null
          golongan_darah?: string | null
          hobi?: string | null
          id?: string
          is_available?: boolean | null
          jenis_kelamin?: Database["public"]["Enums"]["jenis_kelamin"] | null
          jurusan?: string | null
          kekurangan?: string | null
          kelebihan?: string | null
          lama_belajar?: string | null
          lpk_mitra_id?: string | null
          mata_kanan?: string | null
          mata_kiri?: string | null
          merokok_jepang?: string | null
          merokok_sekarang?: string | null
          minat?: string | null
          minum_sake?: string | null
          nama: string
          nama_sekolah?: string | null
          nik: string
          pengalaman?: string | null
          pengalaman_jepang?: string | null
          penggunaan_tangan?: string | null
          posisi_kerja_id?: string | null
          program_id?: string | null
          skill_bahasa_jepang?: string | null
          status?: Database["public"]["Enums"]["status_siswa"] | null
          status_pernikahan?: string | null
          tahun_lulus_sekolah?: number | null
          tahun_masuk_sekolah?: number | null
          tanggal_daftar?: string | null
          tanggal_lahir?: string | null
          tanggal_masuk_lpk?: string | null
          target_gaji?: string | null
          target_menabung?: string | null
          telepon?: string | null
          tempat_lahir?: string | null
          tinggi_badan?: number | null
          tujuan_jepang?: string | null
          ukuran_kepala?: number | null
          ukuran_pinggang?: number | null
          ukuran_sepatu?: number | null
          umur?: number | null
          updated_at?: string | null
          visi?: string | null
          warna_buta?: string | null
        }
        Update: {
          agama?: string | null
          alamat?: string | null
          bakat_khusus?: string | null
          berat_badan?: number | null
          buta_warna?: boolean | null
          catatan?: string | null
          created_at?: string | null
          demografi_province_id?: string | null
          demografi_regency_id?: string | null
          email?: string | null
          foto_siswa?: string | null
          foto_url?: string | null
          golongan_darah?: string | null
          hobi?: string | null
          id?: string
          is_available?: boolean | null
          jenis_kelamin?: Database["public"]["Enums"]["jenis_kelamin"] | null
          jurusan?: string | null
          kekurangan?: string | null
          kelebihan?: string | null
          lama_belajar?: string | null
          lpk_mitra_id?: string | null
          mata_kanan?: string | null
          mata_kiri?: string | null
          merokok_jepang?: string | null
          merokok_sekarang?: string | null
          minat?: string | null
          minum_sake?: string | null
          nama?: string
          nama_sekolah?: string | null
          nik?: string
          pengalaman?: string | null
          pengalaman_jepang?: string | null
          penggunaan_tangan?: string | null
          posisi_kerja_id?: string | null
          program_id?: string | null
          skill_bahasa_jepang?: string | null
          status?: Database["public"]["Enums"]["status_siswa"] | null
          status_pernikahan?: string | null
          tahun_lulus_sekolah?: number | null
          tahun_masuk_sekolah?: number | null
          tanggal_daftar?: string | null
          tanggal_lahir?: string | null
          tanggal_masuk_lpk?: string | null
          target_gaji?: string | null
          target_menabung?: string | null
          telepon?: string | null
          tempat_lahir?: string | null
          tinggi_badan?: number | null
          tujuan_jepang?: string | null
          ukuran_kepala?: number | null
          ukuran_pinggang?: number | null
          ukuran_sepatu?: number | null
          umur?: number | null
          updated_at?: string | null
          visi?: string | null
          warna_buta?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "siswa_demografi_province_id_fkey"
            columns: ["demografi_province_id"]
            isOneToOne: false
            referencedRelation: "demografi_provinces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "siswa_demografi_regency_id_fkey"
            columns: ["demografi_regency_id"]
            isOneToOne: false
            referencedRelation: "demografi_regencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "siswa_lpk_mitra_id_fkey"
            columns: ["lpk_mitra_id"]
            isOneToOne: false
            referencedRelation: "lpk_mitra"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "siswa_posisi_kerja_id_fkey"
            columns: ["posisi_kerja_id"]
            isOneToOne: false
            referencedRelation: "posisi_kerja"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "siswa_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "program"
            referencedColumns: ["id"]
          },
        ]
      }
      siswa_keluarga_indonesia: {
        Row: {
          created_at: string
          hubungan: Database["public"]["Enums"]["hubungan_keluarga"] | null
          id: string
          nama: string
          pekerjaan: string | null
          siswa_id: string
          umur: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          hubungan?: Database["public"]["Enums"]["hubungan_keluarga"] | null
          id?: string
          nama: string
          pekerjaan?: string | null
          siswa_id: string
          umur?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          hubungan?: Database["public"]["Enums"]["hubungan_keluarga"] | null
          id?: string
          nama?: string
          pekerjaan?: string | null
          siswa_id?: string
          umur?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "siswa_keluarga_indonesia_siswa_id_fkey"
            columns: ["siswa_id"]
            isOneToOne: false
            referencedRelation: "siswa"
            referencedColumns: ["id"]
          },
        ]
      }
      siswa_keluarga_jepang: {
        Row: {
          created_at: string
          hubungan: Database["public"]["Enums"]["hubungan_keluarga"] | null
          id: string
          nama: string
          pekerjaan: string | null
          siswa_id: string
          umur: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          hubungan?: Database["public"]["Enums"]["hubungan_keluarga"] | null
          id?: string
          nama: string
          pekerjaan?: string | null
          siswa_id: string
          umur?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          hubungan?: Database["public"]["Enums"]["hubungan_keluarga"] | null
          id?: string
          nama?: string
          pekerjaan?: string | null
          siswa_id?: string
          umur?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "siswa_keluarga_jepang_siswa_id_fkey"
            columns: ["siswa_id"]
            isOneToOne: false
            referencedRelation: "siswa"
            referencedColumns: ["id"]
          },
        ]
      }
      siswa_kontak_keluarga: {
        Row: {
          alamat: string | null
          created_at: string
          id: string
          kab_kota: string | null
          kecamatan: string | null
          kelurahan: string | null
          kode_pos: string | null
          nama: string
          no_hp: string | null
          penghasilan_per_bulan: number | null
          provinsi: string | null
          rt_rw: string | null
          siswa_id: string
          updated_at: string
        }
        Insert: {
          alamat?: string | null
          created_at?: string
          id?: string
          kab_kota?: string | null
          kecamatan?: string | null
          kelurahan?: string | null
          kode_pos?: string | null
          nama: string
          no_hp?: string | null
          penghasilan_per_bulan?: number | null
          provinsi?: string | null
          rt_rw?: string | null
          siswa_id: string
          updated_at?: string
        }
        Update: {
          alamat?: string | null
          created_at?: string
          id?: string
          kab_kota?: string | null
          kecamatan?: string | null
          kelurahan?: string | null
          kode_pos?: string | null
          nama?: string
          no_hp?: string | null
          penghasilan_per_bulan?: number | null
          provinsi?: string | null
          rt_rw?: string | null
          siswa_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "siswa_kontak_keluarga_siswa_id_fkey"
            columns: ["siswa_id"]
            isOneToOne: false
            referencedRelation: "siswa"
            referencedColumns: ["id"]
          },
        ]
      }
      siswa_magang: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          demografi_province_id: string | null
          demografi_regency_id: string | null
          gaji: number | null
          id: string
          jenis_kerja_id: string | null
          kumiai_id: string | null
          lokasi: string | null
          lpk_mitra_id: string | null
          perusahaan_id: string | null
          posisi_kerja_id: string | null
          program_id: string | null
          siswa_id: string | null
          status_magang: string | null
          tanggal_mulai_kerja: string | null
          tanggal_pulang_kerja: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          demografi_province_id?: string | null
          demografi_regency_id?: string | null
          gaji?: number | null
          id?: string
          jenis_kerja_id?: string | null
          kumiai_id?: string | null
          lokasi?: string | null
          lpk_mitra_id?: string | null
          perusahaan_id?: string | null
          posisi_kerja_id?: string | null
          program_id?: string | null
          siswa_id?: string | null
          status_magang?: string | null
          tanggal_mulai_kerja?: string | null
          tanggal_pulang_kerja?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          demografi_province_id?: string | null
          demografi_regency_id?: string | null
          gaji?: number | null
          id?: string
          jenis_kerja_id?: string | null
          kumiai_id?: string | null
          lokasi?: string | null
          lpk_mitra_id?: string | null
          perusahaan_id?: string | null
          posisi_kerja_id?: string | null
          program_id?: string | null
          siswa_id?: string | null
          status_magang?: string | null
          tanggal_mulai_kerja?: string | null
          tanggal_pulang_kerja?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "siswa_magang_demografi_province_id_fkey"
            columns: ["demografi_province_id"]
            isOneToOne: false
            referencedRelation: "demografi_provinces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "siswa_magang_demografi_regency_id_fkey"
            columns: ["demografi_regency_id"]
            isOneToOne: false
            referencedRelation: "demografi_regencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "siswa_magang_jenis_kerja_id_fkey"
            columns: ["jenis_kerja_id"]
            isOneToOne: false
            referencedRelation: "jenis_kerja"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "siswa_magang_kumiai_id_fkey"
            columns: ["kumiai_id"]
            isOneToOne: false
            referencedRelation: "kumiai"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "siswa_magang_lpk_mitra_id_fkey"
            columns: ["lpk_mitra_id"]
            isOneToOne: false
            referencedRelation: "lpk_mitra"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "siswa_magang_perusahaan_id_fkey"
            columns: ["perusahaan_id"]
            isOneToOne: false
            referencedRelation: "perusahaan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "siswa_magang_posisi_kerja_id_fkey"
            columns: ["posisi_kerja_id"]
            isOneToOne: false
            referencedRelation: "posisi_kerja"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "siswa_magang_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "program"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "siswa_magang_siswa_id_fkey"
            columns: ["siswa_id"]
            isOneToOne: false
            referencedRelation: "siswa"
            referencedColumns: ["id"]
          },
        ]
      }
      siswa_pendidikan: {
        Row: {
          created_at: string
          id: string
          jenjang_pendidikan: string
          jurusan: string | null
          nama_institusi: string
          nilai_akhir: string | null
          sertifikat_url: string | null
          siswa_id: string
          tahun_lulus: number | null
          tahun_masuk: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          jenjang_pendidikan: string
          jurusan?: string | null
          nama_institusi: string
          nilai_akhir?: string | null
          sertifikat_url?: string | null
          siswa_id: string
          tahun_lulus?: number | null
          tahun_masuk?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          jenjang_pendidikan?: string
          jurusan?: string | null
          nama_institusi?: string
          nilai_akhir?: string | null
          sertifikat_url?: string | null
          siswa_id?: string
          tahun_lulus?: number | null
          tahun_masuk?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "siswa_pendidikan_siswa_id_fkey"
            columns: ["siswa_id"]
            isOneToOne: false
            referencedRelation: "siswa"
            referencedColumns: ["id"]
          },
        ]
      }
      siswa_pengalaman_kerja: {
        Row: {
          created_at: string
          id: string
          jenis_pekerjaan: string | null
          nama_perusahaan: string
          siswa_id: string
          tahun_keluar: number | null
          tahun_masuk: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          jenis_pekerjaan?: string | null
          nama_perusahaan: string
          siswa_id: string
          tahun_keluar?: number | null
          tahun_masuk?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          jenis_pekerjaan?: string | null
          nama_perusahaan?: string
          siswa_id?: string
          tahun_keluar?: number | null
          tahun_masuk?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "siswa_pengalaman_kerja_siswa_id_fkey"
            columns: ["siswa_id"]
            isOneToOne: false
            referencedRelation: "siswa"
            referencedColumns: ["id"]
          },
        ]
      }
      user_role_assignments: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          is_active: boolean | null
          role_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          is_active?: boolean | null
          role_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          is_active?: boolean | null
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_role_assignments_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_invoice_total: {
        Args: { invoice_uuid: string }
        Returns: number
      }
      create_user_with_role: {
        Args: {
          _user_id: string
          _email: string
          _full_name: string
          _phone: string
          _role: Database["public"]["Enums"]["app_role"]
          _is_active?: boolean
        }
        Returns: boolean
      }
      get_demografi_countries: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          kode: string
          nama: string
          nama_lokal: string
          is_active: boolean
          created_at: string
          updated_at: string
        }[]
      }
      get_provinces_by_country: {
        Args: { country_code?: string }
        Returns: {
          id: string
          country_id: string
          kode: string
          nama: string
          nama_lokal: string
          sort_order: number
        }[]
      }
      get_regencies_by_province: {
        Args: { province_id_param: string }
        Returns: {
          id: string
          province_id: string
          kode: string
          nama: string
          nama_lokal: string
          sort_order: number
        }[]
      }
      get_user_permissions: {
        Args: { _user_id: string }
        Returns: {
          permission_name: string
          display_name: string
          module: string
          action: string
        }[]
      }
      get_user_with_roles: {
        Args: { _user_id: string }
        Returns: {
          id: string
          email: string
          full_name: string
          phone: string
          avatar_url: string
          is_active: boolean
          created_at: string
          updated_at: string
          roles: Json
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      user_has_permission: {
        Args: { _user_id: string; _permission_name: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "rekrutment"
      hubungan_keluarga:
        | "Ayah"
        | "Ibu"
        | "Suami"
        | "Istri"
        | "Anak"
        | "Kakak"
        | "Adik"
        | "Kakek"
        | "Nenek"
        | "Paman"
        | "Bibi"
        | "Sepupu"
        | "Keponakan"
        | "Lainnya"
      invoice_status:
        | "Draft"
        | "Terkirim"
        | "Dibayar Lunas"
        | "Belum Dibayar"
        | "Dibayar Sebagian"
        | "Pending"
      jenis_kelamin: "Laki-laki" | "Perempuan"
      status_posisi: "Buka" | "Penuh" | "Tutup"
      status_siswa: "Aktif" | "Diterima" | "Proses" | "Ditolak"
      tingkat_kesulitan: "Rendah" | "Menengah" | "Tinggi"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user", "rekrutment"],
      hubungan_keluarga: [
        "Ayah",
        "Ibu",
        "Suami",
        "Istri",
        "Anak",
        "Kakak",
        "Adik",
        "Kakek",
        "Nenek",
        "Paman",
        "Bibi",
        "Sepupu",
        "Keponakan",
        "Lainnya",
      ],
      invoice_status: [
        "Draft",
        "Terkirim",
        "Dibayar Lunas",
        "Belum Dibayar",
        "Dibayar Sebagian",
        "Pending",
      ],
      jenis_kelamin: ["Laki-laki", "Perempuan"],
      status_posisi: ["Buka", "Penuh", "Tutup"],
      status_siswa: ["Aktif", "Diterima", "Proses", "Ditolak"],
      tingkat_kesulitan: ["Rendah", "Menengah", "Tinggi"],
    },
  },
} as const
