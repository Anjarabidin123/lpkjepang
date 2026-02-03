
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { endpoints } from '@/config/api';
import { User, Mail, Phone, Save, Loader2 } from 'lucide-react';

interface ProfileData {
    full_name: string;
    email: string;
    phone: string;
    avatar_url?: string;
    is_active?: boolean;
}

interface ProfileInformationProps {
    user: any;
    profileData: ProfileData;
    onProfileUpdate: (updatedData: ProfileData) => void;
}

export function ProfileInformation({ user, profileData, onProfileUpdate }: ProfileInformationProps) {
    const { toast } = useToast();
    const [isUpdating, setIsUpdating] = useState(false);
    const [formData, setFormData] = useState<ProfileData>({
        full_name: profileData.full_name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsUpdating(true);
            const { authFetch } = await import('@/lib/api-client');

            const response = await authFetch(endpoints.auth.updateProfile, {
                method: 'PUT',
                body: JSON.stringify({
                    name: formData.full_name,
                    email: formData.email,
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Gagal memperbarui profil');
            }

            toast({
                title: "Berhasil",
                description: "Profil berhasil diperbarui",
            });

            onProfileUpdate(formData);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Terjadi kesalahan saat memperbarui profil",
                variant: "destructive",
            });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Data Pribadi</CardTitle>
                <CardDescription>
                    Perbarui informasi profil Anda
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="full_name">Nama Lengkap</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                id="full_name"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                className="pl-10"
                                placeholder="Nama Lengkap"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="pl-10"
                                placeholder="email@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Nomor Telepon</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="pl-10"
                                placeholder="08123456789"
                            />
                        </div>
                    </div>

                    <Button type="submit" disabled={isUpdating} className="w-full">
                        {isUpdating ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        Simpan Perubahan
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
