import { FastifyRequest, FastifyReply } from 'fastify';

// RECRUITMENT APPLICATIONS
export const getRecruitmentApplications = async (request: FastifyRequest) => {
  return await request.server.prisma.recruitmentApplication.findMany({
    include: { siswa: true, program: true, reviewedBy: true },
    orderBy: { applicationDate: 'desc' }
  });
};

export const createRecruitmentApplication = async (request: FastifyRequest, reply: FastifyReply) => {
  const data = request.body as any;
  const result = await request.server.prisma.recruitmentApplication.create({
    data: {
      ...data,
      applicationDate: new Date(data.applicationDate)
    }
  });
  return reply.status(201).send(result);
};

// TASKS
export const getTasks = async (request: FastifyRequest) => {
  return await request.server.prisma.task.findMany({
    include: { assignedTo: true, createdBy: true },
    orderBy: { dueDate: 'asc' }
  });
};

export const createTask = async (request: FastifyRequest, reply: FastifyReply) => {
  const data = request.body as any;
  const user = request.user as { id: number };
  const result = await request.server.prisma.task.create({
    data: {
      ...data,
      createdById: user.id,
      dueDate: data.dueDate ? new Date(data.dueDate) : null
    }
  });
  return reply.status(201).send(result);
};
