
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Mail, Lock, Shield, Users } from 'lucide-react';

export function AuthForm() {
  const [tabValue, setTabValue] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is already authenticated
  useEffect(() => {
    if (!loading && user) {
      console.log('User is authenticated, redirecting to dashboard...');
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleDemoLogin = async () => {
    console.log('Demo login button clicked');
    setError('');
    setSuccessMessage('');
    setEmail('superadmin@lpkujc.com');
    setPassword('1234qwer');
    
    // Small delay to show the credentials filled
    setTimeout(async () => {
      await handleLogin('superadmin@lpkujc.com', '1234qwer');
    }, 500);
  };

  const handleLogin = async (loginEmail: string, loginPassword: string) => {
    console.log('Attempting login for:', loginEmail);
    setIsLoading(true);
    setError('');
    
    try {
      const { error } = await signIn(loginEmail, loginPassword);
      if (error) {
        console.error('Login failed:', error.message);
        setError(error.message);
        setIsLoading(false);
      } else {
        console.log('Login successful, showing success message...');
        setSuccessMessage('Login successful! Redirecting...');
        // The useEffect will handle the redirect when user state updates
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
      setError('An unexpected error occurred during login');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (tabValue === 'login') {
        // Login
        await handleLogin(email, password);
      } else {
        // Sign up
        const { error } = await signUp(email, password);
        if (error) {
          setError(error.message);
        } else {
          setSuccessMessage('Check your email for the confirmation link!');
        }
        setIsLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  // Show loading while checking authentication status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <LoadingSpinner size={60} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/30 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-8 items-center">
        
        {/* Left Column - Welcome Content */}
        <div className="hidden lg:flex lg:col-span-2 flex-col justify-center space-responsive">
          <div className="space-y-4 lg:space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <h1 className="text-responsive-2xl font-bold text-foreground">LPK UJC</h1>
            </div>
            
            <div className="space-y-3 lg:space-y-4">
              <h2 className="text-responsive-3xl font-bold text-foreground leading-tight">
                Selamat Datang di<br />
                <span className="text-transparent bg-clip-text bg-gradient-primary">
                  Sistem Manajemen
                </span>
              </h2>
              <p className="text-responsive-base text-muted-foreground leading-relaxed">
                Platform terintegrasi untuk mengelola seluruh aspek lembaga pelatihan kerja.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 p-3 lg:p-4 glass rounded-xl">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-responsive-sm font-semibold text-foreground">Manajemen Siswa</h3>
                  <p className="text-responsive-xs text-muted-foreground">Kelola data siswa dan program pelatihan</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 lg:p-4 glass rounded-xl">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-responsive-sm font-semibold text-foreground">Sistem Keamanan</h3>
                  <p className="text-responsive-xs text-muted-foreground">Keamanan data dengan kontrol akses berbasis peran</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Auth Form */}
        <div className="w-full lg:col-span-3 max-w-md mx-auto lg:mx-0">
          <Card className="border-0 shadow-modern-lg glass">
            <CardHeader className="text-center padding-responsive pb-4 sm:pb-6">
              <div className="lg:hidden flex justify-center mb-3 sm:mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-primary rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-responsive-xl font-bold text-foreground">
                {tabValue === 'login' ? 'Masuk ke Akun' : 'Buat Akun Baru'}
              </CardTitle>
              <p className="text-responsive-sm text-muted-foreground mt-1 sm:mt-2">
                {tabValue === 'login' 
                  ? 'Silakan masuk untuk mengakses sistem' 
                  : 'Daftar untuk membuat akun baru'
                }
              </p>
            </CardHeader>
            
            <CardContent className="padding-responsive pt-0">
              <div className="space-responsive">
                {/* Demo Login Button */}
                <Button
                  variant="outline"
                  className="w-full btn-responsive-lg border-2 hover:border-primary/50 hover:bg-primary/5"
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                >
                  {isLoading ? <LoadingSpinner size={20} /> : (
                    <>
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Demo Login (Admin)
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-2xs sm:text-xs uppercase">
                    <span className="bg-card px-3 sm:px-4 text-muted-foreground font-medium">Atau masuk manual</span>
                  </div>
                </div>

                <Tabs value={tabValue} onValueChange={setTabValue}>
                  <TabsList className="grid w-full grid-cols-2 h-10 sm:h-12">
                    <TabsTrigger value="login" className="text-responsive-sm">Masuk</TabsTrigger>
                    <TabsTrigger value="signup" className="text-responsive-sm">Daftar</TabsTrigger>
                  </TabsList>

                  <form onSubmit={handleSubmit} className="space-responsive mt-4 sm:mt-6">
                    <TabsContent value="login" className="space-responsive mt-0">
                      <div className="space-y-2 sm:space-y-3">
                        <Label htmlFor="email" className="text-responsive-sm font-medium">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="pl-10 sm:pl-12 h-10 sm:h-12 text-responsive-sm border-2 focus:border-primary/50"
                            placeholder="Masukkan email Anda"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2 sm:space-y-3">
                        <Label htmlFor="password" className="text-responsive-sm font-medium">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="pl-10 sm:pl-12 pr-10 sm:pr-12 h-10 sm:h-12 text-responsive-sm border-2 focus:border-primary/50"
                            placeholder="Masukkan password Anda"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-muted"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" /> : <Eye className="h-3 w-3 sm:h-4 sm:w-4" />}
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="signup" className="space-responsive mt-0">
                      <div className="space-y-2 sm:space-y-3">
                        <Label htmlFor="signup-email" className="text-responsive-sm font-medium">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                          <Input
                            id="signup-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="pl-10 sm:pl-12 h-10 sm:h-12 text-responsive-sm border-2 focus:border-primary/50"
                            placeholder="Masukkan email Anda"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2 sm:space-y-3">
                        <Label htmlFor="signup-password" className="text-responsive-sm font-medium">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                          <Input
                            id="signup-password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="pl-10 sm:pl-12 pr-10 sm:pr-12 h-10 sm:h-12 text-responsive-sm border-2 focus:border-primary/50"
                            placeholder="Buat password baru"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-muted"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" /> : <Eye className="h-3 w-3 sm:h-4 sm:w-4" />}
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    {error && (
                      <Alert variant="destructive" className="border-destructive/20 bg-destructive/5">
                        <AlertDescription className="text-responsive-xs text-destructive">{error}</AlertDescription>
                      </Alert>
                    )}

                    {successMessage && (
                      <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                        <AlertDescription className="text-responsive-xs text-green-700 dark:text-green-300">{successMessage}</AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      className="w-full btn-responsive-lg font-semibold"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <LoadingSpinner size={20} />
                      ) : tabValue === 'login' ? (
                        'Masuk'
                      ) : (
                        'Daftar'
                      )}
                    </Button>
                  </form>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
