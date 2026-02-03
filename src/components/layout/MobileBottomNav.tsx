
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, GraduationCap, FileStack, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileBottomNav() {
    const navItems = [
        {
            title: 'Home',
            url: '/',
            icon: Home
        },
        {
            title: 'Akademik',
            url: '/education',
            icon: GraduationCap
        },
        {
            title: 'Dokumen',
            url: '/document-tracking',
            icon: FileStack
        },
        {
            title: 'Profil',
            url: '/profile',
            icon: User
        }
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-100 px-6 py-2 pb-6 sm:hidden">
            <div className="flex items-center justify-around">
                {navItems.map((item) => (
                    <NavLink
                        key={item.url}
                        to={item.url}
                        end={item.url === '/'}
                        className={({ isActive }) => cn(
                            "flex flex-col items-center gap-1.5 p-1 rounded-xl transition-all duration-300 w-16",
                            isActive ? "text-primary -translate-y-1" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <item.icon className={cn("w-5 h-5", ({ isActive }: { isActive: boolean }) => isActive && "fill-current")} />
                        <span className="text-[9px] font-bold uppercase tracking-widest scale-90">{item.title}</span>
                    </NavLink>
                ))}
            </div>
        </div>
    );
}
