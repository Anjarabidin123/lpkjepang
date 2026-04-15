import { FastifyInstance } from 'fastify';
import { 
  getUsers, createUser,
  getRoles, createRole,
  getPermissions
} from '../controllers/system.controller.ts';
import { checkPermission } from '../hooks/rbac.hook.ts';

export default async function systemRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);

  // Users
  fastify.get('/users', { preHandler: [checkPermission('user_management_manage')] }, getUsers);
  fastify.post('/users', { preHandler: [checkPermission('user_management_manage')] }, createUser);

  // Roles
  fastify.get('/roles', { preHandler: [checkPermission('role_management_manage')] }, getRoles);
  fastify.post('/roles', { preHandler: [checkPermission('role_management_manage')] }, createRole);

  // Permissions
  fastify.get('/permissions', { preHandler: [checkPermission('system_management_manage')] }, getPermissions);
}
