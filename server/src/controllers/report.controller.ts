import { FastifyRequest, FastifyReply } from 'fastify';

export const getStats = async (request: FastifyRequest) => {
  const prisma = request.server.prisma;

  const [
    siswaCount,
    jobOrderCount,
    programCount,
    maganCount,
    kumiaiCount,
    perusahaanCount
  ] = await Promise.all([
    prisma.siswa.count(),
    prisma.jobOrder.count(),
    prisma.program.count(),
    prisma.siswaMagang.count(),
    prisma.kumiai.count(),
    prisma.perusahaan.count()
  ]);

  return {
    siswa: siswaCount,
    job_orders: jobOrderCount,
    programs: programCount,
    magang: maganCount,
    kumiai: kumiaiCount,
    perusahaan: perusahaanCount,
    // Add more dashboard stats as needed
    revenue: 0, 
    active_tasks: 0
  };
};

export const getAvailableReports = async (request: FastifyRequest) => {
  return [
    { id: 'siswa', name: 'Laporan Data Siswa', category: 'Siswa' },
    { id: 'finance', name: 'Laporan Arus Kas', category: 'Finance' },
    { id: 'magang', name: 'Laporan Siswa Magang', category: 'Pendidikan' }
  ];
};

export const getKPIData = async (request: FastifyRequest) => {
  // Simple KPI data for now
  return {
    success_rate: 85,
    on_time_departure: 90,
    active_students: await request.server.prisma.siswa.count({ where: { status: 'Aktif' } })
  };
};
