
import type { JobOrder } from '@/types/jobOrder';

export const dataMappers = {
    mapJobOrderData(item: any): JobOrder {
        if (!item) return item;
        return {
            ...item,
            id: item.id.toString(),
            kumiai_id: item.kumiai_id?.toString() || null,
            jenis_kerja_id: item.jenis_kerja_id?.toString() || null,

            // Map relations if exist
            jenis_kerja: item.jenis_kerja ? {
                ...item.jenis_kerja,
                id: item.jenis_kerja.id.toString()
            } : (item.jenisKerja ? {
                ...item.jenisKerja,
                id: item.jenisKerja.id.toString()
            } : undefined),

            kumiai: item.kumiai ? {
                ...item.kumiai,
                id: item.kumiai.id.toString()
            } : undefined,

            peserta_count: item.peserta_count || item.peserta?.length || 0,
        } as JobOrder;
    },

    enrichJobOrdersWithRelations(jobOrders: any[]): JobOrder[] {
        if (!Array.isArray(jobOrders)) return [];
        return jobOrders.map(jo => this.mapJobOrderData(jo));
    }
};
