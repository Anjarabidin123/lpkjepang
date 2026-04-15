import { FastifyInstance } from 'fastify';
import { getSiswas, createSiswa, getSiswa, updateSiswa, deleteSiswa,
  getSiswaKeluargaIndonesia, getSiswaKeluargaJepang,
  getSiswaKontakKeluarga, getSiswaPengalamanKerja, getSiswaPendidikan
} from '../controllers/siswa.controller.ts';
import { checkPermission } from '../hooks/rbac.hook.ts';

export default async function siswaRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.get('/siswa', { preHandler: [checkPermission('siswa_view')] }, getSiswas);
  fastify.post('/siswa', { preHandler: [checkPermission('siswa_create')] }, createSiswa);
  fastify.get('/siswa/:id', { preHandler: [checkPermission('siswa_view')] }, getSiswa);
  fastify.put('/siswa/:id', { preHandler: [checkPermission('siswa_access')] }, updateSiswa);
  fastify.delete('/siswa/:id', { preHandler: [checkPermission('siswa_access')] }, deleteSiswa);

  // Detail Siswa
  fastify.get('/siswa-keluarga-indonesia', { preHandler: [checkPermission('siswa_access')] }, getSiswaKeluargaIndonesia);
  fastify.get('/siswa-keluarga-jepang', { preHandler: [checkPermission('siswa_access')] }, getSiswaKeluargaJepang);
  fastify.get('/siswa-kontak-keluarga', { preHandler: [checkPermission('siswa_access')] }, getSiswaKontakKeluarga);
  fastify.get('/siswa-pengalaman-kerja', { preHandler: [checkPermission('siswa_access')] }, getSiswaPengalamanKerja);
  fastify.get('/siswa-pendidikan', { preHandler: [checkPermission('siswa_access')] }, getSiswaPendidikan);
}
