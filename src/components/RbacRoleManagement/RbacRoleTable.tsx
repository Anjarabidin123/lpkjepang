
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell,
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Edit, 
  Trash2, 
  Shield, 
  Copy, 
  MoreHorizontal,
  Power,
  PowerOff,
  Clock,
  Calendar
} from 'lucide-react';
import { Role } from '@/types/rbac';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RbacRoleTableProps {
  roles: Role[];
  loading: boolean;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
  onDuplicate: (role: Role) => void;
  onToggleStatus: (role: Role) => void;
  deleting: string[];
}

const roleColors: Record<string, { bg: string; text: string; border: string }> = {
  admin: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  super_admin: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  manager: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  user: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  viewer: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
  default: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
};

function getRoleColor(roleName: string | undefined) {
  if (!roleName) return roleColors.default;
  const name = roleName.toLowerCase();
  if (name.includes('admin') || name.includes('super')) return roleColors.super_admin;
  if (name.includes('manager') || name.includes('lead')) return roleColors.manager;
  if (name.includes('viewer') || name.includes('guest')) return roleColors.viewer;
  if (name.includes('user') || name.includes('staff')) return roleColors.user;
  return roleColors.default;
}

function formatDate(dateString: string | undefined) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
}

function formatTimeAgo(dateString: string | undefined) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hari ini';
  if (diffDays === 1) return 'Kemarin';
  if (diffDays < 7) return `${diffDays} hari lalu`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan lalu`;
  return `${Math.floor(diffDays / 365)} tahun lalu`;
}

export function RbacRoleTable({ 
  roles, 
  loading, 
  onEdit, 
  onDelete, 
  onDuplicate,
  onToggleStatus,
  deleting 
}: RbacRoleTableProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <LoadingSpinner size={40} />
        <p className="mt-4 text-sm">Memuat data peran...</p>
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <div className="p-4 rounded-full bg-gray-100 mb-4">
          <Shield className="h-12 w-12 text-gray-300" />
        </div>
        <p className="text-lg font-medium text-gray-500">Tidak ada peran ditemukan</p>
        <p className="text-sm mt-1">Buat peran baru atau ubah filter pencarian</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
            <TableHead className="font-semibold text-slate-600 pl-6">Nama Peran</TableHead>
            <TableHead className="font-semibold text-slate-600">Deskripsi</TableHead>
            <TableHead className="font-semibold text-slate-600">Tipe</TableHead>
            <TableHead className="font-semibold text-slate-600">Status</TableHead>
            <TableHead className="font-semibold text-slate-600">Diperbarui</TableHead>
            <TableHead className="font-semibold text-slate-600 text-right pr-6">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role, index) => {
            const color = getRoleColor(role.name);
            const isDeleting = deleting.includes(role.id);
            
            return (
              <TableRow 
                key={role.id} 
                className={`
                  group hover:bg-violet-50/30 transition-colors
                  ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}
                  ${isDeleting ? 'opacity-50' : ''}
                `}
              >
                <TableCell className="pl-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${color.bg} ${color.border} border`}>
                      <Shield className={`h-4 w-4 ${color.text}`} />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{role.display_name}</div>
                      <div className="text-xs text-gray-400 font-mono">{role.name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-gray-600 text-sm line-clamp-2 max-w-[250px] cursor-default">
                        {role.description || <span className="text-gray-400 italic">Tidak ada deskripsi</span>}
                      </span>
                    </TooltipTrigger>
                    {role.description && (
                      <TooltipContent side="bottom" className="max-w-sm">
                        <p>{role.description}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline"
                    className={`
                      font-medium
                      ${role.is_system_role 
                        ? 'bg-blue-50 text-blue-700 border-blue-200' 
                        : 'bg-purple-50 text-purple-700 border-purple-200'
                      }
                    `}
                  >
                    {role.is_system_role ? 'Sistem' : 'Kustom'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline"
                    className={`
                      font-medium
                      ${role.is_active 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-gray-100 text-gray-500 border-gray-200'
                      }
                    `}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${role.is_active ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                    {role.is_active ? 'Aktif' : 'Tidak Aktif'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1.5 text-gray-500 text-sm cursor-default">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatTimeAgo(role.updated_at)}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(role.updated_at)}</span>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell className="pr-6">
                  <div className="flex items-center justify-end gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(role)}
                          className="h-8 w-8 p-0 hover:bg-violet-100 hover:text-violet-700"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit Peran</TooltipContent>
                    </Tooltip>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => onDuplicate(role)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplikasi
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onToggleStatus(role)}>
                          {role.is_active ? (
                            <>
                              <PowerOff className="h-4 w-4 mr-2" />
                              Nonaktifkan
                            </>
                          ) : (
                            <>
                              <Power className="h-4 w-4 mr-2" />
                              Aktifkan
                            </>
                          )}
                        </DropdownMenuItem>
                        {!role.is_system_role && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => onDelete(role)}
                              className="text-red-600 focus:text-red-600 focus:bg-red-50"
                              disabled={isDeleting}
                            >
                              {isDeleting ? (
                                <>
                                  <LoadingSpinner size={16} />
                                  <span className="ml-2">Menghapus...</span>
                                </>
                              ) : (
                                <>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Hapus
                                </>
                              )}
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TooltipProvider>
  );
}
