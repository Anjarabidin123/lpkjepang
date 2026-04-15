import { FastifyInstance } from 'fastify';
import { 
  getProvinces, getRegencies, getPublicStats
} from '../controllers/master.controller.ts';

export default async function publicRoutes(fastify: FastifyInstance) {
  // NO fastify.authenticate hook here!
  
  fastify.get('/public/stats', getPublicStats);
  fastify.get('/demografi/provinces', getProvinces);
  fastify.get('/demografi/regencies', getRegencies);
}
