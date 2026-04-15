import { 
  getStats, getAvailableReports, getKPIData
} from '../controllers/report.controller.ts';
import { checkPermission } from '../hooks/rbac.hook.ts';

export default async function reportRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.get('/reports/stats', { preHandler: [checkPermission('report_access')] }, getStats);
  fastify.get('/reports/available', { preHandler: [checkPermission('report_access')] }, getAvailableReports);
  fastify.get('/monitoring/kpi', { preHandler: [checkPermission('report_access')] }, getKPIData);
}
