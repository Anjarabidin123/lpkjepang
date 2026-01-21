
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { UserProfileDropdown } from '@/components/UserProfileDropdown';
import { Badge } from '@/components/ui/badge';

interface ModernHeaderProps {
  currentPage?: string;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

export function ModernHeader({ currentPage = "Dashboard", breadcrumbs }: ModernHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left Section - Trigger & Navigation */}
        <div className="flex items-center gap-4 flex-1">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-6" />

          {/* Breadcrumb Navigation */}
          <div className="hidden md:block">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard" className="text-sm text-gray-600 hover:text-primary">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbs?.map((crumb, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {crumb.href ? (
                        <BreadcrumbLink href={crumb.href} className="text-sm text-gray-600 hover:text-primary">
                          {crumb.label}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className="text-sm font-medium text-gray-900">
                          {crumb.label}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
                {!breadcrumbs && currentPage !== "Dashboard" && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-sm font-medium text-gray-900">
                        {currentPage}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Right Section - Status & Profile */}
        <div className="flex items-center gap-4">
          {/* System Status Badge */}
          <div className="hidden sm:flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
              System Online
            </Badge>
          </div>
          
          {/* User Profile */}
          <UserProfileDropdown />
        </div>
      </div>
    </header>
  );
}
