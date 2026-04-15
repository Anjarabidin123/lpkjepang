import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const loginHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email, password } = loginSchema.parse(request.body);

  const user = await request.server.prisma.user.findUnique({
    where: { email },
    include: { roles: { include: { permissions: true } } },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return reply.status(401).send({ message: 'Email atau password salah' });
  }

  const token = request.server.jwt.sign({ 
    id: user.id, 
    email: user.email,
    roles: user.roles.map(r => r.name)
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
    },
    access_token: token,
  };
};

export const meHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const decoded = request.user as { id: number };
  
  const user = await request.server.prisma.user.findUnique({
    where: { id: decoded.id },
    include: { roles: { include: { permissions: true } } },
  });

  if (!user) {
    return reply.status(404).send({ message: 'User tidak ditemukan' });
  }

  return { user };
};
