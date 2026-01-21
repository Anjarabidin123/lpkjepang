
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';

export interface ProfilLPK {
  id: string;
  nama: string;
  pemilik?: string;
  alamat?: string;
  no_telp?: string;
  email?: string;
  website?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useProfilLPK() {
  const [profiles, setProfiles] = useState<ProfilLPK[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchProfiles = async () => {
    if (!user) {
      setProfiles([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profil_lpk')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching LPK profiles:', error);
      toast({
        title: "Error",
        description: "Failed to load LPK profiles",
        variant: "destructive",
      });
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (data: Omit<ProfilLPK, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const { data: insertedData, error } = await supabase
        .from('profil_lpk')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "LPK profile created successfully",
      });
      
      await fetchProfiles();
      return insertedData;
    } catch (error) {
      console.error('Error creating LPK profile:', error);
      toast({
        title: "Error",
        description: "Failed to create LPK profile",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProfile = async (id: string, data: Partial<ProfilLPK>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const { data: updatedData, error } = await supabase
        .from('profil_lpk')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "LPK profile updated successfully",
      });
      
      await fetchProfiles();
      return updatedData;
    } catch (error) {
      console.error('Error updating LPK profile:', error);
      toast({
        title: "Error",
        description: "Failed to update LPK profile",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteProfile = async (id: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const { error } = await supabase
        .from('profil_lpk')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "LPK profile deleted successfully",
      });
      
      await fetchProfiles();
    } catch (error) {
      console.error('Error deleting LPK profile:', error);
      toast({
        title: "Error",
        description: "Failed to delete LPK profile",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfiles();
    }
  }, [user]);

  return {
    profiles,
    loading,
    createProfile,
    updateProfile,
    deleteProfile,
    fetchProfiles,
    isAuthenticated: !!user,
  };
}
