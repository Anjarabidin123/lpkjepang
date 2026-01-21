
import { useState, useEffect } from 'react';

interface SidebarState {
  masterDataOpen: boolean;
  transactionOpen: boolean;
  projectManagementOpen: boolean;
  systemOpen: boolean;
  operationalOpen: boolean; // Added for new Operasional menu
}

const SIDEBAR_STATE_KEY = 'sidebar-state';

const defaultState: SidebarState = {
  masterDataOpen: true,
  transactionOpen: true,
  projectManagementOpen: true,
  systemOpen: true,
  operationalOpen: true, // Default open for new menu
};

export function useSidebarState() {
  const [state, setState] = useState<SidebarState>(() => {
    try {
      const saved = localStorage.getItem(SIDEBAR_STATE_KEY);
      return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
    } catch {
      return defaultState;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(state));
    } catch {
      // Ignore localStorage errors
    }
  }, [state]);

  const updateState = (key: keyof SidebarState, value: boolean) => {
    setState(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return {
    state,
    updateState,
  };
}
