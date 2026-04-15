import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Import local modules
import decorators from './plugins/decorators.ts';
import authRoutes from './routes/auth.routes.ts';
import siswaRoutes from './routes/siswa.routes.ts';
import masterRoutes from './routes/master.routes.ts';
import financeRoutes from './routes/finance.routes.ts';
import educationRoutes from './routes/education.routes.ts';
import recruitmentRoutes from './routes/recruitment.routes.ts';
import documentRoutes from './routes/document.routes.ts';
import systemRoutes from './routes/system.routes.ts';
import reportRoutes from './routes/report.routes.ts';
import publicRoutes from './routes/public.routes.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const fastify = Fastify({
  logger: true,
});

const start = async () => {
  try {
    await fastify.register(cors, {
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    });

    await fastify.register(jwt, {
      secret: process.env.JWT_SECRET || 'super-secret-key-change-me',
    });

    fastify.decorate('prisma', prisma);
    
    await fastify.register(decorators);
    await fastify.register(authRoutes, { prefix: '/api' });
    await fastify.register(siswaRoutes, { prefix: '/api' });
    await fastify.register(masterRoutes, { prefix: '/api' });
    await fastify.register(financeRoutes, { prefix: '/api' });
    await fastify.register(educationRoutes, { prefix: '/api' });
    await fastify.register(recruitmentRoutes, { prefix: '/api' });
    await fastify.register(documentRoutes, { prefix: '/api' });
    await fastify.register(systemRoutes, { prefix: '/api' });
    await fastify.register(reportRoutes, { prefix: '/api' });
    await fastify.register(publicRoutes, { prefix: '/api' });

    fastify.get('/', async () => {
      return { 
        message: 'Welcome to orchids-lpkujc Modern Backend (Fastify)',
        version: '1.0.0',
        docs: '/api/docs'
      };
    });

    fastify.get('/health', async () => {
      return { status: 'OK', timestamp: new Date().toISOString() };
    });

    // Run the server
    const port = Number(process.env.PORT) || 3001;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Modern Backend (Fastify) running on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

// Extend FastifyInstance with Prisma
declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}
