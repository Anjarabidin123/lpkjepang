import { FastifyInstance } from 'fastify';
import { 
  getRecruitmentApplications, createRecruitmentApplication,
  getTasks, createTask
} from '../controllers/recruitment.controller.ts';
import { checkPermission } from '../hooks/rbac.hook.ts';

export default async function recruitmentRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);

  // Recruitment
  fastify.get('/recruitment', { preHandler: [checkPermission('recruitment_access')] }, getRecruitmentApplications);
  fastify.post('/recruitment', { preHandler: [checkPermission('recruitment_access')] }, createRecruitmentApplication);

  // Stats (Used by dashboard)
  fastify.get('/recruitment/stats', { preHandler: [checkPermission('recruitment_access')] }, async (request) => {
    const total = await fastify.prisma.recruitmentApplication.count();
    const newApps = await fastify.prisma.recruitmentApplication.count({ where: { status: 'new' } });
    return { total, newApps };
  });

  // Tasks
  fastify.get('/tasks', { preHandler: [checkPermission('task_access')] }, getTasks);
  fastify.post('/tasks', { preHandler: [checkPermission('task_access')] }, createTask);
  
  // Task Stats
  fastify.get('/tasks/stats', { preHandler: [checkPermission('task_access')] }, async () => {
    const total = await fastify.prisma.task.count();
    const pending = await fastify.prisma.task.count({ where: { status: 'pending' } });
    return { total, pending };
  });
}
