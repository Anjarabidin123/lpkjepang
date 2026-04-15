import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

const siswaSchema = z.object({
  nama: z.string(),
  nik: z.string(),
  email: z.string().email().optional().nullable(),
  status: z.string().optional(),
  jenisKelamin: z.string().optional().nullable(),
  tanggalLahir: z.string().optional().nullable(),
  alamat: z.string().optional().nullable(),
  noHp: z.string().optional().nullable(),
  demografiProvinceId: z.number().optional().nullable(),
  demografiRegencyId: z.number().optional().nullable(),
});

export const getSiswas = async (request: FastifyRequest, reply: FastifyReply) => {
  const { search, status } = request.query as any;
  const user = request.user as { id: number, roles: string[] };
  
  const canManage = user.roles.includes('super_admin') || user.roles.includes('admin');

  const where: any = {};
  
  // IDOR protection
  if (!canManage && user.roles.includes('student')) {
    where.userId = user.id;
  }

  if (search && canManage) {
    where.OR = [
      { nama: { contains: search, mode: 'insensitive' } },
      { nik: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (status && status !== 'all' && canManage) {
    where.status = status;
  }

  const siswas = await request.server.prisma.siswa.findMany({
    where,
    include: {
      user: true,
      demografiProvince: true,
      demografiRegency: true,
    },
    orderBy: { nama: 'asc' },
  });

  return siswas;
};

export const createSiswa = async (request: FastifyRequest, reply: FastifyReply) => {
  const { 
    keluarga_indonesia, keluarga_jepang, kontak_keluarga, 
    pengalaman_kerja, pendidikan, ...data 
  } = request.body as any;

  const result = await request.server.prisma.$transaction(async (tx) => {
    const siswa = await tx.siswa.create({
      data: {
        ...data,
        tanggalLahir: data.tanggalLahir ? new Date(data.tanggalLahir) : null,
      }
    });

    if (keluarga_indonesia) {
      const filtered = keluarga_indonesia.filter((k: any) => k.nama);
      if (filtered.length > 0) {
        await tx.siswaKeluargaIndonesia.createMany({
          data: filtered.map((k: any) => ({ ...k, siswaId: siswa.id }))
        });
      }
    }
    if (keluarga_jepang) {
      const filtered = keluarga_jepang.filter((k: any) => k.nama);
      if (filtered.length > 0) {
        await tx.siswaKeluargaJepang.createMany({
          data: filtered.map((k: any) => ({ ...k, siswaId: siswa.id }))
        });
      }
    }
    if (kontak_keluarga) {
      const filtered = kontak_keluarga.filter((k: any) => k.nama);
      if (filtered.length > 0) {
        await tx.siswaKontakKeluarga.createMany({
          data: filtered.map((k: any) => ({ ...k, siswaId: siswa.id }))
        });
      }
    }
    if (pengalaman_kerja) {
      const filtered = pengalaman_kerja.filter((k: any) => k.nama_perusahaan || k.namaPerusahaan);
      if (filtered.length > 0) {
        await tx.siswaPengalamanKerja.createMany({
          data: filtered.map((k: any) => ({
            namaPerusahaan: k.nama_perusahaan || k.namaPerusahaan,
            jenisPekerjaan: k.jenis_pekerjaan || k.jenisPekerjaan,
            tahunMasuk: k.tahun_masuk || k.tahunMasuk,
            tahunKeluar: k.tahun_keluar || k.tahunKeluar,
            siswaId: siswa.id
          }))
        });
      }
    }
    if (pendidikan) {
      const filtered = pendidikan.filter((k: any) => k.nama_institusi || k.namaInstitusi);
      if (filtered.length > 0) {
        await tx.siswaPendidikan.createMany({
          data: filtered.map((k: any) => ({
            jenjangPendidikan: k.jenjang_pendidikan || k.jenjangPendidikan,
            namaInstitusi: k.nama_institusi || k.namaInstitusi,
            jurusan: k.jurusan,
            tahunMasuk: k.tahun_masuk || k.tahunMasuk,
            tahunLulus: k.tahun_lulus || k.tahunLulus,
            siswaId: siswa.id
          }))
        });
      }
    }

    return siswa;
  }, { timeout: 10000 });

  return reply.status(201).send(result);
};

export const getSiswa = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const user = request.user as { id: number, roles: string[] };

  const siswa = await request.server.prisma.siswa.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: true,
      demografiProvince: true,
      demografiRegency: true,
      keluargaIndonesia: true,
      keluargaJepang: true,
      kontakKeluarga: true,
      pengalamanKerja: true,
      pendidikan: true
    },
  });

  if (!siswa) return reply.status(404).send({ message: 'Siswa tidak ditemukan' });

  // IDOR check
  const canManage = user.roles.includes('super_admin') || user.roles.includes('admin') || user.roles.includes('staff');
  if (!canManage && siswa.userId !== user.id) {
    return reply.status(403).send({ message: 'Unauthorized' });
  }

  return siswa;
};

