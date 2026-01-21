
import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MenuItem } from '@/config/menuConfig';
import { useAuth } from "@/hooks/useAuth";

interface HierarchicalMenuItemProps {
  item: MenuItem;
  isOpen: boolean;
  onToggle: (menuId: string) => void;
  isActive: (path: string) => boolean;
}

export function HierarchicalMenuItem({
  item,
  isOpen,
  onToggle,
  isActive
}: HierarchicalMenuItemProps) {
  const {
    userRole
  } = useAuth();

  // Show System Management for admin, moderator, and user roles
  const canViewSystemManagement = userRole === 'admin' || userRole === 'moderator' || userRole === 'user';

  // Hide system management items if user doesn't have permission
  if (item.id === 'system-management' && !canViewSystemManagement) {
    return null;
  }

  // If item has children and is collapsible, render as collapsible group
  if (item.isCollapsible && item.children) {
    return <SidebarGroup className="py-1">
        <Collapsible open={isOpen} onOpenChange={() => onToggle(item.id)}>
          <CollapsibleTrigger asChild>
            <SidebarGroupLabel className="group/label w-full cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md py-1.5 px-2 transition-colors">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </SidebarGroupLabel>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarGroupContent className="mt-1">
              <SidebarMenu>
                {item.children.map(child => <SidebarMenuItem key={child.id}>
                    <SidebarMenuButton asChild isActive={child.url ? isActive(child.url) : false}>
                      <NavLink to={child.url || '#'} className="flex items-center gap-3 pl-6 py-1.5">
                        <child.icon className="h-4 w-4" />
                        <span className="text-sm">{child.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>)}
              </SidebarMenu>
            </SidebarGroupContent>
          </CollapsibleContent>
        </Collapsible>
      </SidebarGroup>;
  }

  // If item has URL but no children, render as single menu item
  if (item.url) {
    return <SidebarGroup className="py-1">
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive(item.url)}>
                <NavLink to={item.url} className="flex items-center gap-3 py-1.5">
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm">{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>;
  }
  return null;
}
