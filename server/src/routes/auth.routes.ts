import { FastifyInstance } from 'fastify';
import { loginHandler, meHandler } from '../controllers/auth.controller.ts';

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/login', loginHandler);
  
  fastify.get('/user', {
    onRequest: [fastify.authenticate]
  }, meHandler);
}
