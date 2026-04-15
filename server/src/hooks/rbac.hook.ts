import { FastifyReply, FastifyRequest } from 'fastify';

export const checkPermission = (permission: string) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as { roles: string[] };
    
    // Super admin bypass
    if (user.roles.includes('super_admin')) {
      return;
    }

    // Check permissions from DB
    const dbUser = await request.server.prisma.user.findUnique({
      where: { id: (user as any).id },
      include: { roles: { include: { permissions: true } } },
    });

    if (!dbUser) {
      return reply.status(401).send({ message: 'User tidak ditemukan' });
    }

    const hasPerm = dbUser.roles.some(role => 
      role.permissions.some(p => p.name === permission)
    );

    if (!hasPerm) {
      return reply.status(403).send({ message: 'Anda tidak memiliki hak akses untuk aksi ini' });
    }
  };
};
