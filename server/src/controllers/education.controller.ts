import { FastifyRequest, FastifyReply } from 'fastify';

// ATTENDANCE
export const getAttendances = async (request: FastifyRequest) => {
  const { date, siswaId } = request.query as any;
  const where: any = {};
  if (date) where.date = new Date(date);
  if (siswaId) where.siswaId = parseInt(siswaId);
  
  return await request.server.prisma.studentAttendance.findMany({
    where,
    include: { siswa: true },
    orderBy: { date: 'desc' }
  });
};

export const createAttendance = async (request: FastifyRequest, reply: FastifyReply) => {
  const data = request.body as any;
  const result = await request.server.prisma.studentAttendance.upsert({
    where: {
      siswaId_date: {
        siswaId: data.siswaId,
        date: new Date(data.date)
      }
    },
    update: { status: data.status, notes: data.notes },
    create: { 
      siswaId: data.siswaId,
      date: new Date(data.date),
      status: data.status,
      notes: data.notes
    }
  });
  return reply.status(201).send(result);
};

// GRADES
export const getGrades = async (request: FastifyRequest) => {
  const { siswaId } = request.query as any;
  const where = siswaId ? { siswaId: parseInt(siswaId) } : {};
  
  return await request.server.prisma.studentGrade.findMany({
    where,
    include: { siswa: true },
    orderBy: { examDate: 'desc' }
  });
};

export const createGrade = async (request: FastifyRequest, reply: FastifyReply) => {
  const data = request.body as any;
  const result = await request.server.prisma.studentGrade.create({
    data: {
      ...data,
      examDate: new Date(data.examDate)
    }
  });
  return reply.status(201).send(result);
};

// CLASS SCHEDULES
export const getSchedules = async (request: FastifyRequest) => {
  return await request.server.prisma.classSchedule.findMany({
    where: { isActive: true },
    orderBy: { dayOfWeek: 'asc' }
  });
};

export const createSchedule = async (request: FastifyRequest, reply: FastifyReply) => {
  const data = request.body as any;
  const result = await request.server.prisma.classSchedule.create({ data });
  return reply.status(201).send(result);
};

// LEARNING MODULES
export const getLearningModules = async (request: FastifyRequest) => {
  return await request.server.prisma.learningModule.findMany({
    include: { author: true }
  });
};

export const createLearningModule = async (request: FastifyRequest, reply: FastifyReply) => {
  const data = request.body as any;
  const user = request.user as { id: number };
  const result = await request.server.prisma.learningModule.create({
    data: {
      ...data,
      authorId: user.id
    }
  });
  return reply.status(201).send(result);
};
