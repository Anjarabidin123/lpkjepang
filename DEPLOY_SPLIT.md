# Panduan Deployment Terpisah (Split Deployment)

Panduan ini menjelaskan cara mendeploy Frontend ke **Vercel** dan Backend ke **Railway**.

## 1. Persiapan Backend (Railway)
*   Pastikan repo GitHub Anda sudah terhubung ke Railway.
*   Buka **Settings** di Railway dashboard.
*   Cari bagian **General** -> **Root Directory**.
*   Ubah nilainya menjadi `/backend`. Ini akan membuat Railway hanya mem-build folder backend (Laravel).
*   Jangan lupa tambahkan Database PostgreSQL di Railway dan hubungkan environment variables-nya (`DB_CONNECTION`, `DB_HOST`, dll).
*   Pastikan `CORS_ALLOWED_ORIGINS` di Railway mencakup domain Vercel Anda (atau gunakan `*` untuk sementara).

## 2. Persiapan Frontend (Vercel)
*   Buka Vercel dashboard dan klik **Add New** -> **Project**.
*   Pilih repo yang sama.
*   Di bagian **Framework Preset**, pilih **Vite**.
*   Di bagian **Root Directory**, biarkan kosong `./` (karena frontend ada di root repo).
*   Di bagian **Environment Variables**, tambahkan:
    *   `VITE_API_BASE_URL` = `https://nama-app-anda.up.railway.app/api`
*   Klik **Deploy**.

## 3. Keuntungan
*   Build lebih cepat.
*   Vercel mendukung Edge Network untuk Frontend (loading lebih cepat).
*   Railway lebih stabil karena hanya menjalankan satu proses (PHP-FPM/Artisan).
*   Menghindari error `EBUSY` pada `node_modules`.
