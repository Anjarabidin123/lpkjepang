import { FastifyRequest, FastifyReply } from 'fastify';

// DOCUMENT TRACKING
export const getDocumentTrackings = async (request: FastifyRequest) => {
  return await request.server.prisma.documentTracking.findMany({
    include: { siswa: true }
  });
};

export const updateDocumentTracking = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const data = request.body as any;
  const result = await request.server.prisma.documentTracking.update({
    where: { id: parseInt(id) },
    data: {
      ...data,
      passportExpiry: data.passportExpiry ? new Date(data.passportExpiry) : undefined,
      mcuDate: data.mcuDate ? new Date(data.mcuDate) : undefined,
      coeIssueDate: data.coeIssueDate ? new Date(data.coeIssueDate) : undefined,
      visaExpiry: data.visaExpiry ? new Date(data.visaExpiry) : undefined,
      departureDatetime: data.departureDatetime ? new Date(data.departureDatetime) : undefined,
    }
  });
  return result;
};

// DOCUMENT TEMPLATES
export const getDocumentTemplates = async (request: FastifyRequest) => {
  return await request.server.prisma.documentTemplate.findMany({
    orderBy: { urutan: 'asc' }
  });
};

export const createDocumentTemplate = async (request: FastifyRequest, reply: FastifyReply) => {
  const data = request.body as any;
  const result = await request.server.prisma.documentTemplate.create({ data });
  return reply.status(201).send(result);
};

// DOCUMENT VARIABLES
export const getDocumentVariables = async (request: FastifyRequest) => {
  return await request.server.prisma.documentVariable.findMany({
    where: { isActive: true }
  });
};

// SISWA DOCUMENTS
export const getSiswaDocuments = async (request: FastifyRequest) => {
  const { siswaMagangId } = request.query as any;
  const where = siswaMagangId ? { siswaMagangId: parseInt(siswaMagangId) } : {};
  return await request.server.prisma.siswaDocument.findMany({
    where,
    include: { documentTemplate: true }
  });
};

export const createSiswaDocument = async (request: FastifyRequest, reply: FastifyReply) => {
  const data = request.body as any;
  const result = await request.server.prisma.siswaDocument.create({ data });
  return reply.status(201).send(result);
};

export const initializeDocuments = async (request: FastifyRequest) => {
  const { siswa_magang_id } = request.body as any;
  const prisma = request.server.prisma;

  const requiredTemplates = await prisma.documentTemplate.findMany({
    where: { isRequired: true, isActive: true }
  });

  let count = 0;
  for (const template of requiredTemplates) {
    const exists = await prisma.siswaDocument.findFirst({
      where: {
        siswaMagangId: parseInt(siswa_magang_id),
        documentTemplateId: template.id
      }
    });

    if (!exists) {
      await prisma.siswaDocument.create({
        data: {
          siswaMagangId: parseInt(siswa_magang_id),
          documentTemplateId: template.id,
          nama: template.nama,
          status: 'pending',
          keterangan: 'Dokumen wajib diinisialisasi otomatis'
        }
      });
      count++;
    }
  }

  return { message: 'Initialization complete', created: count };
};

export const downloadDocument = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const doc = await request.server.prisma.siswaDocument.findUnique({
    where: { id: parseInt(id) },
    include: { siswaMagang: { include: { siswa: true } } }
  });

  if (!doc || !doc.filePath) return reply.status(404).send({ message: 'File not found' });

  // Ownership check
  const user = request.user as { id: number, roles: string[] };
  const canManage = user.roles.includes('super_admin') || user.roles.includes('admin') || user.roles.includes('staff');
  if (!canManage && doc.siswaMagang.siswa.userId !== user.id) {
    return reply.status(403).send({ message: 'Unauthorized Access' });
  }

  // In a real Vercel/Serverless env, we would use pre-signed URLs or stream from S3.
  // For local/simple, we just return the path for now or a dummy success.
  return { message: 'Download ready', path: doc.filePath };
};
