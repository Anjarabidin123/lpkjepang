
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { menuConfig } from '@/config/menuConfig';
import { useHierarchicalMenu } from '@/hooks/useHierarchicalMenu';
import { HierarchicalMenuItem } from './HierarchicalMenuItem';
import { BrandLogo } from '@/components/layout/BrandLogo';

export function AppSidebar() {
  const {
    loading
  } = useAuth();
  const {
    toggleMenu,
    isMenuOpen,
    isActive
  } = useHierarchicalMenu(menuConfig);

  // Don't render sidebar until auth is loaded
  if (loading) {
    return null;
  }
  
  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <BrandLogo size="md" />
      </SidebarHeader>
      <SidebarContent className="px-[24px]">
        {menuConfig.map(item => (
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
