
import React, { useMemo } from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { ArusKasContent } from '@/components/ArusKas/ArusKasContent';
import { ModulePageLayout, ModuleStatCard } from '@/components/layout/ModulePageLayout';
import { useArusKas } from '@/hooks/useArusKas';
import { formatCurrency } from '@/lib/formatCurrency';

export default function ArusKas() {
  const { arusKasList } = useArusKas();

  const statsData = useMemo(() => {
    const totalPemasukan = arusKasList
      .filter(item => item.jenis === 'Pemasukan')
      .reduce((acc, curr) => acc + (Number(curr.nominal) || 0), 0);
    
    const totalPengeluaran = arusKasList
      .filter(item => item.jenis === 'Pengeluaran')
      .reduce((acc, curr) => acc + (Number(curr.nominal) || 0), 0);
    
    const saldo = totalPemasukan - totalPengeluaran;

    return {
      totalPemasukan,
      totalPengeluaran,
      saldo,
      count: arusKasList.length
    };
  }, [arusKasList]);

  const stats = (
    <>
      <ModuleStatCard
        label="Total Pemasukan"
        value={formatCurrency(statsData.totalPemasukan)}
        color="success"
        icon={<ArrowUpRight className="w-4 h-4" />}
      />
      <ModuleStatCard
        label="Total Pengeluaran"
        value={formatCurrency(statsData.totalPengeluaran)}
        color="error"
        icon={<ArrowDownRight className="w-4 h-4" />}
      />
      <ModuleStatCard
        label="Saldo Kas"
        value={formatCurrency(statsData.saldo)}
        color={statsData.saldo >= 0 ? "primary" : "error"}
        icon={<Wallet className="w-4 h-4" />}
      />
      <ModuleStatCard
        label="Total Transaksi"
        value={statsData.count}
        color="purple"
        icon={<TrendingUp className="w-4 h-4" />}
      />
    </>
  );

  return (
    <ModulePageLayout
      title="Arus Kas"
      subtitle="Kelola data pemasukan dan pengeluaran operasional"
      stats={stats}
    >
      <div className="p-4">
        <ArusKasContent />
      </div>
    </ModulePageLayout>
  );
}
