
import { useState, useCallback } from 'react';

export type ViewMode = 'table' | 'grid-2' | 'grid-3';
export type SortDirection = 'asc' | 'desc' | null;

export function useGridView() {
  // Set default view mode to 'table' as intended
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSortChange = useCallback((field: string) => {
    console.log('handleSortChange called with field:', field);
    
    if (field === '' || field === null) {
      setSortField(null);
      setSortDirection(null);
    } else if (field === sortField) {
      // Toggle direction if same field
      const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      setSortDirection(newDirection);
      console.log('Toggling direction to:', newDirection);
    } else {
      // New field, start with ascending
      setSortField(field);
      setSortDirection('asc');
      console.log('Setting new sort field:', field, 'direction: asc');
    }
  }, [sortField, sortDirection]);

  const sortData = useCallback(<T extends Record<string, any>>(data: T[]): T[] => {
    if (!sortField || !sortDirection || !data?.length) {
      console.log('No sorting applied:', { sortField, sortDirection, dataLength: data?.length });
      return data;
    }

    console.log('Sorting data by:', sortField, sortDirection);

    return [...data].sort((a, b) => {
      const aValue = getNestedValue(a, sortField);
      const bValue = getNestedValue(b, sortField);

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else {
        comparison = String(aValue).toLowerCase().localeCompare(String(bValue).toLowerCase());
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [sortField, sortDirection]);

  const getNestedValue = useCallback((obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }, []);

  return {
    viewMode,
    setViewMode,
    sortField,
    sortDirection,
    handleSortChange,
    sortData,
  };
}
