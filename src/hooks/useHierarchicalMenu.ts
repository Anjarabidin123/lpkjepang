import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MenuItem } from '@/config/menuConfig';

interface MenuState {
  [key: string]: boolean;
}

const MENU_STATE_KEY = 'hierarchical-menu-state';

export function useHierarchicalMenu(menuItems: MenuItem[]) {
  const location = useLocation();
  const currentPath = location.pathname;

  // Initialize menu state from localStorage or defaults
  const [menuState, setMenuState] = useState<MenuState>(() => {
    try {
      const saved = localStorage.getItem(MENU_STATE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore errors
    }
    
    // Default state - find which parent should be open based on current path
    const defaultState: MenuState = {};
    menuItems.forEach(item => {
      if (item.isCollapsible && item.children) {
        const hasActiveChild = item.children.some(child => 
          child.url && (currentPath === child.url || (child.url === "/" && currentPath === "/dashboard"))
        );
        defaultState[item.id] = hasActiveChild;
      }
    });
    return defaultState;
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(MENU_STATE_KEY, JSON.stringify(menuState));
    } catch {
      // Ignore localStorage errors
    }
  }, [menuState]);

  // Update menu state when route changes to keep relevant parent open
  useEffect(() => {
    const updatedState = { ...menuState };
    let hasChanges = false;

    menuItems.forEach(item => {
      if (item.isCollapsible && item.children) {
        const hasActiveChild = item.children.some(child => 
          child.url && (currentPath === child.url || (child.url === "/" && currentPath === "/dashboard"))
        );
        
        if (hasActiveChild && !updatedState[item.id]) {
          updatedState[item.id] = true;
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      setMenuState(updatedState);
    }
  }, [currentPath, menuItems]);

  const toggleMenu = (menuId: string) => {
    setMenuState(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const isMenuOpen = (menuId: string) => {
    return menuState[menuId] || false;
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/" || currentPath === "/dashboard";
    }
    return currentPath === path;
  };

  return {
    toggleMenu,
    isMenuOpen,
    isActive
  };
}
