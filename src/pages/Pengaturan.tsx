
import React from 'react';
import { Settings } from 'lucide-react';
import { PengaturanContent } from '@/components/Pengaturan/PengaturanContent';
import { AuthGuard } from '@/components/AuthGuard';
import { ModulePageLayout, ModuleStatCard } from '@/components/layout/ModulePageLayout';
import { useItemPembayaran } from '@/hooks/useItemPembayaran';
import { useKategoriPemasukan } from '@/hooks/useKategoriPemasukan';
import { useKategoriPengeluaran } from '@/hooks/useKategoriPengeluaran';

export default function Pengaturan() {
  const { itemPembayaranList } = useItemPembayaran();
  const { categories: incomeCategories } = useKategoriPemasukan();
  const { categories: expenseCategories } = useKategoriPengeluaran();

  const stats = (
    <>
      <ModuleStatCard
        label="Item Pembayaran"
        value={itemPembayaranList.length}
        color="primary"
        icon={<Settings className="w-4 h-4" />}
      />
      <ModuleStatCard
        label="Kategori Pemasukan"
        value={incomeCategories.length}
        color="success"
        icon={<Settings className="w-4 h-4" />}
      />
      <ModuleStatCard
        label="Kategori Pengeluaran"
        value={expenseCategories.length}
        color="error"
        icon={<Settings className="w-4 h-4" />}
      />
      <ModuleStatCard
        label="Status Sistem"
        value="Aktif"
        color="purple"
        icon={<Settings className="w-4 h-4" />}
      />
    </>
  );

  return (
    <AuthGuard>
      <ModulePageLayout
        title="Pengaturan Transaksi"
        subtitle="Kelola item pembayaran dan kategori operasional"
        stats={stats}
      >
        <div className="p-4">
          <PengaturanContent />
        </div>
      </ModulePageLayout>
    </AuthGuard>
  );
}
