import { FastifyRequest, FastifyReply } from 'fastify';

// ARUS KAS
export const getArusKas = async (request: FastifyRequest) => {
  return await request.server.prisma.arusKas.findMany({
    orderBy: { tanggal: 'desc' }
  });
};

export const createArusKas = async (request: FastifyRequest, reply: FastifyReply) => {
  const data = request.body as any;
  const result = await request.server.prisma.arusKas.create({ data });
  return reply.status(201).send(result);
};

// KATEGORI PEMASUKAN
export const getKategoriPemasukan = async (request: FastifyRequest) => {
  return await request.server.prisma.kategoriPemasukan.findMany();
};

export const createKategoriPemasukan = async (request: FastifyRequest, reply: FastifyReply) => {
  const data = request.body as any;
  const result = await request.server.prisma.kategoriPemasukan.create({ data });
  return reply.status(201).send(result);
};

// PEMASUKAN
export const getPemasukan = async (request: FastifyRequest) => {
  return await request.server.prisma.pemasukan.findMany({
    include: { kategori: true },
    orderBy: { tanggalPemasukan: 'desc' }
  });
};

export const createPemasukan = async (request: FastifyRequest, reply: FastifyReply) => {
  const data = request.body as any;
  const result = await request.server.prisma.pemasukan.create({ data });
  
  // Log to Arus Kas
  await request.server.prisma.arusKas.create({
    data: {
      jenis: 'Pemasukan',
      kategori: 'Pemasukan Umum',
      nominal: result.nominal,
      tanggal: result.tanggalPemasukan,
      keterangan: result.namaPemasukan
    }
  });

  return reply.status(201).send(result);
};

// KATEGORI PENGELUARAN
export const getKategoriPengeluaran = async (request: FastifyRequest) => {
  return await request.server.prisma.kategoriPengeluaran.findMany();
};

export const createKategoriPengeluaran = async (request: FastifyRequest, reply: FastifyReply) => {
  const data = request.body as any;
  const result = await request.server.prisma.kategoriPengeluaran.create({ data });
  return reply.status(201).send(result);
};

// PENGELUARAN
export const getPengeluaran = async (request: FastifyRequest) => {
  return await request.server.prisma.pengeluaran.findMany({
    include: { kategori: true },
    orderBy: { tanggalPengeluaran: 'desc' }
  });
};

export const createPengeluaran = async (request: FastifyRequest, reply: FastifyReply) => {
  const data = request.body as any;
  const result = await request.server.prisma.pengeluaran.create({ data });
  
  // Log to Arus Kas
  await request.server.prisma.arusKas.create({
    data: {
      jenis: 'Pengeluaran',
      kategori: 'Pengeluaran Umum',
      nominal: result.nominal,
      tanggal: result.tanggalPengeluaran,
      keterangan: result.namaPengeluaran
    }
  });

  return reply.status(201).send(result);
};

// INVOICE
export const getInvoices = async (request: FastifyRequest) => {
  return await request.server.prisma.invoice.findMany({
    include: { kumiai: true, items: true },
    orderBy: { tanggalInvoice: 'desc' }
  });
};

export const getInvoice = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const invoice = await request.server.prisma.invoice.findUnique({
    where: { id: parseInt(id) },
    include: { kumiai: true, items: { include: { siswaMagang: { include: { siswa: true } } } } }
  });
  if (!invoice) return reply.status(404).send({ message: 'Invoice not found' });
  return invoice;
};

// ITEM PEMBAYARAN
export const getItemPembayaran = async (request: FastifyRequest) => {
  return await request.server.prisma.itemPembayaran.findMany();
};

export const createItemPembayaran = async (request: FastifyRequest, reply: FastifyReply) => {
  const data = request.body as any;
  const result = await request.server.prisma.itemPembayaran.create({ data });
  return reply.status(201).send(result);
};

// INTERNAL PAYMENT
export const getInternalPayments = async (request: FastifyRequest) => {
  return await request.server.prisma.internalPayment.findMany({
    include: { siswa: true, itemPembayaran: true },
    orderBy: { tanggalPembayaran: 'desc' }
  });
};

export const createInternalPayment = async (request: FastifyRequest, reply: FastifyReply) => {
  const data = request.body as any;
  const result = await request.server.prisma.internalPayment.create({ data });

  // Update Kewajiban Pembayaran
  const kewajiban = await request.server.prisma.kewajibanPembayaran.findFirst({
    where: {
      siswaId: result.siswaId,
      itemPembayaranId: result.itemPembayaranId
    }
  });

  if (kewajiban) {
    const terbayarBaru = Number(kewajiban.nominalTerbayar) + Number(result.nominal);
    const sisaBaru = Number(kewajiban.nominalWajib) - terbayarBaru;
    
    await request.server.prisma.kewajibanPembayaran.update({
      where: { id: kewajiban.id },
      data: {
        nominalTerbayar: terbayarBaru,
        sisaKewajiban: sisaBaru,
        status: sisaBaru <= 0 ? 'Lunas' : 'Belum Lunas'
      }
    });
  }

  // Log to Arus Kas
  await request.server.prisma.arusKas.create({
    data: {
      jenis: 'Pemasukan',
      kategori: 'Pembayaran Siswa',
      nominal: result.nominal,
      tanggal: result.tanggalPembayaran,
      keterangan: `Pembayaran ${result.itemPembayaranId} oleh Siswa ID ${result.siswaId}`
    }
  });

  return reply.status(201).send(result);
};

// KEWAJIBAN PEMBAYARAN
export const getKewajibanPembayaran = async (request: FastifyRequest) => {
  return await request.server.prisma.kewajibanPembayaran.findMany({
    include: { siswa: true, itemPembayaran: true }
  });
};
