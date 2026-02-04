
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileInformation } from '@/components/ProfileInformation';
import { PasswordChange } from '@/components/PasswordChange';
import { User, Shield, GraduationCap, FileText, CheckCircle2, ChevronRight, Calendar, Clock, Lock, Star } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface MobileProfileProps {
    user: any;
    profileData: any;
    onProfileUpdate: (data: any) => void;
    userRole: string;
}

export function MobileProfile({ user, profileData, onProfileUpdate, userRole }: MobileProfileProps) {
    return (
        <div className="flex flex-col space-y-5 pb-24 mx-auto max-w-md w-full px-2">

            {/* 1. HEADER PROFILE */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                <div className="relative mb-3">
                    <div className="h-24 w-24 rounded-full bg-slate-50 border-4 border-white shadow-lg flex items-center justify-center text-3xl font-black text-slate-300">
                        {profileData.full_name ? profileData.full_name.charAt(0).toUpperCase() : <User className="w-10 h-10" />}
                    </div>
                    {user.email_confirmed_at && (
                        <div className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow-sm">
                            <div className="bg-blue-500 rounded-full p-1">
                                <CheckCircle2 className="w-3 h-3 text-white" />
                            </div>
                        </div>
                    )}
                </div>

                <h1 className="text-xl font-black text-slate-900 font-sans uppercase tracking-tight mb-1">
                    {profileData.full_name || 'Siswa LPK'}
                </h1>
                <p className="text-sm text-slate-500 font-medium mb-3">{profileData.email}</p>

                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        {userRole}
                    </span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Aktif
                    </span>
                </div>

                {/* Progress Visual */}
                <div className="w-full mt-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Kelengkapan Profil</span>
                        <span className="text-xs font-black text-blue-600">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                </div>
            </div>

            {/* 2. QUICK STATS (SCROLLABLE ROW ala Mobile Widget) */}
            <div>
                <h3 className="px-4 mb-3 text-xs font-black text-slate-400 uppercase tracking-widest">Ringkasan Akademik</h3>
                {/* Horizontal Scroll Container without scrollbar */}
                <div className="flex gap-2 overflow-x-auto px-4 pb-4 no-scrollbar snap-x snap-mandatory">

                    {/* Card 1: Absensi */}
                    <div className="min-w-[100px] w-28 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm snap-center flex flex-col items-center justify-center gap-1">
                        <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center mb-1">
                            <Clock className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="text-lg font-black text-slate-900 font-sans leading-none">98%</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Hadir</span>
                    </div>

                    {/* Card 2: Nilai */}
                    <div className="min-w-[100px] w-28 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm snap-center flex flex-col items-center justify-center gap-1">
                        <div className="h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center mb-1">
                            <Star className="w-4 h-4 text-orange-600" />
                        </div>
                        <span className="text-lg font-black text-slate-900 font-sans leading-none">89</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Nilai</span>
                    </div>

                    {/* Card 3: Dokumen */}
                    <div className="min-w-[100px] w-28 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm snap-center flex flex-col items-center justify-center gap-1">
                        <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center mb-1">
                            <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-lg font-black text-slate-900 font-sans leading-none">Ok</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Dokumen</span>
                    </div>

                </div>
            </div>

            {/* 3. DETAIL INFO (Vertical Stack) */}
            <div className="space-y-4 px-2">
                {/* Form Data Diri */}
                <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                    <CardHeader className="p-5 bg-white border-b border-slate-50">
                        <CardTitle className="flex items-center gap-2 text-sm font-bold text-slate-800 uppercase tracking-wide">
                            <User className="w-4 h-4 text-slate-400" /> Data Diri
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 bg-white">
                        <ProfileInformation
                            user={user}
                            profileData={profileData}
                            onProfileUpdate={onProfileUpdate}
                        />
                    </CardContent>
                </Card>

                {/* Keamanan & Akun */}
                <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                    <CardHeader className="p-5 bg-white border-b border-slate-50">
                        <CardTitle className="flex items-center gap-2 text-sm font-bold text-slate-800 uppercase tracking-wide">
                            <Lock className="w-4 h-4 text-slate-400" /> Keamanan
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 bg-white space-y-6">
                        <PasswordChange />

                        <div className="pt-4 border-t border-slate-50">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-500 font-medium">Bergabung Sejak</span>
                                    <span className="text-xs font-bold text-slate-800">
                                        {profileData.created_at ? new Date(profileData.created_at).toLocaleDateString() : '-'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-500 font-medium">Terakhir Login</span>
                                    <span className="text-xs font-bold text-slate-800">
                                        {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Baru saja'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="h-8"></div>
        </div>
    );
}
