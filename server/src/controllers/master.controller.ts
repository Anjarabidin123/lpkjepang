import { FastifyRequest, FastifyReply } from 'fastify';

// KUMIAI
export const getKumiais = async (request: FastifyRequest, reply: FastifyReply) => {
  return await request.server.prisma.kumiai.findMany({
    include: { perusahaans: true }
  });
};

export const createKumiai = async (request: FastifyRequest, reply: FastifyReply) => {
  const data = request.body as any;
  const result = await request.server.prisma.kumiai.create({ data });
  return reply.status(201).send(result);
};

// PERUSAHAAN
export const getPerusahaans = async (request: FastifyRequest, reply: FastifyReply) => {
  return await request.server.prisma.perusahaan.findMany({
    include: { kumiai: true }
  });
};

export const createPerusahaan = async (request: FastifyRequest, reply: FastifyReply) => {
  const data = request.body as any;
  const result = await request.server.prisma.perusahaan.create({ data });
  return reply.status(201).send(result);
};

// PROGRAM
export const getPrograms = async (request: FastifyRequest, reply: FastifyReply) => {
  return await request.server.prisma.program.findMany();
};

export const createProgram = async (request: FastifyRequest, reply: FastifyReply) => {
  const data = request.body as any;
  const result = await request.server.prisma.program.create({ data });
  return reply.status(201).send(result);
};

// LPK MITRA
export const getLpkMitras = async (request: FastifyRequest, reply: FastifyReply) => {
  return await request.server.prisma.lpkMitra.findMany();
};

export const createLpkMitra = async (request: FastifyRequest, reply: FastifyReply) => {
  const data = request.body as any;
  const result = await request.server.prisma.lpkMitra.create({ data });
  return reply.status(201).send(result);
};

// JOB ORDER
export const getJobOrders = async (request: FastifyRequest, reply: FastifyReply) => {
  return await request.server.prisma.jobOrder.findMany({
    include: {
      kumiai: true,
      perusahaan: true,
      program: true,
      peserta: true
    }
  });
};

// SISWA MAGANG
export const getSiswaMagangs = async (request: FastifyRequest, reply: FastifyReply) => {
  return await request.server.prisma.siswaMagang.findMany({
    include: {
      siswa: true
    }
  });
};

// DEMOGRAFI
export const getProvinces = async (request: FastifyRequest, reply: FastifyReply) => {
  return await request.server.prisma.demografiProvince.findMany();
};

export const getRegencies = async (request: FastifyRequest, reply: FastifyReply) => {
  const { province_id } = request.query as any;
  const where = province_id ? { provinceId: parseInt(province_id) } : {};
  return await request.server.prisma.demografiRegency.findMany({ where });
};

// JENIS KERJA
export const getJenisKerjas = async (request: FastifyRequest) => {
  return await request.server.prisma.jenisKerja.findMany();
};

// POSISI KERJA
export const getPosisiKerjas = async (request: FastifyRequest) => {
  return await request.server.prisma.posisiKerja.findMany({
    include: { perusahaan: true, jenisKerja: true }
  });
};

// PROFIL LPK
export const getProfilLpk = async (request: FastifyRequest) => {
  return await request.server.prisma.profilLpk.findFirst();
};

export const updateProfilLpk = async (request: FastifyRequest) => {
  const data = request.body as any;
  const profil = await request.server.prisma.profilLpk.findFirst();
  if (profil) {
    return await request.server.prisma.profilLpk.update({
      where: { id: profil.id },
      data
    });
  }
  return await request.server.prisma.profilLpk.create({ data });
};

export const getPublicStats = async (request: FastifyRequest) => {
  const prisma = request.server.prisma;
  const [siswa, kumiai, magang] = await Promise.all([
    prisma.siswa.count(),
    prisma.kumiai.count(),
    prisma.siswaMagang.count()
  ]);
  return {
    siswa_count: siswa,
    kumiai_count: kumiai,
    magang_count: magang
  };
};
