import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seeding...');

  // 1. Permissions
  const legacyAccess = [
    { name: 'siswa_access', description: 'Akses utama Modul Siswa & Rekrutmen' },
    { name: 'finance_access', description: 'Akses utama Modul Keuangan (Transaksi, Arus Kas, Invoice)' },
    { name: 'master_access', description: 'Akses utama Modul Master Data Utama' },
    { name: 'report_access', description: 'Akses utama Modul Laporan & Monitoring KPI' },
    { name: 'task_access', description: 'Akses utama Modul Tugas/Task' },
    { name: 'recruitment_access', description: 'Akses utama Modul Rekrutmen' },
    { name: 'document_access', description: 'Akses utama Modul Manajemen Dokumen' },
    { name: 'education_access', description: 'Akses utama Modul Pendidikan & Magang' },
  ];

  for (const perm of legacyAccess) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: { description: perm.description },
      create: { name: perm.name, description: perm.description },
    });
  }

  const actions = ['view', 'create', 'update', 'delete', 'manage'];
  const modules = [
    'siswa', 'kumiai', 'perusahaan', 'lpk_mitra', 'program', 'jenis_kerja', 'posisi_kerja', 'siswa_magang',
    'education', 'absensi', 'nilai', 'materi',
    'job_order', 'tugas', 'rekrutmen', 'monitoring', 'dashboard',
    'internal_payment', 'invoice', 'arus_kas', 'pengaturan', 'laporan_keuangan',
    'user_management', 'role_management', 'system_management', 'demografi'
  ];

  for (const module of modules) {
    for (const action of actions) {
      const name = `${module}_${action}`;
      await prisma.permission.upsert({
        where: { name },
        update: {},
        create: { 
          name, 
          module, 
          action, 
          description: `${action.toUpperCase()} permission for ${module.replace('_', ' ')}` 
        },
      });
    }
  }

  // 2. Roles
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'super_admin' },
    update: {},
    create: {
      name: 'super_admin',
      description: 'Administrator dengan akses penuh seluruh sistem',
      isSystemRole: true,
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Staf Administrasi LPK',
    },
  });

  // 3. Demo Users
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  const demoUsers = [
    { email: 'superadmin@lpkujc.com', name: 'Super Admin', role: 'super_admin' },
    { email: 'admin@lpkujc.com', name: 'Admin Operasional', role: 'admin' },
    { email: 'finance@lpkujc.com', name: 'Staff Finance', role: 'admin' }, // Change as needed
    { email: 'instructor@lpkujc.com', name: 'Instruktur', role: 'admin' }, // Change as needed
  ];

  for (const user of demoUsers) {
    const roleObj = await prisma.role.findUnique({ where: { name: user.role } });
    if (!roleObj) continue;

    await prisma.user.upsert({
      where: { email: user.email },
      update: { password: hashedPassword },
      create: {
        email: user.email,
        name: user.name,
        password: hashedPassword,
        roles: {
          connect: { id: roleObj.id },
        },
      },
    });
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
