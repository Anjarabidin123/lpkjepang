
import { useState, useEffect } from 'react';
import { endpoints } from '@/config/api';
import { useToast } from '@/hooks/use-toast';
import { authFetch } from '@/lib/api-client';

export interface ProfilLPK {
    id: string;
    nama: string;
    pemilik: string | null;
    alamat: string | null;
    no_telp: string | null;
    email: string | null;
    website: string | null;
    logo_url: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export function useProfilLPK() {
    const [profiles, setProfiles] = useState<ProfilLPK[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchProfiles = async () => {
        try {
            setLoading(true);
            const response = await authFetch(endpoints.profilLpk);
            if (!response.ok) throw new Error('Failed to fetch LPK profiles');
            const data = await response.json();
            setProfiles(data.map((p: any) => ({
                ...p,
                id: p.id.toString()
            })));
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, []);

    const createProfile = async (data: any) => {
        try {
            const response = await authFetch(endpoints.profilLpk, {
                method: 'POST',
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to create LPK profile');
            toast({ title: "Berhasil", description: "Profil LPK berhasil dibuat" });
            fetchProfiles();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
            throw error;
        }
    };

    const updateProfile = async (id: string, data: any) => {
        try {
            const response = await authFetch(`${endpoints.profilLpk}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to update LPK profile');
            toast({ title: "Berhasil", description: "Profil LPK berhasil diperbarui" });
            fetchProfiles();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
            throw error;
        }
    };

    const deleteProfile = async (id: string) => {
        try {
            const response = await authFetch(`${endpoints.profilLpk}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete LPK profile');
            toast({ title: "Berhasil", description: "Profil LPK berhasil dihapus" });
            fetchProfiles();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
            throw error;
        }
    };

    return {
        profiles,
        loading,
        fetchProfiles,
        createProfile,
        updateProfile,
        deleteProfile
    };
}
