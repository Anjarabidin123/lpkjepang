
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { invoiceSettingsTable, kumiaiTable } from '@/lib/localStorage/tables';

export function useInvoiceSettings() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const allSettings = invoiceSettingsTable.getAll();
      const kumiais = kumiaiTable.getAll();

      const enrichedSettings = allSettings.map(setting => {
        const kumiai = kumiais.find(k => k.id === setting.kumiai_id);
        return {
          ...setting,
          kumiai: kumiai ? {
            id: kumiai.id,
            nama: kumiai.nama,
            kode: kumiai.kode
          } : null
        };
      }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setSettings(enrichedSettings);
    } catch (error) {
      console.error('Error fetching invoice settings:', error);
      toast({
        title: "Error",
        description: "Gagal memuat pengaturan invoice",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createSetting = async (settingData: any) => {
    try {
      invoiceSettingsTable.create(settingData);
      
      toast({
        title: "Berhasil",
        description: "Pengaturan invoice berhasil ditambahkan",
      });
      
      fetchSettings();
    } catch (error) {
      console.error('Error creating invoice setting:', error);
      toast({
        title: "Error",
        description: "Gagal menambahkan pengaturan invoice",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateSetting = async (id: string, settingData: any) => {
    try {
      invoiceSettingsTable.update(id, settingData);
      
      toast({
        title: "Berhasil",
        description: "Pengaturan invoice berhasil diperbarui",
      });
      
      fetchSettings();
    } catch (error) {
      console.error('Error updating invoice setting:', error);
      toast({
        title: "Error",
        description: "Gagal memperbarui pengaturan invoice",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteSetting = async (id: string) => {
    try {
      invoiceSettingsTable.delete(id);
      
      toast({
        title: "Berhasil",
        description: "Pengaturan invoice berhasil dihapus",
      });
      
      fetchSettings();
    } catch (error) {
      console.error('Error deleting invoice setting:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus pengaturan invoice",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getSettingByKumiai = (kumiaiId: string) => {
    return settings.find(setting => setting.kumiai_id === kumiaiId);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    createSetting,
    updateSetting,
    deleteSetting,
    getSettingByKumiai,
    fetchSettings,
  };
}
