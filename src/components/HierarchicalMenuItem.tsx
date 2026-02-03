
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
  const { userRole } = useAuth();

  // Unified permission check via allowedRoles in menuConfig
  // (already handled in AppSidebar, but kept here for extra safety)
  if (item.allowedRoles && item.allowedRoles.length > 0) {
    if (!userRole || !item.allowedRoles.includes(userRole)) {
      return null;
    }
  }

  const activeLinkClass = "bg-primary/10 text-primary font-bold shadow-sm ring-1 ring-primary/20";
  const baseLinkClass = "flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all duration-300 hover:bg-slate-50 text-slate-600 hover:text-slate-900";

  if (item.isCollapsible && item.children) {
    return (
      <SidebarGroup className="py-0.5">
        <Collapsible open={isOpen} onOpenChange={() => onToggle(item.id)}>
          <CollapsibleTrigger asChild>
            <div className="group flex items-center justify-between w-full px-3 py-2.5 cursor-pointer rounded-xl hover:bg-slate-50 transition-all text-slate-600 hover:text-slate-900">
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg ${isOpen ? 'bg-primary/10 text-primary' : 'bg-slate-50 text-slate-400'} transition-colors group-hover:bg-primary/10 group-hover:text-primary`}>
                  <item.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold tracking-tight">{item.title}</span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 opacity-40 ${isOpen ? 'rotate-180 opacity-100 text-primary' : ''}`} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarGroupContent className="mt-1 ml-4 border-l-2 border-slate-50 pl-2 space-y-1">
              <SidebarMenu>
                {item.children.map(child => (
                  <SidebarMenuItem key={child.id}>
                    <NavLink
                      to={child.url || '#'}
                      className={({ isActive: isLinkActive }) =>
                        `${baseLinkClass} text-[13px] ${isLinkActive ? activeLinkClass : 'font-medium'}`
                      }
                    >
                      <child.icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{child.title}</span>
                    </NavLink>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </CollapsibleContent>
        </Collapsible>
      </SidebarGroup>
    );
  }

  if (item.url) {
    return (
      <SidebarGroup className="py-0.5">
        <SidebarMenu>
          <SidebarMenuItem>
            <NavLink
              to={item.url}
              className={({ isActive: isLinkActive }) =>
                `${baseLinkClass} ${isLinkActive ? activeLinkClass : 'font-semibold'}`
              }
            >
              <div className={`p-1.5 rounded-lg ${isActive(item.url) ? 'bg-primary/20' : 'bg-slate-50 text-slate-400'} transition-colors`}>
                <item.icon className="h-4 w-4 shrink-0" />
              </div>
              <span className="text-sm tracking-tight">{item.title}</span>
            </NavLink>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    );
  }
  return null;
}
