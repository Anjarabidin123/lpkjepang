// Seed data for localStorage development

import { generateId } from './core';
import { 
  programTable, 
  jenisKerjaTable, 
  kumiaiTable, 
  perusahaanTable,
  lpkMitraTable,
  posisiKerjaTable,
  demografiProvincesTable,
  demografiRegenciesTable,
  siswaTable,
  siswaMagangTable,
  kategoriPemasukanTable,
  kategoriPengeluaranTable,
  rbacRolesTable,
  rbacPermissionsTable,
  tasksTable,
  jobOrderTable,
  jobOrderPesertaTable,
  profilesTable,
  userRolesTable,
  documentTemplatesTable,
  documentVariablesTable,
  siswaDocumentsTable,
} from './tables';

export function seedDefaultData() {
  // Seed Programs
  const programs = programTable.getAll();
  if (programs.length === 0) {
    const programData = [
      { nama: 'Ginou Jisshuusei (TITP)', kode: 'GJ', deskripsi: 'Program magang teknis ke Jepang', durasi: 36 },
      { nama: 'Tokutei Ginou (SSW)', kode: 'TG', deskripsi: 'Program pekerja terampil khusus', durasi: 60 },
      { nama: 'Internship (Magang)', kode: 'INT', deskripsi: 'Program magang mahasiswa/umum', durasi: 12 },
      { nama: 'Engineer / Specialist in Humanities', kode: 'ENG', deskripsi: 'Program tenaga ahli profesional', durasi: 60 },
    ];
    programData.forEach(p => programTable.create(p));
    console.log('Seeded programs:', programData.length);
  }

  // Seed Posisi Kerja
  const posisiKerja = posisiKerjaTable.getAll();
  if (posisiKerja.length < 15) {
    posisiKerjaTable.setAll([]);
    const perusahaanList = perusahaanTable.getAll();
    const jenisKerjaList = jenisKerjaTable.getAll();
    
    const posisiKerjaData = [
      { 
        posisi: 'Caregiver (Kaigo)', 
        kode: 'CG001', 
        lokasi: 'Tokyo', 
        kuota: 10, 
        terisi: 4, 
        gaji_harian: 9500, 
        jam_kerja: '08:00 - 17:00', 
        status: 'Buka',
        perusahaan_id: perusahaanList[0]?.id,
        jenis_kerja_id: jenisKerjaList.find(j => j.kode === 'PRW')?.id,
        persyaratan: 'JLPT N4, Sertifikat Kaigo'
      },
      { 
        posisi: 'Construction Worker', 
        kode: 'CW001', 
        lokasi: 'Osaka', 
        kuota: 20, 
        terisi: 12, 
        gaji_harian: 11000, 
        jam_kerja: '07:30 - 16:30', 
        status: 'Buka',
        perusahaan_id: perusahaanList[1]?.id,
        jenis_kerja_id: jenisKerjaList.find(j => j.kode === 'KON')?.id,
        persyaratan: 'Fisik kuat, Dasar Bahasa Jepang'
      },
      { 
        posisi: 'Food Processing', 
        kode: 'FP001', 
        lokasi: 'Saitama', 
        kuota: 15, 
        terisi: 15, 
        gaji_harian: 8800, 
        jam_kerja: 'Shift (8 jam)', 
        status: 'Penuh',
        perusahaan_id: perusahaanList[3]?.id,
        jenis_kerja_id: jenisKerjaList.find(j => j.kode === 'MNF')?.id,
        persyaratan: 'Kebersihan tinggi, Disiplin'
      },
      { 
        posisi: 'Agriculture', 
        kode: 'AG001', 
        lokasi: 'Hokkaido', 
        kuota: 30, 
        terisi: 8, 
        gaji_harian: 9000, 
        jam_kerja: '06:00 - 15:00', 
        status: 'Buka',
        perusahaan_id: perusahaanList[4]?.id,
        jenis_kerja_id: jenisKerjaList.find(j => j.kode === 'PTN')?.id,
        persyaratan: 'Biasa kerja lapangan'
      },
      { 
        posisi: 'Welder', 
        kode: 'WLD01', 
        lokasi: 'Nagoya', 
        kuota: 5, 
        terisi: 5, 
        gaji_harian: 12000, 
        jam_kerja: '08:00 - 17:00', 
        status: 'Penuh',
        perusahaan_id: perusahaanList[2]?.id,
        jenis_kerja_id: jenisKerjaList.find(j => j.kode === 'MNF')?.id,
        persyaratan: 'Sertifikat Las, Pengalaman 1 tahun'
      },
      { 
        posisi: 'Hotel Room Cleaning', 
        kode: 'HSP01', 
        lokasi: 'Kyoto', 
        kuota: 12, 
        terisi: 2, 
        gaji_harian: 9200, 
        jam_kerja: '09:00 - 18:00', 
        status: 'Buka',
        perusahaan_id: perusahaanList[1]?.id,
        jenis_kerja_id: jenisKerjaList.find(j => j.kode === 'JSA')?.id,
        persyaratan: 'Rapi, Jujur'
      },
      { 
        posisi: 'Scaffolding', 
        kode: 'CW002', 
        lokasi: 'Chiba', 
        kuota: 10, 
        terisi: 0, 
        gaji_harian: 11500, 
        jam_kerja: '08:00 - 17:00', 
        status: 'Buka',
        perusahaan_id: perusahaanList[0]?.id,
        jenis_kerja_id: jenisKerjaList.find(j => j.kode === 'KON')?.id,
        persyaratan: 'Tidak takut ketinggian'
      },
      { 
        posisi: 'Dairy Farming', 
        kode: 'AG002', 
        lokasi: 'Hokkaido', 
        kuota: 8, 
        terisi: 6, 
        gaji_harian: 9300, 
        jam_kerja: '05:00 - 14:00', 
        status: 'Buka',
        perusahaan_id: perusahaanList[4]?.id,
        jenis_kerja_id: jenisKerjaList.find(j => j.kode === 'PTN')?.id,
        persyaratan: 'Penyayang binatang'
      },
      { 
        posisi: 'Electronic Assembly', 
        kode: 'MN002', 
        lokasi: 'Yokohama', 
        kuota: 25, 
        terisi: 20, 
        gaji_harian: 9800, 
        jam_kerja: '08:30 - 17:30', 
        status: 'Buka',
        perusahaan_id: perusahaanList[3]?.id,
        jenis_kerja_id: jenisKerjaList.find(j => j.kode === 'MNF')?.id,
        persyaratan: 'Ketelitian tinggi'
      },
      { 
        posisi: 'Fishery Processing', 
        kode: 'FS001', 
        lokasi: 'Shizuoka', 
        kuota: 15, 
        terisi: 4, 
        gaji_harian: 8900, 
        jam_kerja: '07:00 - 16:00', 
        status: 'Buka',
        perusahaan_id: perusahaanList[1]?.id,
        jenis_kerja_id: jenisKerjaList.find(j => j.kode === 'PRK')?.id,
        persyaratan: 'Tahan dingin'
      },
      { 
        posisi: 'Auto Painter', 
        kode: 'AM002', 
        lokasi: 'Toyota City', 
        kuota: 3, 
        terisi: 0, 
        gaji_harian: 12500, 
        jam_kerja: '08:00 - 17:00', 
        status: 'Buka',
        perusahaan_id: perusahaanList[2]?.id,
        jenis_kerja_id: jenisKerjaList.find(j => j.kode === 'MNF')?.id,
        persyaratan: 'Pengalaman pengecatan'
      },
      { 
        posisi: 'Elderly Care (Night Shift)', 
        kode: 'CG002', 
        lokasi: 'Kanagawa', 
        kuota: 6, 
        terisi: 2, 
        gaji_harian: 13000, 
        jam_kerja: '20:00 - 05:00', 
        status: 'Buka',
        perusahaan_id: perusahaanList[0]?.id,
        jenis_kerja_id: jenisKerjaList.find(j => j.kode === 'PRW')?.id,
        persyaratan: 'Sertifikat Kaigo, JLPT N3'
      },
      { 
        posisi: 'Bakery Production', 
        kode: 'FP002', 
        lokasi: 'Nagoya', 
        kuota: 10, 
        terisi: 10, 
        gaji_harian: 9000, 
        jam_kerja: '04:00 - 13:00', 
        status: 'Penuh',
        perusahaan_id: perusahaanList[3]?.id,
        jenis_kerja_id: jenisKerjaList.find(j => j.kode === 'MNF')?.id,
        persyaratan: 'Pagi hari'
      },
      { 
        posisi: 'Concrete Pumping', 
        kode: 'CW003', 
        lokasi: 'Tokyo', 
        kuota: 4, 
        terisi: 4, 
        gaji_harian: 11800, 
        jam_kerja: '08:00 - 17:00', 
        status: 'Penuh',
        perusahaan_id: perusahaanList[0]?.id,
        jenis_kerja_id: jenisKerjaList.find(j => j.kode === 'KON')?.id,
        persyaratan: 'Fisik kuat'
      },
      { 
        posisi: 'Fruit Harvesting', 
        kode: 'AG003', 
        lokasi: 'Yamanashi', 
        kuota: 20, 
        terisi: 0, 
        gaji_harian: 8500, 
        jam_kerja: '07:00 - 16:00', 
        status: 'Tutup',
        perusahaan_id: perusahaanList[4]?.id,
        jenis_kerja_id: jenisKerjaList.find(j => j.kode === 'PTN')?.id,
        persyaratan: 'Musiman'
      }
    ];
    posisiKerjaData.forEach(pk => posisiKerjaTable.create(pk));
    console.log('Seeded enhanced posisi kerja:', posisiKerjaData.length);
  }

  // Seed Jenis Kerja
  const jenisKerja = jenisKerjaTable.getAll();
  if (jenisKerja.length === 0) {
    const jenisKerjaData = [
      { nama: 'Konstruksi', kode: 'KON', deskripsi: 'Pekerjaan bidang konstruksi' },
      { nama: 'Pertanian', kode: 'PTN', deskripsi: 'Pekerjaan bidang pertanian' },
      { nama: 'Manufaktur', kode: 'MNF', deskripsi: 'Pekerjaan bidang manufaktur' },
      { nama: 'Perikanan', kode: 'PRK', deskripsi: 'Pekerjaan bidang perikanan' },
      { nama: 'Perawatan (Kaigo)', kode: 'PRW', deskripsi: 'Pekerjaan bidang perawatan' },
      { nama: 'Jasa & Pelayanan', kode: 'JSA', deskripsi: 'Bidang jasa dan hospitality' },
    ];
    jenisKerjaData.forEach(jk => jenisKerjaTable.create(jk));
    console.log('Seeded jenis kerja:', jenisKerjaData.length);
  }

  // Seed Kumiai
  const kumiai = kumiaiTable.getAll();
  if (kumiai.length === 0) {
    const kumiaiData = [
      { 
        nama: 'Kanto Kyodo Kumiai', 
        kode: 'KKK', 
        alamat: 'Shinjuku-ku, Tokyo, Japan', 
        telepon: '+81-3-3344-5566',
        email: 'info@kanto-kumiai.or.jp',
        pic_nama: 'Tanaka Sato',
        pic_telepon: '+81-90-1122-3344',
        jumlah_perusahaan: 12,
      },
      { 
        nama: 'Kansai Support Association', 
        kode: 'KSA', 
        alamat: 'Chuo-ku, Osaka, Japan', 
        telepon: '+81-6-6677-8899',
        email: 'contact@kansai-support.jp',
        pic_nama: 'Yamamoto Kenji',
        pic_telepon: '+81-80-9988-7766',
        jumlah_perusahaan: 8,
      },
      { 
        nama: 'Nagoya Gijutsu Cooperative', 
        kode: 'NGC', 
        alamat: 'Naka-ku, Nagoya, Japan', 
        telepon: '+81-52-1122-3344',
        email: 'admin@nagoya-gijutsu.jp',
        pic_nama: 'Ito Hiroshi',
        pic_telepon: '+81-70-5566-7788',
        jumlah_perusahaan: 5,
      },
    ];
    kumiaiData.forEach(k => kumiaiTable.create(k));
    console.log('Seeded kumiai:', kumiaiData.length);
  }

  // Seed Perusahaan
  const perusahaan = perusahaanTable.getAll();
  if (perusahaan.length === 0) {
    const kumiaiList = kumiaiTable.getAll();
    const perusahaanData = [
      { nama: 'Tokyo Construction Co.', kode: 'TCC', alamat: 'Shibuya, Tokyo', kumiai_id: kumiaiList[0]?.id, email: 'hiring@tokyo-const.jp', status: 'aktif' },
      { nama: 'Osaka Food Processing Ltd.', kode: 'OFP', alamat: 'Namba, Osaka', kumiai_id: kumiaiList[1]?.id, email: 'info@osaka-food.jp', status: 'aktif' },
      { nama: 'Nagoya Auto Works', kode: 'NAW', alamat: 'Toyota City, Aichi', kumiai_id: kumiaiList[2]?.id, email: 'recruit@nagoya-auto.jp', status: 'aktif' },
      { nama: 'Saitama Electronics', kode: 'SEL', alamat: 'Omiya, Saitama', kumiai_id: kumiaiList[0]?.id, email: 'hr@saitama-elec.jp', status: 'aktif' },
      { nama: 'Hokkaido Dairy Farm', kode: 'HDF', alamat: 'Sapporo, Hokkaido', kumiai_id: kumiaiList[1]?.id, email: 'jobs@hokkaido-dairy.jp', status: 'aktif' },
    ];
    perusahaanData.forEach(p => perusahaanTable.create(p));
    console.log('Seeded perusahaan:', perusahaanData.length);
  }

  // Seed LPK Mitra
  const lpkMitra = lpkMitraTable.getAll();
  if (lpkMitra.length === 0) {
    const lpkMitraData = [
      { 
        nama: 'LPK Global Indonesia', 
        nama_lpk: 'LPK Global Indonesia',
        kode: 'LGI', 
        alamat: 'Jakarta Selatan, DKI Jakarta',
        telepon: '021-7788990',
        email: 'info@global-indonesia.com',
        pic_nama: 'Budi Santoso',
        status: 'aktif',
      },
      { 
        nama: 'LPK Bakti Nusantara', 
        nama_lpk: 'LPK Bakti Nusantara',
        kode: 'LBN', 
        alamat: 'Bandung, Jawa Barat',
        telepon: '022-4455667',
        email: 'admin@baktinusantara.id',
        pic_nama: 'Siti Aminah',
        status: 'aktif',
      },
      { 
        nama: 'LPK Cipta Kerja Utama', 
        nama_lpk: 'LPK Cipta Kerja Utama',
        kode: 'CKU', 
        alamat: 'Semarang, Jawa Tengah',
        telepon: '024-3322110',
        email: 'rekrutmen@ciptakerja.com',
        pic_nama: 'Agus Wijaya',
        status: 'aktif',
      },
    ];
    lpkMitraData.forEach(lm => lpkMitraTable.create(lm));
    console.log('Seeded LPK Mitra:', lpkMitraData.length);
  }

  // Seed Siswa
  const siswa = siswaTable.getAll();
  // For the purpose of enhancement, we clear the table if it's below our target of 30 or contains old data pattern
  if (siswa.length < 30) {
    siswaTable.setAll([]);
    siswaMagangTable.setAll([]);
    
    const programList = programTable.getAll();
    const lpkList = lpkMitraTable.getAll();
    const kumiaiList = kumiaiTable.getAll();
    const perusahaanList = perusahaanTable.getAll();
    const jenisKerjaList = jenisKerjaTable.getAll();
    const posisiKerjaList = posisiKerjaTable.getAll();

    const mockSiswaData = [
      { nama: 'Ahmad Fauzi', nik: '327301100001', gender: 'Laki-laki', tempat: 'Bandung', tgl: '1998-05-15' },
      { nama: 'Siti Aminah', nik: '327301100002', gender: 'Perempuan', tempat: 'Jakarta', tgl: '1999-08-20' },
      { nama: 'Bambang Susanto', nik: '327301100003', gender: 'Laki-laki', tempat: 'Semarang', tgl: '1997-12-10' },
      { nama: 'Rizky Ramadhan', nik: '327301100004', gender: 'Laki-laki', tempat: 'Surabaya', tgl: '2000-01-05' },
      { nama: 'Indah Permata', nik: '327301100005', gender: 'Perempuan', tempat: 'Medan', tgl: '1999-03-25' },
      { nama: 'Joko Prasetyo', nik: '327301100006', gender: 'Laki-laki', tempat: 'Yogyakarta', tgl: '1998-11-30' },
      { nama: 'Maya Kartika', nik: '327301100007', gender: 'Perempuan', tempat: 'Solo', tgl: '2001-02-14' },
      { nama: 'Agus Setiawan', nik: '327301100008', gender: 'Laki-laki', tempat: 'Malang', tgl: '1997-07-22' },
      { nama: 'Rina Wijaya', nik: '327301100009', gender: 'Perempuan', tempat: 'Bogor', tgl: '2000-06-18' },
      { nama: 'Hendra Gunawan', nik: '327301100010', gender: 'Laki-laki', tempat: 'Tangerang', tgl: '1998-09-09' },
      { nama: 'Sri Wahyuni', nik: '327301100011', gender: 'Perempuan', tempat: 'Bekasi', tgl: '1999-04-12' },
      { nama: 'Fajar Nugraha', nik: '327301100012', gender: 'Laki-laki', tempat: 'Depok', tgl: '2001-10-01' },
      { nama: 'Dewi Lestari', nik: '327301100013', gender: 'Perempuan', tempat: 'Palembang', tgl: '1998-12-25' },
      { nama: 'Eko Saputra', nik: '327301100014', gender: 'Laki-laki', tempat: 'Lampung', tgl: '1997-03-03' },
      { nama: 'Putri Rahayu', nik: '327301100015', gender: 'Perempuan', tempat: 'Padang', tgl: '2000-09-17' },
      { nama: 'Aditya Pratama', nik: '327301100016', gender: 'Laki-laki', tempat: 'Makassar', tgl: '1999-07-07' },
      { nama: 'Nanda Safitri', nik: '327301100017', gender: 'Perempuan', tempat: 'Denpasar', tgl: '2001-11-11' },
      { nama: 'Dimas Anggara', nik: '327301100018', gender: 'Laki-laki', tempat: 'Mataram', tgl: '1998-01-20' },
      { nama: 'Larasati Putri', nik: '327301100019', gender: 'Perempuan', tempat: 'Pontianak', tgl: '2000-02-28' },
      { nama: 'Gilang Dirga', nik: '327301100020', gender: 'Laki-laki', tempat: 'Banjarmasin', tgl: '1999-05-05' },
      { nama: 'Fitri Handayani', nik: '327301100021', gender: 'Perempuan', tempat: 'Manado', tgl: '2001-08-15' },
      { nama: 'Aris Munandar', nik: '327301100022', gender: 'Laki-laki', tempat: 'Ambon', tgl: '1998-10-10' },
      { nama: 'Dian Kusuma', nik: '327301100023', gender: 'Perempuan', tempat: 'Jayapura', tgl: '1999-12-12' },
      { nama: 'Wahyu Hidayat', nik: '327301100024', gender: 'Laki-laki', tempat: 'Banda Aceh', tgl: '1997-04-04' },
      { nama: 'Ratna Sari', nik: '327301100025', gender: 'Perempuan', tempat: 'Pekanbaru', tgl: '2000-01-01' },
      { nama: 'Surya Kencana', nik: '327301100026', gender: 'Laki-laki', tempat: 'Jambi', tgl: '1998-07-07' },
      { nama: 'Melati Indah', nik: '327301100027', gender: 'Perempuan', tempat: 'Bengkulu', tgl: '2001-03-03' },
      { nama: 'Bayu Segara', nik: '327301100028', gender: 'Laki-laki', tempat: 'Serang', tgl: '1999-09-09' },
      { nama: 'Tari Malasari', nik: '327301100029', gender: 'Perempuan', tempat: 'Gorontalo', tgl: '2000-05-05' },
      { nama: 'Guntur Bumi', nik: '327301100030', gender: 'Laki-laki', tempat: 'Palu', tgl: '1997-11-11' },
    ];

    const statuses = ['Proses', 'Matching', 'Pelatihan', 'Magang', 'Selesai'];

    mockSiswaData.forEach((data, index) => {
      const email = `${data.nama.toLowerCase().replace(' ', '.')}@example.com`;
      const status = statuses[index % statuses.length];
      
      const newSiswa = siswaTable.create({ 
        nama: data.nama, 
        nik: data.nik, 
        email: email,
        is_available: status !== 'Magang',
        program_id: programList[index % programList.length]?.id,
        lpk_mitra_id: lpkList[index % lpkList.length]?.id,
        status: status as any,
        tempat_lahir: data.tempat,
        tanggal_lahir: data.tgl,
        jenis_kelamin: data.gender as any,
        alamat: `Jl. Contoh No. ${index + 1}, ${data.tempat}`,
        tanggal_daftar: new Date(2023, index % 12, (index % 28) + 1).toISOString(),
      });

      // If status is 'Magang' or 'Selesai', seed Siswa Magang data
      if (status === 'Magang' || status === 'Selesai' || index % 2 === 0) {
        siswaMagangTable.create({
          siswa_id: newSiswa.id,
          kumiai_id: kumiaiList[index % kumiaiList.length]?.id,
          perusahaan_id: perusahaanList[index % perusahaanList.length]?.id,
          program_id: programList[index % programList.length]?.id,
          jenis_kerja_id: jenisKerjaList[index % jenisKerjaList.length]?.id,
          posisi_kerja_id: posisiKerjaList[index % posisiKerjaList.length]?.id,
          lpk_mitra_id: lpkList[index % lpkList.length]?.id,
          status_magang: status === 'Selesai' ? 'Selesai' : 'Aktif',
          gaji: 160000 + (index * 2000),
          tanggal_mulai_kerja: new Date(2023, index % 12, (index % 28) + 1).toISOString(),
          lokasi: 'Japan',
        });
      }
    });

    console.log(`Seeded ${mockSiswaData.length} mock siswa and associated magang data`);
  }

  // Seed Finance Categories
  const katPem = kategoriPemasukanTable.getAll();
  if (katPem.length === 0) {
    const categories = [
      { nama: 'Biaya Pendaftaran', deskripsi: 'Pendaftaran awal siswa' },
      { nama: 'Cicilan Program', deskripsi: 'Pembayaran bertahap biaya program' },
      { nama: 'Pelunasan', deskripsi: 'Pelunasan sisa biaya program' },
      { nama: 'Management Fee', deskripsi: 'Biaya pengelolaan dari Kumiai/Perusahaan' },
      { nama: 'Biaya Pelatihan', deskripsi: 'Pembayaran biaya pelatihan bahasa/teknis' },
    ];
    categories.forEach(c => kategoriPemasukanTable.create(c));
  }

  const katPeng = kategoriPengeluaranTable.getAll();
  if (katPeng.length === 0) {
    const categories = [
      { nama: 'Gaji Karyawan', deskripsi: 'Gaji staff internal LPK' },
      { nama: 'Sewa Gedung', deskripsi: 'Biaya sewa kantor/asrama' },
      { nama: 'Operasional Kantor', deskripsi: 'Listrik, air, internet, ATK' },
      { nama: 'Promosi & Iklan', deskripsi: 'Marketing dan sosialisasi program' },
      { nama: 'Biaya Visa & Dokumen', deskripsi: 'Pengurusan dokumen siswa' },
    ];
    categories.forEach(c => kategoriPengeluaranTable.create(c));
  }

  // Seed RBAC Roles & Permissions
  const roles = rbacRolesTable.getAll();
  const needsReseed = roles.length < 6 || !roles.some(r => r.name === 'super_admin');
  if (needsReseed) {
    rbacRolesTable.setAll([]);
    rbacPermissionsTable.setAll([]);
    
    const roleData = [
      { 
        name: 'super_admin', 
        display_name: 'Super Administrator', 
        description: 'Akses penuh ke semua fitur dan pengaturan sistem', 
        is_system_role: true, 
        is_active: true 
      },
      { 
        name: 'admin', 
        display_name: 'Administrator', 
        description: 'Akses administratif umum untuk mengelola data dan pengguna', 
        is_system_role: true, 
        is_active: true 
      },
      { 
        name: 'finance_manager', 
        display_name: 'Manajer Keuangan', 
        description: 'Akses penuh ke modul keuangan, invoice, dan laporan keuangan', 
        is_system_role: false, 
        is_active: true 
      },
      { 
        name: 'recruitment_officer', 
        display_name: 'Staff Rekrutmen', 
        description: 'Mengelola pendaftaran siswa, seleksi, dan proses matching', 
        is_system_role: false, 
        is_active: true 
      },
      { 
        name: 'operations_manager', 
        display_name: 'Manajer Operasional', 
        description: 'Monitoring magang, job order, dan koordinasi dengan kumiai/perusahaan', 
        is_system_role: false, 
        is_active: true 
      },
      { 
        name: 'viewer', 
        display_name: 'Viewer', 
        description: 'Hanya dapat melihat data tanpa melakukan perubahan', 
        is_system_role: false, 
        is_active: true 
      },
      { 
        name: 'data_entry', 
        display_name: 'Staff Entry Data', 
        description: 'Input dan pembaruan data siswa dan master data', 
        is_system_role: false, 
        is_active: true 
      },
      { 
        name: 'auditor', 
        display_name: 'Auditor', 
        description: 'Akses baca ke seluruh data untuk keperluan audit', 
        is_system_role: false, 
        is_active: false 
      },
    ];
    roleData.forEach(r => rbacRolesTable.create(r));
    console.log('Seeded RBAC roles:', roleData.length);

    // Seed RBAC Permissions
    const permissionData = [
      // User Management
      { name: 'user_management.view', display_name: 'Lihat Pengguna', description: 'Melihat daftar pengguna', module: 'user_management', action: 'view', is_active: true },
      { name: 'user_management.create', display_name: 'Buat Pengguna', description: 'Membuat pengguna baru', module: 'user_management', action: 'create', is_active: true },
      { name: 'user_management.update', display_name: 'Edit Pengguna', description: 'Mengubah data pengguna', module: 'user_management', action: 'update', is_active: true },
      { name: 'user_management.delete', display_name: 'Hapus Pengguna', description: 'Menghapus pengguna', module: 'user_management', action: 'delete', is_active: true },
      
      // Role Management
      { name: 'role_management.view', display_name: 'Lihat Peran', description: 'Melihat daftar peran', module: 'role_management', action: 'view', is_active: true },
      { name: 'role_management.create', display_name: 'Buat Peran', description: 'Membuat peran baru', module: 'role_management', action: 'create', is_active: true },
      { name: 'role_management.update', display_name: 'Edit Peran', description: 'Mengubah konfigurasi peran', module: 'role_management', action: 'update', is_active: true },
      { name: 'role_management.delete', display_name: 'Hapus Peran', description: 'Menghapus peran', module: 'role_management', action: 'delete', is_active: true },
      
      // Siswa
      { name: 'siswa.view', display_name: 'Lihat Siswa', description: 'Melihat daftar siswa', module: 'siswa', action: 'view', is_active: true },
      { name: 'siswa.create', display_name: 'Tambah Siswa', description: 'Mendaftarkan siswa baru', module: 'siswa', action: 'create', is_active: true },
      { name: 'siswa.update', display_name: 'Edit Siswa', description: 'Mengubah data siswa', module: 'siswa', action: 'update', is_active: true },
      { name: 'siswa.delete', display_name: 'Hapus Siswa', description: 'Menghapus data siswa', module: 'siswa', action: 'delete', is_active: true },
      
      // Siswa Magang
      { name: 'siswa_magang.view', display_name: 'Lihat Siswa Magang', description: 'Melihat daftar siswa magang', module: 'siswa_magang', action: 'view', is_active: true },
      { name: 'siswa_magang.create', display_name: 'Tambah Siswa Magang', description: 'Menambah data magang siswa', module: 'siswa_magang', action: 'create', is_active: true },
      { name: 'siswa_magang.update', display_name: 'Edit Siswa Magang', description: 'Mengubah data magang', module: 'siswa_magang', action: 'update', is_active: true },
      { name: 'siswa_magang.delete', display_name: 'Hapus Siswa Magang', description: 'Menghapus data magang', module: 'siswa_magang', action: 'delete', is_active: true },
      
      // Job Order
      { name: 'job_order.view', display_name: 'Lihat Job Order', description: 'Melihat daftar job order', module: 'job_order', action: 'view', is_active: true },
      { name: 'job_order.create', display_name: 'Buat Job Order', description: 'Membuat job order baru', module: 'job_order', action: 'create', is_active: true },
      { name: 'job_order.update', display_name: 'Edit Job Order', description: 'Mengubah job order', module: 'job_order', action: 'update', is_active: true },
      { name: 'job_order.delete', display_name: 'Hapus Job Order', description: 'Menghapus job order', module: 'job_order', action: 'delete', is_active: true },
      
      // Kumiai
      { name: 'kumiai.view', display_name: 'Lihat Kumiai', description: 'Melihat daftar kumiai', module: 'kumiai', action: 'view', is_active: true },
      { name: 'kumiai.create', display_name: 'Tambah Kumiai', description: 'Menambah kumiai baru', module: 'kumiai', action: 'create', is_active: true },
      { name: 'kumiai.update', display_name: 'Edit Kumiai', description: 'Mengubah data kumiai', module: 'kumiai', action: 'update', is_active: true },
      { name: 'kumiai.delete', display_name: 'Hapus Kumiai', description: 'Menghapus kumiai', module: 'kumiai', action: 'delete', is_active: true },
      
      // Perusahaan
      { name: 'perusahaan.view', display_name: 'Lihat Perusahaan', description: 'Melihat daftar perusahaan', module: 'perusahaan', action: 'view', is_active: true },
      { name: 'perusahaan.create', display_name: 'Tambah Perusahaan', description: 'Menambah perusahaan baru', module: 'perusahaan', action: 'create', is_active: true },
      { name: 'perusahaan.update', display_name: 'Edit Perusahaan', description: 'Mengubah data perusahaan', module: 'perusahaan', action: 'update', is_active: true },
      { name: 'perusahaan.delete', display_name: 'Hapus Perusahaan', description: 'Menghapus perusahaan', module: 'perusahaan', action: 'delete', is_active: true },
      
      // LPK Mitra
      { name: 'lpk_mitra.view', display_name: 'Lihat LPK Mitra', description: 'Melihat daftar LPK mitra', module: 'lpk_mitra', action: 'view', is_active: true },
      { name: 'lpk_mitra.create', display_name: 'Tambah LPK Mitra', description: 'Menambah LPK mitra baru', module: 'lpk_mitra', action: 'create', is_active: true },
      { name: 'lpk_mitra.update', display_name: 'Edit LPK Mitra', description: 'Mengubah data LPK mitra', module: 'lpk_mitra', action: 'update', is_active: true },
      { name: 'lpk_mitra.delete', display_name: 'Hapus LPK Mitra', description: 'Menghapus LPK mitra', module: 'lpk_mitra', action: 'delete', is_active: true },
      
      // Invoice
      { name: 'invoice.view', display_name: 'Lihat Invoice', description: 'Melihat daftar invoice', module: 'invoice', action: 'view', is_active: true },
      { name: 'invoice.create', display_name: 'Buat Invoice', description: 'Membuat invoice baru', module: 'invoice', action: 'create', is_active: true },
      { name: 'invoice.update', display_name: 'Edit Invoice', description: 'Mengubah invoice', module: 'invoice', action: 'update', is_active: true },
      { name: 'invoice.delete', display_name: 'Hapus Invoice', description: 'Menghapus invoice', module: 'invoice', action: 'delete', is_active: true },
      
      // Arus Kas
      { name: 'arus_kas.view', display_name: 'Lihat Arus Kas', description: 'Melihat laporan arus kas', module: 'arus_kas', action: 'view', is_active: true },
      { name: 'arus_kas.create', display_name: 'Tambah Transaksi', description: 'Mencatat transaksi kas', module: 'arus_kas', action: 'create', is_active: true },
      { name: 'arus_kas.update', display_name: 'Edit Transaksi', description: 'Mengubah transaksi kas', module: 'arus_kas', action: 'update', is_active: true },
      { name: 'arus_kas.delete', display_name: 'Hapus Transaksi', description: 'Menghapus transaksi kas', module: 'arus_kas', action: 'delete', is_active: true },
      
      // Dashboard
      { name: 'dashboard.view', display_name: 'Lihat Dashboard', description: 'Akses ke halaman dashboard', module: 'dashboard', action: 'view', is_active: true },
      
      // Laporan Keuangan
      { name: 'laporan_keuangan.view', display_name: 'Lihat Laporan Keuangan', description: 'Akses laporan keuangan', module: 'laporan_keuangan', action: 'view', is_active: true },
      { name: 'laporan_keuangan.create', display_name: 'Buat Laporan', description: 'Membuat laporan keuangan', module: 'laporan_keuangan', action: 'create', is_active: true },
      
      // Program
      { name: 'program.view', display_name: 'Lihat Program', description: 'Melihat daftar program', module: 'program', action: 'view', is_active: true },
      { name: 'program.create', display_name: 'Tambah Program', description: 'Menambah program baru', module: 'program', action: 'create', is_active: true },
      { name: 'program.update', display_name: 'Edit Program', description: 'Mengubah data program', module: 'program', action: 'update', is_active: true },
      { name: 'program.delete', display_name: 'Hapus Program', description: 'Menghapus program', module: 'program', action: 'delete', is_active: true },
      
      // Monitoring
      { name: 'monitoring.view', display_name: 'Lihat Monitoring', description: 'Akses fitur monitoring', module: 'monitoring', action: 'view', is_active: true },
      { name: 'monitoring.update', display_name: 'Update Monitoring', description: 'Memperbarui status monitoring', module: 'monitoring', action: 'update', is_active: true },
    ];
    permissionData.forEach(p => rbacPermissionsTable.create(p));
    console.log('Seeded RBAC permissions:', permissionData.length);
  }

  // Seed RBAC Users (Profiles) with Role Assignments
  const profiles = profilesTable.getAll();
  const needsUserReseed = profiles.length < 8 || !profiles.some(p => p.email === 'admin@lpk-sakura.id');
  if (needsUserReseed) {
    profilesTable.setAll([]);
    userRolesTable.setAll([]);
    
    const rbacRoles = rbacRolesTable.getAll();
    
    const userData = [
      { 
        full_name: 'Budi Santoso', 
        email: 'admin@lpk-sakura.id', 
        phone: '081234567890',
        avatar_url: null,
        is_active: true,
        role_names: ['super_admin']
      },
      { 
        full_name: 'Siti Rahayu', 
        email: 'siti.rahayu@lpk-sakura.id', 
        phone: '081234567891',
        avatar_url: null,
        is_active: true,
        role_names: ['admin']
      },
      { 
        full_name: 'Ahmad Wijaya', 
        email: 'ahmad.wijaya@lpk-sakura.id', 
        phone: '081234567892',
        avatar_url: null,
        is_active: true,
        role_names: ['finance_manager']
      },
      { 
        full_name: 'Dewi Lestari', 
        email: 'dewi.lestari@lpk-sakura.id', 
        phone: '081234567893',
        avatar_url: null,
        is_active: true,
        role_names: ['recruitment_officer']
      },
      { 
        full_name: 'Eko Prasetyo', 
        email: 'eko.prasetyo@lpk-sakura.id', 
        phone: '081234567894',
        avatar_url: null,
        is_active: true,
        role_names: ['operations_manager']
      },
      { 
        full_name: 'Fitri Handayani', 
        email: 'fitri.handayani@lpk-sakura.id', 
        phone: '081234567895',
        avatar_url: null,
        is_active: true,
        role_names: ['data_entry']
      },
      { 
        full_name: 'Gunawan Setiawan', 
        email: 'gunawan@lpk-sakura.id', 
        phone: '081234567896',
        avatar_url: null,
        is_active: true,
        role_names: ['viewer']
      },
      { 
        full_name: 'Hendra Kusuma', 
        email: 'hendra.kusuma@lpk-sakura.id', 
        phone: '081234567897',
        avatar_url: null,
        is_active: false,
        role_names: ['auditor']
      },
      { 
        full_name: 'Indah Permata', 
        email: 'indah.permata@lpk-sakura.id', 
        phone: '081234567898',
        avatar_url: null,
        is_active: true,
        role_names: ['admin', 'finance_manager']
      },
      { 
        full_name: 'Joko Widodo', 
        email: 'joko.widodo@lpk-sakura.id', 
        phone: '081234567899',
        avatar_url: null,
        is_active: true,
        role_names: ['recruitment_officer', 'data_entry']
      },
    ];
    
    userData.forEach(user => {
      const { role_names, ...profileData } = user;
      const createdProfile = profilesTable.create(profileData as any);
      
      // Assign roles to user
      role_names.forEach(roleName => {
        const role = rbacRoles.find(r => r.name === roleName);
        if (role) {
          userRolesTable.create({
            user_id: createdProfile.id,
            role: roleName
          } as any);
        }
      });
    });
    
    console.log('Seeded RBAC users with roles:', userData.length);
  }

  // Seed Tasks
  const tasks = tasksTable.getAll();
  if (tasks.length === 0) {
    const taskData = [
      { title: 'Update Profil LPK Utama', status: 'pending', priority: 'high', due_date: new Date().toISOString() },
      { title: 'Verifikasi Berkas Siswa Gelombang 5', status: 'in_progress', priority: 'medium', due_date: new Date().toISOString() },
      { title: 'Kirim Invoice Management Fee Jan 2024', status: 'pending', priority: 'high', due_date: new Date().toISOString() },
      { title: 'Follow Up Interview Tokyo Const.', status: 'completed', priority: 'medium', due_date: new Date().toISOString() },
      { title: 'Laporan Bulanan Keuangan Desember', status: 'pending', priority: 'low', due_date: new Date().toISOString() },
    ];
    taskData.forEach(t => tasksTable.create(t));
  }

  // Seed Demografi Provinces
  const provinces = demografiProvincesTable.getAll();
  if (provinces.length === 0) {
    const provincesData = [
      { id: '31', nama: 'DKI Jakarta', kode: '31' },
      { id: '32', nama: 'Jawa Barat', kode: '32' },
      { id: '33', nama: 'Jawa Tengah', kode: '33' },
      { id: '34', nama: 'DI Yogyakarta', kode: '34' },
      { id: '35', nama: 'Jawa Timur', kode: '35' },
      { id: '36', nama: 'Banten', kode: '36' },
      { id: '11', nama: 'Aceh', kode: '11' },
      { id: '12', nama: 'Sumatera Utara', kode: '12' },
      { id: '13', nama: 'Sumatera Barat', kode: '13' },
      { id: '73', nama: 'Sulawesi Selatan', kode: '73' },
    ];
    provincesData.forEach(p => demografiProvincesTable.create(p));
    console.log('Seeded provinces:', provincesData.length);
  }

  // Seed Demografi Regencies
  const regencies = demografiRegenciesTable.getAll();
  if (regencies.length === 0) {
    const regenciesData = [
      { id: '3171', nama: 'Jakarta Selatan', province_id: '31', kode: '3171' },
      { id: '3172', nama: 'Jakarta Timur', province_id: '31', kode: '3172' },
      { id: '3273', nama: 'Bandung', province_id: '32', kode: '3273' },
      { id: '3201', nama: 'Bogor', province_id: '32', kode: '3201' },
      { id: '3374', nama: 'Semarang', province_id: '33', kode: '3374' },
      { id: '3471', nama: 'Yogyakarta', province_id: '34', kode: '3471' },
      { id: '3578', nama: 'Surabaya', province_id: '35', kode: '3578' },
      { id: '3573', nama: 'Malang', province_id: '35', kode: '3573' },
      { id: '1271', nama: 'Medan', province_id: '12', kode: '1271' },
      { id: '7371', nama: 'Makassar', province_id: '73', kode: '7371' },
    ];
    regenciesData.forEach(r => demografiRegenciesTable.create(r));
    console.log('Seeded regencies:', regenciesData.length);
  }

  // Seed Job Orders
  const jobOrders = jobOrderTable.getAll();
  if (jobOrders.length === 0) {
    const kumiaiList = kumiaiTable.getAll();
    const jenisKerjaList = jenisKerjaTable.getAll();
    const siswaList = siswaTable.getAll();
    
    const jobOrderData = [
      {
        nama_job_order: 'Caregiver Tokyo 2024',
        kuota: 5,
        status: 'Aktif',
        catatan: 'Permintaan mendesak untuk panti jompo di Tokyo',
        kumiai_id: kumiaiList[0]?.id,
        jenis_kerja_id: jenisKerjaList.find(j => j.kode === 'PRW')?.id,
      },
      {
        nama_job_order: 'Konstruksi Osaka Project',
        kuota: 10,
        status: 'Aktif',
        catatan: 'Proyek pembangunan apartemen',
        kumiai_id: kumiaiList[1]?.id,
        jenis_kerja_id: jenisKerjaList.find(j => j.kode === 'KON')?.id,
      },
      {
        nama_job_order: 'Manufaktur Nagoya Automotive',
        kuota: 8,
        status: 'Aktif',
        catatan: 'Perakitan komponen otomotif',
        kumiai_id: kumiaiList[2]?.id,
        jenis_kerja_id: jenisKerjaList.find(j => j.kode === 'MNF')?.id,
      },
      {
        nama_job_order: 'Agriculture Hokkaido Farm',
        kuota: 15,
        status: 'Aktif',
        catatan: 'Panen musim panas',
        kumiai_id: kumiaiList[1]?.id,
        jenis_kerja_id: jenisKerjaList.find(j => j.kode === 'PTN')?.id,
      },
      {
        nama_job_order: 'Food Processing Saitama',
        kuota: 12,
        status: 'Aktif',
        catatan: 'Pengemasan makanan siap saji',
        kumiai_id: kumiaiList[0]?.id,
        jenis_kerja_id: jenisKerjaList.find(j => j.kode === 'MNF')?.id,
      }
    ];

    jobOrderData.forEach((jo, index) => {
      const createdJo = jobOrderTable.create(jo);
      
      // Assign 2-4 participants to each job order
      const numParticipants = 2 + (index % 3);
      const availableSiswa = siswaList.filter(s => s.is_available).slice(index * 4, (index * 4) + numParticipants);
      
      availableSiswa.forEach(siswa => {
        jobOrderPesertaTable.create({
          job_order_id: createdJo.id,
          siswa_id: siswa.id,
          status: 'Proses',
          keterangan: 'Pendaftaran awal'
        });
      });
    });
console.log('Seeded job orders and participants:', jobOrderData.length);
    }

    // Seed Document Templates
    const docTemplates = documentTemplatesTable.getAll();
    if (docTemplates.length === 0) {
      const documentTemplateData = [
        {
          kode: 'DOC-VISA-001',
          nama: 'Formulir Aplikasi Visa',
          kategori: 'visa',
          deskripsi: 'Formulir aplikasi visa kerja ke Jepang',
          template_content: `<h1 style="text-align: center;">FORMULIR APLIKASI VISA</h1>
<p><strong>Nama Lengkap:</strong> {{siswa_nama_upper}}</p>
<p><strong>NIK:</strong> {{siswa_nik}}</p>
<p><strong>Tempat/Tanggal Lahir:</strong> {{siswa_tempat_lahir}}, {{siswa_tanggal_lahir}}</p>
<p><strong>Alamat:</strong> {{siswa_alamat}}</p>
<p><strong>No. Paspor:</strong> {{siswa_no_paspor}}</p>
<p><strong>Tujuan:</strong> {{perusahaan_nama}}</p>
<hr/>
<p>Tanggal Dibuat: {{tanggal_hari_ini}}</p>`,
          is_required: true,
          is_active: true,
          urutan: 1,
        },
        {
          kode: 'DOC-KONTRAK-001',
          nama: 'Surat Perjanjian Magang',
          kategori: 'kontrak',
          deskripsi: 'Surat perjanjian magang antara siswa dan LPK',
          template_content: `<h1 style="text-align: center;">SURAT PERJANJIAN MAGANG</h1>
<p>Yang bertanda tangan di bawah ini:</p>
<table>
<tr><td>Nama</td><td>: {{siswa_nama}}</td></tr>
<tr><td>NIK</td><td>: {{siswa_nik}}</td></tr>
<tr><td>Alamat</td><td>: {{siswa_alamat}}</td></tr>
</table>
<p>Selanjutnya disebut <strong>PIHAK PERTAMA</strong></p>
<p>Dan</p>
<table>
<tr><td>Nama LPK</td><td>: {{lpk_nama}}</td></tr>
<tr><td>Alamat</td><td>: {{lpk_alamat}}</td></tr>
<tr><td>Direktur</td><td>: {{lpk_direktur}}</td></tr>
</table>
<p>Selanjutnya disebut <strong>PIHAK KEDUA</strong></p>
<hr/>
<p>Tanggal: {{tanggal_hari_ini}}</p>`,
          is_required: true,
          is_active: true,
          urutan: 2,
        },
        {
          kode: 'DOC-ADMIN-001',
          nama: 'Data Diri Lengkap',
          kategori: 'administrasi',
          deskripsi: 'Formulir data diri lengkap siswa',
          template_content: `<h1 style="text-align: center;">DATA DIRI LENGKAP PESERTA</h1>
<h3>個人情報</h3>
<table border="1" cellpadding="8" cellspacing="0" width="100%">
<tr><td width="30%">Nama / 名前</td><td>{{siswa_nama}}</td></tr>
<tr><td>NIK</td><td>{{siswa_nik}}</td></tr>
<tr><td>Tempat Lahir / 出生地</td><td>{{siswa_tempat_lahir}}</td></tr>
<tr><td>Tanggal Lahir / 生年月日</td><td>{{siswa_tanggal_lahir}} ({{siswa_tanggal_lahir_jp}})</td></tr>
<tr><td>Jenis Kelamin / 性別</td><td>{{siswa_jenis_kelamin}}</td></tr>
<tr><td>Alamat / 住所</td><td>{{siswa_alamat}}</td></tr>
<tr><td>Email</td><td>{{siswa_email}}</td></tr>
<tr><td>No. HP / 電話番号</td><td>{{siswa_no_hp}}</td></tr>
</table>`,
          is_required: true,
          is_active: true,
          urutan: 3,
        },
        {
          kode: 'DOC-KESEHATAN-001',
          nama: 'Surat Keterangan Sehat',
          kategori: 'kesehatan',
          deskripsi: 'Template surat keterangan sehat dari dokter',
          template_content: `<h1 style="text-align: center;">SURAT KETERANGAN SEHAT</h1>
<p>Yang bertanda tangan di bawah ini menerangkan bahwa:</p>
<table>
<tr><td>Nama</td><td>: {{siswa_nama}}</td></tr>
<tr><td>NIK</td><td>: {{siswa_nik}}</td></tr>
<tr><td>Tempat/Tanggal Lahir</td><td>: {{siswa_tempat_lahir}}, {{siswa_tanggal_lahir}}</td></tr>
</table>
<p>Dinyatakan dalam keadaan <strong>SEHAT JASMANI DAN ROHANI</strong>.</p>
<p>Demikian surat keterangan ini dibuat untuk keperluan pengajuan visa magang ke Jepang.</p>
<br/>
<p style="text-align: right;">{{tanggal_hari_ini}}</p>`,
          is_required: true,
          is_active: true,
          urutan: 4,
        },
        {
          kode: 'DOC-PENDIDIKAN-001',
          nama: 'Surat Keterangan Lulus',
          kategori: 'pendidikan',
          deskripsi: 'Template surat keterangan kelulusan pendidikan',
          template_content: `<h1 style="text-align: center;">SURAT KETERANGAN LULUS</h1>
<p>Dengan ini menerangkan bahwa:</p>
<table>
<tr><td>Nama</td><td>: {{siswa_nama}}</td></tr>
<tr><td>NIK</td><td>: {{siswa_nik}}</td></tr>
<tr><td>Program</td><td>: {{program_nama}}</td></tr>
</table>
<p>Telah menyelesaikan pendidikan dan pelatihan di LPK kami.</p>`,
          is_required: false,
          is_active: true,
          urutan: 5,
        },
      ];
      documentTemplateData.forEach(dt => documentTemplatesTable.create(dt));
      console.log('Seeded document templates:', documentTemplateData.length);
    }

    // Seed Document Variables
    const docVariables = documentVariablesTable.getAll();
    if (docVariables.length === 0) {
      const documentVariableData = [
        // Siswa variables
        { nama: 'siswa_nama', display_name: 'Nama Lengkap Siswa', kategori: 'siswa', source_table: 'siswa', source_field: 'nama', format_type: 'text', is_active: true },
        { nama: 'siswa_nama_upper', display_name: 'Nama Siswa (Kapital)', kategori: 'siswa', source_table: 'siswa', source_field: 'nama', format_type: 'uppercase', is_active: true },
        { nama: 'siswa_nik', display_name: 'NIK Siswa', kategori: 'siswa', source_table: 'siswa', source_field: 'nik', format_type: 'text', is_active: true },
        { nama: 'siswa_tempat_lahir', display_name: 'Tempat Lahir', kategori: 'siswa', source_table: 'siswa', source_field: 'tempat_lahir', format_type: 'text', is_active: true },
        { nama: 'siswa_tanggal_lahir', display_name: 'Tanggal Lahir', kategori: 'siswa', source_table: 'siswa', source_field: 'tanggal_lahir', format_type: 'date', is_active: true },
        { nama: 'siswa_tanggal_lahir_jp', display_name: 'Tanggal Lahir (JP)', kategori: 'siswa', source_table: 'siswa', source_field: 'tanggal_lahir', format_type: 'date_jp', is_active: true },
        { nama: 'siswa_alamat', display_name: 'Alamat Siswa', kategori: 'siswa', source_table: 'siswa', source_field: 'alamat', format_type: 'text', is_active: true },
        { nama: 'siswa_jenis_kelamin', display_name: 'Jenis Kelamin', kategori: 'siswa', source_table: 'siswa', source_field: 'jenis_kelamin', format_type: 'text', is_active: true },
        { nama: 'siswa_no_paspor', display_name: 'Nomor Paspor', kategori: 'siswa', source_table: 'siswa', source_field: 'no_paspor', format_type: 'text', is_active: true },
        { nama: 'siswa_email', display_name: 'Email Siswa', kategori: 'siswa', source_table: 'siswa', source_field: 'email', format_type: 'text', is_active: true },
        { nama: 'siswa_no_hp', display_name: 'No. HP Siswa', kategori: 'siswa', source_table: 'siswa', source_field: 'no_hp', format_type: 'phone', is_active: true },
        
        // Perusahaan variables
        { nama: 'perusahaan_nama', display_name: 'Nama Perusahaan', kategori: 'perusahaan', source_table: 'perusahaan', source_field: 'nama', format_type: 'text', is_active: true },
        { nama: 'perusahaan_alamat', display_name: 'Alamat Perusahaan', kategori: 'perusahaan', source_table: 'perusahaan', source_field: 'alamat', format_type: 'text', is_active: true },
        { nama: 'perusahaan_telepon', display_name: 'Telepon Perusahaan', kategori: 'perusahaan', source_table: 'perusahaan', source_field: 'telepon', format_type: 'phone', is_active: true },
        
        // Kumiai variables
        { nama: 'kumiai_nama', display_name: 'Nama Kumiai', kategori: 'kumiai', source_table: 'kumiai', source_field: 'nama', format_type: 'text', is_active: true },
        { nama: 'kumiai_alamat', display_name: 'Alamat Kumiai', kategori: 'kumiai', source_table: 'kumiai', source_field: 'alamat', format_type: 'text', is_active: true },
        
        // Program variables
        { nama: 'program_nama', display_name: 'Nama Program', kategori: 'program', source_table: 'program', source_field: 'nama', format_type: 'text', is_active: true },
        { nama: 'program_durasi', display_name: 'Durasi Program', kategori: 'program', source_table: 'program', source_field: 'durasi', format_type: 'number', is_active: true },
        
        // LPK variables
        { nama: 'lpk_nama', display_name: 'Nama LPK', kategori: 'lpk', source_table: 'lpk_profile', source_field: 'nama_lpk', format_type: 'text', is_active: true },
        { nama: 'lpk_alamat', display_name: 'Alamat LPK', kategori: 'lpk', source_table: 'lpk_profile', source_field: 'alamat', format_type: 'text', is_active: true },
        { nama: 'lpk_direktur', display_name: 'Direktur LPK', kategori: 'lpk', source_table: 'lpk_profile', source_field: 'nama_direktur', format_type: 'text', is_active: true },
        
        // System variables
        { nama: 'tanggal_hari_ini', display_name: 'Tanggal Hari Ini', kategori: 'sistem', source_table: '_system', source_field: 'current_date', format_type: 'date', is_active: true },
        { nama: 'tanggal_hari_ini_jp', display_name: 'Tanggal Hari Ini (JP)', kategori: 'sistem', source_table: '_system', source_field: 'current_date', format_type: 'date_jp', is_active: true },
        { nama: 'tahun_sekarang', display_name: 'Tahun Sekarang', kategori: 'sistem', source_table: '_system', source_field: 'current_year', format_type: 'text', is_active: true },
      ];
      documentVariableData.forEach(dv => documentVariablesTable.create(dv));
      console.log('Seeded document variables:', documentVariableData.length);
    }

    console.log('Default data seeding completed successfully');
  }
