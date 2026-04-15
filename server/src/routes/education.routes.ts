import { FastifyInstance } from 'fastify';
import { 
  getAttendances, createAttendance,
  getGrades, createGrade,
  getSchedules, createSchedule,
  getLearningModules, createLearningModule
} from '../controllers/education.controller.ts';
import { checkPermission } from '../hooks/rbac.hook.ts';

export default async function educationRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);

  // Attendance
  fastify.get('/education/attendance', { preHandler: [checkPermission('education_access')] }, getAttendances);
  fastify.post('/education/attendance', { preHandler: [checkPermission('education_access')] }, createAttendance);

  // Grades
  fastify.get('/education/grades', { preHandler: [checkPermission('education_access')] }, getGrades);
  fastify.post('/education/grades', { preHandler: [checkPermission('education_access')] }, createGrade);

  // Schedules
  fastify.get('/education/schedules', { preHandler: [checkPermission('education_access')] }, getSchedules);
  fastify.post('/education/schedules', { preHandler: [checkPermission('education_access')] }, createSchedule);

  // Learning Modules
  fastify.get('/learning-modules', { preHandler: [checkPermission('education_access')] }, getLearningModules);
  fastify.post('/learning-modules', { preHandler: [checkPermission('education_access')] }, createLearningModule);
}
