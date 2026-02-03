import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Eye, EyeOff, Mail, Lock, Shield, Users, Wallet,
  GraduationCap, XCircle, CheckCircle2, ChevronRight,
  Globe, Briefcase, FileSearch, Sparkles
} from 'lucide-react';

export function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedRoleInfo, setSelectedRoleInfo] = useState<string | null>(null);

  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  const roleDetails = {
    'superadmin@lpkujc.com': {
      label: 'Super Admin',
      description: 'Kendali penuh seluruh sistem & manajemen user.',
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      can: ['Akses penuh sistem', 'Kelola semua user & role', 'Hapus semua data', 'Pengaturan server'],
    },
    'admin@lpkujc.com': {
      label: 'Admin Operasional',
      description: 'Kelola data siswa, job order, dan operasional SO.',
      icon: Briefcase,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      can: ['Kelola Siswa & Magang', 'Tracking Dokumen CoE', 'Kelola Job Order', 'Task Management'],
    },
    'finance@lpkujc.com': {
      label: 'Staff Finance',
      description: 'Manajemen invoice, arus kas, dan pembayaran.',
      icon: Wallet,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      can: ['Kelola Invoice & Gaji', 'Lihat Laporan Arus Kas', 'Kelola Pembayaran', 'Invoice ke Kumiai'],
    },
    'instructor@lpkujc.com': {
      label: 'Instruktur',
      description: 'Input absensi harian dan nilai kualifikasi bahasa.',
      icon: GraduationCap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      can: ['Input Absensi Harian', 'Input Nilai Ujian Bahasa', 'Lihat Jadwal Pelatihan', 'Melihat profil siswa'],
    },
    'student@lpkujc.com': {
      label: 'Siswa (Student)',
      description: 'Portal mandiri untuk pantau progress & dokumen.',
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      can: ['Lihat Progress Dokumen CoE', 'Lihat Nilai & Absensi', 'Update profil pribadi', 'Lihat jadwal belajar'],
    }
  };

  const handleDemoLogin = (roleEmail: string) => {
    setError('');
    setSuccessMessage('');
    setEmail(roleEmail);
    setPassword('1234qwer');
    setSelectedRoleInfo(roleEmail);

    // Auto-scroll to form on mobile
    if (window.innerWidth < 1280) {
      document.getElementById('login-form-container')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
        setIsLoading(false);
      } else {
        setSuccessMessage('Login Berhasil! Mengalihkan...');
      }
    } catch (err) {
      setError('Terjadi kesalahan tak terduga');
      setIsLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <LoadingSpinner size={64} />
      <p className="mt-6 text-slate-500 animate-pulse font-semibold tracking-wide">Mempersiapkan Portal LPK...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex items-center justify-center p-6 selection:bg-primary/20">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-50/50 blur-[120px] opacity-70" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-50/50 blur-[120px] opacity-70" />
      </div>

      <div className="w-full max-w-7xl grid grid-cols-1 xl:grid-cols-12 gap-10 items-stretch relative z-10">

        {/* Left Column: Information & Guide (7 Cols) */}
        <div className="xl:col-span-7 flex flex-col justify-center space-y-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] border border-primary/10">
              <Sparkles className="w-3 h-3" /> Sending Organization Excellence
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl font-[900] tracking-tight text-slate-900 leading-[1.1]">
                Sistem <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">LPK UJC</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-500 max-w-xl leading-relaxed font-medium">
                Pusat kendali manajemen siswa & keberangkatan tenaga kerja ke Jepang secara profesional.
              </p>
            </div>
          </div>

          {/* Real Metrics Banner */}
          <div className="grid grid-cols-3 gap-8 py-8 border-y border-slate-100">
            <div className="space-y-1">
              <div className="text-3xl font-black text-slate-900 tracking-tighter">14</div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-widest">Siswa Database</div>
            </div>
            <div className="space-y-1 border-x border-slate-100 px-8">
              <div className="text-3xl font-black text-slate-900 tracking-tighter">4</div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-widest">Kumiai Jepang</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-black text-slate-900 tracking-tighter">4</div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-widest">Job Order SO</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(roleDetails).map(([rEmail, info]) => {
              const Icon = info.icon;
              const isActive = selectedRoleInfo === rEmail;
              return (
                <div
                  key={rEmail}
                  className={`group relative p-5 rounded-3xl cursor-pointer transition-all duration-500 ${isActive
                      ? 'bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] border-2 border-primary ring-4 ring-primary/5'
                      : 'bg-white/50 border-2 border-slate-100 hover:border-slate-300 hover:bg-white hover:shadow-lg'
                    }`}
                  onClick={() => handleDemoLogin(rEmail)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3.5 rounded-2xl ${info.bgColor} transition-transform group-hover:scale-110 shadow-sm shrink-0`}>
                      <Icon className={`w-6 h-6 ${info.color}`} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base">{info.label}</h3>
                        {isActive && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                      </div>
                      <p className="text-xs text-slate-500 leading-snug font-medium line-clamp-2">
                        {info.description}
                      </p>
                    </div>
                  </div>

                  {/* Subtle hover effect text */}
                  <div className="mt-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-bold text-primary tracking-wider uppercase">Coba Akses</span>
                    <ChevronRight className="w-3 h-3 text-primary" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Login Form Content (5 Cols) */}
        <div id="login-form-container" className="xl:col-span-5 flex flex-col items-center justify-center">
          <Card className="w-full max-w-md shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] border-none overflow-hidden rounded-[2.5rem] bg-white">
            <CardHeader className="bg-slate-900 p-12 text-center relative overflow-hidden">
              {/* Pattern overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

              <div className="relative z-10 space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white rotate-6 shadow-xl shadow-primary/20 mb-4 transition-transform hover:rotate-0 duration-300">
                  <Lock className="w-8 h-8" />
                </div>
                <CardTitle className="text-4xl font-black text-white tracking-tight">Sign In</CardTitle>
                <p className="text-slate-400 text-sm font-medium">Akses sistem SO dengan aman</p>
              </div>
            </CardHeader>

            <CardContent className="p-10 sm:p-12 space-y-8">
              <form onSubmit={handleSubmit} className="space-y-7">
                <div className="space-y-2.5">
                  <Label htmlFor="email" className="text-slate-500 font-black ml-1 text-[10px] tracking-[0.1em]">USER EMAIL ADDRESS</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 transition-colors group-focus-within:text-primary" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-12 h-15 bg-slate-50 border-slate-100 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all rounded-2xl text-slate-700 font-medium placeholder:text-slate-300"
                      placeholder="Pilih role di sebelah kiri"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="password" className="text-slate-500 font-black ml-1 text-[10px] tracking-[0.1em]">SECURE PASSWORD</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 transition-colors group-focus-within:text-primary" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-12 pr-12 h-15 bg-slate-50 border-slate-100 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all rounded-2xl text-slate-700 font-medium"
                    />
                    <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive" className="rounded-2xl border-none bg-red-50 text-red-600 shadow-sm">
                    <AlertDescription className="text-[11px] font-bold uppercase tracking-wide">{error}</AlertDescription>
                  </Alert>
                )}

                {successMessage && (
                  <Alert className="bg-emerald-50 text-emerald-700 border-none rounded-2xl shadow-sm">
                    <AlertDescription className="text-[11px] font-bold uppercase tracking-wide">{successMessage}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full h-15 text-lg font-black tracking-tight shadow-2xl shadow-primary/25 hover:scale-[1.03] active:scale-[0.98] transition-all rounded-2xl bg-primary hover:bg-primary/90" disabled={isLoading}>
                  {isLoading ? <LoadingSpinner size={24} color="white" /> : 'MASUK KE DASHBOARD'}
                </Button>

                <div className="pt-8 border-t border-slate-50 space-y-5">
                  <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                    <Shield className="w-3 h-3" /> Protected Environment
                  </div>
                  <p className="text-center text-[11px] text-slate-400 leading-relaxed font-medium">
                    Kata sandi demo: <span className="bg-slate-50 px-2 py-1 rounded-lg text-slate-900 font-bold ml-1">1234qwer</span>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-10 flex items-center gap-8 text-slate-200 grayscale opacity-40">
            <Globe className="w-6 h-6 hover:text-primary transition-colors cursor-default" />
            <Briefcase className="w-6 h-6 hover:text-primary transition-colors cursor-default" />
            <GraduationCap className="w-6 h-6 hover:text-primary transition-colors cursor-default" />
          </div>
        </div>

      </div>
    </div>
  );
}
