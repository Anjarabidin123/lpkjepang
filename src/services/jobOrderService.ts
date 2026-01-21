
import { fetchOperations } from './jobOrder/fetchOperations';
import { createOperations } from './jobOrder/createOperations';
import { updateOperations } from './jobOrder/updateOperations';
import { deleteOperations } from './jobOrder/deleteOperations';
import { connectionUtils } from './jobOrder/connectionUtils';
import { dataMappers } from './jobOrder/dataMappers';

export const jobOrderService = {
  // Connection utilities
  testConnection: connectionUtils.testConnection,

  // Fetch operations
  fetchJobOrders: fetchOperations.fetchJobOrders,
  enrichJobOrdersWithRelations: dataMappers.enrichJobOrdersWithRelations,

  // Create operations
  createJobOrder: createOperations.createJobOrder,

  // Update operations
  updateJobOrder: updateOperations.updateJobOrder,

  // Delete operations
  deleteJobOrder: deleteOperations.deleteJobOrder,

  // Data mapping utilities
  mapJobOrderData: dataMappers.mapJobOrderData
};