export const updateSiswa = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const { 
    keluarga_indonesia, keluarga_jepang, kontak_keluarga, 
    pengalaman_kerja, pendidikan, ...data 
  } = request.body as any;

  const result = await request.server.prisma.$transaction(async (tx) => {
    const siswa = await tx.siswa.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        tanggalLahir: data.tanggalLahir ? new Date(data.tanggalLahir) : undefined,
      },
    });

    if (keluarga_indonesia) {
      await tx.siswaKeluargaIndonesia.deleteMany({ where: { siswaId: siswa.id } });
      const filtered = keluarga_indonesia.filter((k: any) => k.nama);
      if (filtered.length > 0) {
        await tx.siswaKeluargaIndonesia.createMany({
          data: filtered.map((k: any) => ({ ...k, siswaId: siswa.id }))
        });
      }
    }
    if (keluarga_jepang) {
      await tx.siswaKeluargaJepang.deleteMany({ where: { siswaId: siswa.id } });
      const filtered = keluarga_jepang.filter((k: any) => k.nama);
      if (filtered.length > 0) {
        await tx.siswaKeluargaJepang.createMany({
          data: filtered.map((k: any) => ({ ...k, siswaId: siswa.id }))
        });
      }
    }
    if (kontak_keluarga) {
      await tx.siswaKontakKeluarga.deleteMany({ where: { siswaId: siswa.id } });
      const filtered = kontak_keluarga.filter((k: any) => k.nama);
      if (filtered.length > 0) {
        await tx.siswaKontakKeluarga.createMany({
          data: filtered.map((k: any) => ({ ...k, siswaId: siswa.id }))
        });
      }
    }
    if (pengalaman_kerja) {
      await tx.siswaPengalamanKerja.deleteMany({ where: { siswaId: siswa.id } });
      const filtered = pengalaman_kerja.filter((k: any) => k.nama_perusahaan || k.namaPerusahaan);
      if (filtered.length > 0) {
        await tx.siswaPengalamanKerja.createMany({
          data: filtered.map((k: any) => ({
            namaPerusahaan: k.nama_perusahaan || k.namaPerusahaan,
            jenisPekerjaan: k.jenis_pekerjaan || k.jenisPekerjaan,
            tahunMasuk: k.tahun_masuk || k.tahunMasuk,
            tahunKeluar: k.tahun_keluar || k.tahunKeluar,
            siswaId: siswa.id
          }))
        });
      }
    }
    if (pendidikan) {
      await tx.siswaPendidikan.deleteMany({ where: { siswaId: siswa.id } });
      const filtered = pendidikan.filter((k: any) => k.nama_institusi || k.namaInstitusi);
      if (filtered.length > 0) {
        await tx.siswaPendidikan.createMany({
          data: filtered.map((k: any) => ({
            jenjangPendidikan: k.jenjang_pendidikan || k.jenjangPendidikan,
            namaInstitusi: k.nama_institusi || k.namaInstitusi,
            jurusan: k.jurusan,
            tahunMasuk: k.tahun_masuk || k.tahunMasuk,
            tahunLulus: k.tahun_lulus || k.tahunLulus,
            siswaId: siswa.id
          }))
        });
      }
    }

    return siswa;
  }, { timeout: 10000 });

  return result;
};

export const deleteSiswa = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  await request.server.prisma.siswa.delete({
    where: { id: parseInt(id) },
  });
  return reply.status(204).send();
};

// SISWA RELATED DATA (SUB-RESOURCES)
export const getSiswaKeluargaIndonesia = async (request: FastifyRequest) => {
  const { siswa_id } = request.query as any;
  return await request.server.prisma.siswaKeluargaIndonesia.findMany({
    where: siswa_id ? { siswaId: parseInt(siswa_id) } : {}
  });
};

export const getSiswaKeluargaJepang = async (request: FastifyRequest) => {
  const { siswa_id } = request.query as any;
  return await request.server.prisma.siswaKeluargaJepang.findMany({
    where: siswa_id ? { siswaId: parseInt(siswa_id) } : {}
  });
};

export const getSiswaKontakKeluarga = async (request: FastifyRequest) => {
  const { siswa_id } = request.query as any;
  return await request.server.prisma.siswaKontakKeluarga.findMany({
    where: siswa_id ? { siswaId: parseInt(siswa_id) } : {}
  });
};

export const getSiswaPengalamanKerja = async (request: FastifyRequest) => {
  const { siswa_id } = request.query as any;
  return await request.server.prisma.siswaPengalamanKerja.findMany({
    where: siswa_id ? { siswaId: parseInt(siswa_id) } : {}
  });
};

export const getSiswaPendidikan = async (request: FastifyRequest) => {
  const { siswa_id } = request.query as any;
  return await request.server.prisma.siswaPendidikan.findMany({
    where: siswa_id ? { siswaId: parseInt(siswa_id) } : {}
  });
};
