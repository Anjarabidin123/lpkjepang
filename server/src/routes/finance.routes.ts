import { FastifyInstance } from 'fastify';
import { 
  getArusKas, createArusKas,
  getKategoriPemasukan, createKategoriPemasukan,
  getPemasukan, createPemasukan,
  getKategoriPengeluaran, createKategoriPengeluaran,
  getPengeluaran, createPengeluaran,
  getInvoices, getInvoice,
  getItemPembayaran, createItemPembayaran,
  getInternalPayments, createInternalPayment,
  getKewajibanPembayaran
} from '../controllers/finance.controller.ts';
import { checkPermission } from '../hooks/rbac.hook.ts';

export default async function financeRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);

  // Arus Kas
  fastify.get('/arus-kas', { preHandler: [checkPermission('finance_access')] }, getArusKas);
  fastify.post('/arus-kas', { preHandler: [checkPermission('finance_access')] }, createArusKas);

  // Kategori Pemasukan
  fastify.get('/kategori-pemasukan', { preHandler: [checkPermission('finance_access')] }, getKategoriPemasukan);
  fastify.post('/kategori-pemasukan', { preHandler: [checkPermission('finance_access')] }, createKategoriPemasukan);

  // Pemasukan
  fastify.get('/pemasukan', { preHandler: [checkPermission('finance_access')] }, getPemasukan);
  fastify.post('/pemasukan', { preHandler: [checkPermission('finance_access')] }, createPemasukan);

  // Kategori Pengeluaran
  fastify.get('/kategori-pengeluaran', { preHandler: [checkPermission('finance_access')] }, getKategoriPengeluaran);
  fastify.post('/kategori-pengeluaran', { preHandler: [checkPermission('finance_access')] }, createKategoriPengeluaran);

  // Pengeluaran
  fastify.get('/pengeluaran', { preHandler: [checkPermission('finance_access')] }, getPengeluaran);
  fastify.post('/pengeluaran', { preHandler: [checkPermission('finance_access')] }, createPengeluaran);

  // Invoices
  fastify.get('/invoices', { preHandler: [checkPermission('finance_access')] }, getInvoices);
  fastify.get('/invoices/:id', { preHandler: [checkPermission('finance_access')] }, getInvoice);

  // Item Pembayaran
  fastify.get('/item-pembayaran', { preHandler: [checkPermission('finance_access')] }, getItemPembayaran);
  fastify.post('/item-pembayaran', { preHandler: [checkPermission('finance_access')] }, createItemPembayaran);

  // Internal Payment
  fastify.get('/internal-payments', { preHandler: [checkPermission('finance_access')] }, getInternalPayments);
  fastify.post('/internal-payments', { preHandler: [checkPermission('finance_access')] }, createInternalPayment);

  // Kewajiban Pembayaran
  fastify.get('/kewajiban-pembayaran', { preHandler: [checkPermission('finance_access')] }, getKewajibanPembayaran);
}
