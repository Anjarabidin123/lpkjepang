import { FastifyInstance } from 'fastify';
import { 
  getKumiais, createKumiai,
  getPerusahaans, createPerusahaan,
  getPrograms, createProgram,
  getLpkMitras, createLpkMitra,
  getJobOrders,
  getSiswaMagangs,
  getProvinces, getRegencies,
  getJenisKerjas, getPosisiKerjas,
  getProfilLpk, updateProfilLpk, getPublicStats
} from '../controllers/master.controller.ts';
import { checkPermission } from '../hooks/rbac.hook.ts';

export default async function masterRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);

  // Kumiai
  fastify.get('/kumiai', { preHandler: [checkPermission('master_access')] }, getKumiais);
  fastify.post('/kumiai', { preHandler: [checkPermission('master_access')] }, createKumiai);

  // Perusahaan
  fastify.get('/perusahaan', { preHandler: [checkPermission('master_access')] }, getPerusahaans);
  fastify.post('/perusahaan', { preHandler: [checkPermission('master_access')] }, createPerusahaan);

  // Program
  fastify.get('/programs', { preHandler: [checkPermission('master_access')] }, getPrograms);
  fastify.post('/programs', { preHandler: [checkPermission('master_access')] }, createProgram);

  // LPK Mitra
  fastify.get('/lpk-mitra', { preHandler: [checkPermission('master_access')] }, getLpkMitras);
  fastify.post('/lpk-mitra', { preHandler: [checkPermission('master_access')] }, createLpkMitra);

  // Job Order
  fastify.get('/job-orders', { preHandler: [checkPermission('siswa_access')] }, getJobOrders);

  // Siswa Magang
  fastify.get('/siswa-magang', { preHandler: [checkPermission('siswa_access')] }, getSiswaMagangs);

  // Miscellaneous Master Data
  fastify.get('/jenis-kerja', { preHandler: [checkPermission('master_access')] }, getJenisKerjas);
  fastify.get('/posisi-kerja', { preHandler: [checkPermission('master_access')] }, getPosisiKerjas);
  fastify.get('/profil-lpk', { preHandler: [checkPermission('master_access')] }, getProfilLpk);
  fastify.post('/profil-lpk', { preHandler: [checkPermission('master_access')] }, updateProfilLpk);
}
