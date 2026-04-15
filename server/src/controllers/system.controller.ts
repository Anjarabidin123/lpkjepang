import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';

// USERS
export const getUsers = async (request: FastifyRequest) => {
  return await request.server.prisma.user.findMany({
    include: { roles: true }
  });
};

export const createUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const { name, email, password, roles } = request.body as any;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const result = await request.server.prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      roles: roles ? { connect: roles.map((id: number) => ({ id })) } : undefined
    }
  });
  return reply.status(201).send(result);
};

// ROLES
export const getRoles = async (request: FastifyRequest) => {
  return await request.server.prisma.role.findMany({
    include: { permissions: true }
  });
};

export const createRole = async (request: FastifyRequest, reply: FastifyReply) => {
  const data = request.body as any;
  const result = await request.server.prisma.role.create({ data });
  return reply.status(201).send(result);
};

// PERMISSIONS
export const getPermissions = async (request: FastifyRequest) => {
  return await request.server.prisma.permission.findMany();
};
