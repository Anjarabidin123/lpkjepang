# Panduan Deploy ke Railway dengan PostgreSQL

Berikut adalah langkah-langkah untuk mendeploy aplikasi ini ke **Railway** dan menggunakan database **PostgreSQL**.

## 1. Persiapan Repository
Pastikan semua perubahan kode sudah di-commit dan di-push ke GitHub repository Anda.
File `nixpacks.toml` yang baru saja dibuat sangat penting karena mengatur cara Railway membangun aplikasi (gabungan Node.js frontend + PHP Laravel backend).

## 2. Setup di Railway
1.  Buka [Railway.app](https://railway.app/) dan login.
2.  Klik **+ New Project** -> **Deploy from GitHub repo**.
3.  Pilih repository project ini.
4.  Klik **Deploy Now**.
    *   *Catatan: Deploy pertama mungkin gagal karena database belum disetting. Abaikan dulu.*

## 3. Tambahkan Database PostgreSQL
1.  Di dashboard project Railway Anda, klik tombol **+ New** (atau klik kanan di area kosong).
2.  Pilih **Database** -> **PostgreSQL**.
3.  Tunggu hingga database selesai dibuat (status hijau).

## 4. Konfigurasi Environment Variables (PENTING)
1.  Klik pada card service aplikasi (bukan database).
2.  Pergi ke tab **Variables**.
3.  Tambahkan variabel berikut:

    | Variable Name | Value | Catatan |
    | :--- | :--- | :--- |
    | `APP_NAME` | `OrchidsLPK` | Nama aplikasi |
    | `APP_ENV` | `production` | Mode produksi |
    | `APP_KEY` | `base64:...` | Copy dari `.env` lokal Anda |
    | `APP_DEBUG` | `false` | Matikan debug di production |
    | `APP_URL` | `https://xxxx.up.railway.app` | URL domain yang dikasih Railway (cek tab Settings -> Networking) |
    | `DB_CONNECTION` | `pgsql` | **Wajib diubah ke pgsql** |
    | `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | Ketik `${{` lalu pilih variabel database otomatis |

    **Jangan lupa variable lain jika perlu:**
    *   `JWT_SECRET` (jika pakai JWT)
    *   Midtrans keys, dll.

## 5. Generate Domain
1.  Klik tab **Settings** pada service aplikasi.
2.  Scroll ke bagian **Networking**.
3.  Klik **Generate Domain** (nanti akan muncul domain seperti `web-production-xxxx.up.railway.app`).
4.  Update variabel `APP_URL` di langkah 4 dengan domain ini.

## 6. Setup Database (Migrasi)
Setelah deploy sukses (Status: **Active**), Anda perlu menjalankan migrasi database.
1.  Klik service aplikasi.
2.  Pergi ke tab **Shell** (atau **Command** di versi Railway CLI tool).
3.  Jalankan perintah ini di terminal Railway:
    ```bash
    cd backend && php artisan migrate --force
    ```
    *   *Perintah ini akan membuat tabel-tabel di database PostgreSQL.*
4.  Jika butuh data awal, jalankan seeder:
    ```bash
    cd backend && php artisan db:seed --force
    ```

## Selesai!
Aplikasi Anda sekarang aktif dengan backend Laravel, frontend React (build), dan database PostgreSQL.

---

### Troubleshooting
*   **Error 500 / Blank Screen**: Cek tab **Logs**. Biasanya karena `APP_KEY` belum diset atau koneksi database salah.
*   **Database Error**: Pastikan `DB_CONNECTION` diisi `pgsql`.
