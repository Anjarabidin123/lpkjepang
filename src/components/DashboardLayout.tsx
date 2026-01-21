import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppSidebar } from '@/components/AppSidebar';
import { ModernHeader } from '@/components/layout/ModernHeader';
import { SidebarInset } from '@/components/ui/sidebar';
import { UserProfileDropdown } from '@/components/UserProfileDropdown';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';

// Import all pages
import Dashboard from '@/pages/Dashboard';
import Monitoring from '@/pages/Monitoring';
import SiswaReguler from '@/pages/SiswaReguler';
import Siswa from '@/pages/Siswa';
import Kumiai from '@/pages/Kumiai';
import Perusahaan from '@/pages/Perusahaan';
import LpkMitra from '@/pages/LpkMitra';
import Program from '@/pages/Program';
import JenisKerja from '@/pages/JenisKerja';
import PosisiKerja from '@/pages/PosisiKerja';
import InternalPayment from '@/pages/InternalPayment';
import Invoice from '@/pages/Invoice';
import ArusKas from '@/pages/ArusKas';
import Pengaturan from '@/pages/Pengaturan';
import ReportFinance from '@/pages/ReportFinance';
import JobOrder from '@/pages/JobOrder';
import JobOrderDetail from '@/pages/JobOrderDetail';
import Rekrutmen from '@/pages/Rekrutmen';
import TaskManagement from '@/pages/TaskManagement';
import Report from '@/pages/Report';
import UserManagement from '@/pages/UserManagement';
import Settings from '@/pages/Settings';
import Profile from '@/pages/Profile';
// Import new RBAC pages
import UserManagementRbac from '@/pages/UserManagementRbac';
import RoleManagementRbac from '@/pages/RoleManagementRbac';
import Demografi from '@/pages/Demografi';
import Document from '@/pages/Document';

export function DashboardLayout() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <ModernHeader />
        <div className="flex flex-1 flex-col gap-4 p-2 sm:p-4 pt-0">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Master Data Routes */}
            <Route path="/siswa-reguler" element={<SiswaReguler />} />
            <Route path="/siswa" element={<Siswa />} />
            <Route path="/kumiai" element={<Kumiai />} />
            <Route path="/perusahaan" element={<Perusahaan />} />
            <Route path="/lpk-mitra" element={<LpkMitra />} />
            <Route path="/program" element={<Program />} />
            <Route path="/jenis-kerja" element={<JenisKerja />} />
              <Route path="/posisi-kerja" element={<PosisiKerja />} />
              <Route path="/demografi" element={<Demografi />} />
              <Route path="/document" element={<Document />} />
            
            {/* Transaction Routes */}
            <Route path="/internal-payment" element={<InternalPayment />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/arus-kas" element={<ArusKas />} />
            <Route path="/pengaturan" element={<Pengaturan />} />
            <Route path="/report-finance" element={<ReportFinance />} />
            
            {/* Project Management Routes */}
            <Route path="/job-order" element={<JobOrder />} />
            <Route path="/job-order/:id" element={<JobOrderDetail />} />
            <Route path="/rekrutmen" element={<Rekrutmen />} />
            <Route path="/task-management" element={<TaskManagement />} />
            <Route path="/report" element={<Report />} />
            
            {/* System Management Routes */}
            <Route path="/user-management-rbac" element={<UserManagementRbac />} />
            <Route path="/role-management-rbac" element={<RoleManagementRbac />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </SidebarInset>
    </>
  );
}
