
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { UserProfileDropdown } from '@/components/UserProfileDropdown';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';

interface ModernHeaderProps {
  currentPage?: string;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

export function ModernHeader({ currentPage = "Dashboard", breadcrumbs }: ModernHeaderProps) {
  const { userRole } = useAuth();
  const isMobile = useIsMobile();
  const isStudentMobile = userRole === 'student' && isMobile;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur-md border-b border-slate-100">
      <div className="flex h-16 items-center justify-between px-6 sm:px-8">
        <div className="flex items-center gap-5 flex-1">
          {!isStudentMobile && (
            <>
              <SidebarTrigger className="h-9 w-9 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors" />
              <Separator orientation="vertical" className="h-6 bg-slate-200" />
            </>
          )}

          <div className="hidden md:block">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard" className="text-xs font-semibold text-slate-400 hover:text-primary tracking-wide">
                    DASHBOARD
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbs?.map((crumb, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbSeparator className="text-slate-300" />
                    <BreadcrumbItem>
                      {crumb.href ? (
                        <BreadcrumbLink href={crumb.href} className="text-xs font-semibold text-slate-400 hover:text-primary tracking-wide">
                          {crumb.label.toUpperCase()}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className="text-xs font-black text-slate-900 tracking-wide">
                          {crumb.label.toUpperCase()}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
                {!breadcrumbs && currentPage !== "Dashboard" && (
                  <>
                    <BreadcrumbSeparator className="text-slate-300" />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-xs font-black text-slate-900 tracking-wide">
                        {currentPage.toUpperCase()}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-emerald-600 tracking-wider">LIVE</span>
            </div>
          </div>
          <UserProfileDropdown />
        </div>
      </div>
    </header>
  );
}
