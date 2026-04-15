import { FastifyInstance } from 'fastify';
import { 
  getDocumentTrackings, updateDocumentTracking,
  getDocumentTemplates, createDocumentTemplate,
  getDocumentVariables,
  getSiswaDocuments, createSiswaDocument,
  initializeDocuments, downloadDocument
} from '../controllers/document.controller.ts';
import { checkPermission } from '../hooks/rbac.hook.ts';

export default async function documentRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);

  // Document Tracking
  fastify.get('/document-trackings', { preHandler: [checkPermission('document_access')] }, getDocumentTrackings);
  fastify.put('/document-trackings/:id', { preHandler: [checkPermission('document_access')] }, updateDocumentTracking);

  // Document Templates
  fastify.get('/document-templates', { preHandler: [checkPermission('document_access')] }, getDocumentTemplates);
  fastify.post('/document-templates', { preHandler: [checkPermission('document_access')] }, createDocumentTemplate);

  // Document Variables
  fastify.get('/document-variables', { preHandler: [checkPermission('document_access')] }, getDocumentVariables);

  // Siswa Documents
  fastify.get('/siswa-documents', { preHandler: [checkPermission('document_access')] }, getSiswaDocuments);
  fastify.post('/siswa-documents', { preHandler: [checkPermission('document_access')] }, createSiswaDocument);
  fastify.post('/siswa-documents/initialize', { preHandler: [checkPermission('document_access')] }, initializeDocuments);
  fastify.get('/siswa-documents/:id/download', { preHandler: [checkPermission('document_access')] }, downloadDocument);
}
