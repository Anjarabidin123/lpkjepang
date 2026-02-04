
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { menuConfig } from '@/config/menuConfig';
import { useHierarchicalMenu } from '@/hooks/useHierarchicalMenu';
import { HierarchicalMenuItem } from './HierarchicalMenuItem';
import { BrandLogo } from '@/components/layout/BrandLogo';

export function AppSidebar() {
  const { loading, userRole } = useAuth();
  const { toggleMenu, isMenuOpen, isActive } = useHierarchicalMenu(menuConfig);

  if (loading) return null;

  const filteredMenu = menuConfig.filter(item => {
    if (!item.allowedRoles || item.allowedRoles.length === 0) return true;
    return userRole && item.allowedRoles.includes(userRole);
  });

  return (
    <Sidebar className="border-r border-slate-100 bg-white/50 backdrop-blur-xl">
      <SidebarHeader className="p-4">
        <BrandLogo size="md" />
      </SidebarHeader>
      <SidebarContent className="px-3 pb-6 space-y-0.5">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-3 mt-2">
          Menu Utama
        </div>
        {filteredMenu.map(item => (
          <HierarchicalMenuItem
            key={item.id}
            item={item}
            isOpen={isMenuOpen(item.id)}
            onToggle={toggleMenu}
            isActive={isActive}
          />
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
