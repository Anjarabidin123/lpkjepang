
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface RoleBasedRouteProps {
    allowedRoles: string[];
}

export const RoleBasedRoute = ({ allowedRoles }: RoleBasedRouteProps) => {
    const { user, userRole, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Jika belum login, redirect ke login
    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    // Jika role user tidak ada dalam daftar yang diizinkan (dan daftar tidak kosong)
    if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
        // Redirect ke dashboard atau halaman unauthorized
        // Untuk saat ini ke dashboard agar tidak membingungkan user
        console.warn(`Access denied for role: ${userRole}. Allowed: ${allowedRoles.join(', ')}`);
        return <Navigate to="/dashboard" replace />;
    }

    // Jika lolos, render halaman yang diminta
    return <Outlet />;
};
