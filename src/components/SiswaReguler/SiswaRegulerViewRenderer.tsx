
import React from 'react';
import { SiswaMagangTable } from '@/components/SiswaMagangTable';
import { SiswaRegulerCardRenderer } from './SiswaRegulerCardRenderer';
import { GridView } from '@/components/GridView';
import type { SiswaMagang } from '@/types/siswaMagang';
import type { SiswaColumnConfig } from '@/hooks/useSiswaColumnVisibility';

interface SiswaRegulerViewRendererProps {
  viewMode: string;
  sortedSiswaMagang: SiswaMagang[];
  searchTerm: string;
  isCreating: boolean;
  editingItem: SiswaMagang | null;
  isDeleting: boolean;
  isEditing: boolean;
  visibleColumns: SiswaColumnConfig[];
  onCreateNew: () => void;
  onEdit: (item: SiswaMagang) => void;
  onView: (item: SiswaMagang) => void;
  onDelete: (id: string) => void;
  onSave: () => void;
  onCancel: () => void;
  InlineForm: React.ComponentType<any>;
}

export function SiswaRegulerViewRenderer({
  viewMode,
  sortedSiswaMagang,
  searchTerm,
  onEdit,
  onView,
  onDelete,
  isDeleting,
  visibleColumns
}: SiswaRegulerViewRendererProps) {
  // Check if it's a grid view mode (grid-2 or grid-3)
  if (viewMode === 'grid-2' || viewMode === 'grid-3') {
    return (
      <GridView
        viewMode={viewMode as 'grid-2' | 'grid-3'}
        items={sortedSiswaMagang}
        renderCard={(item) => (
          <SiswaRegulerCardRenderer
            siswaMagang={[item]}
            onEdit={onEdit}
            onView={onView}
            onDelete={onDelete}
            searchTerm={searchTerm}
          />
        )}
        className="mt-6"
      />
    );
  }

  // Default to table view
  return (
    <SiswaMagangTable
      siswaMagang={sortedSiswaMagang}
      searchTerm={searchTerm}
      onEdit={onEdit}
      onView={onView}
      onDelete={onDelete}
      isDeleting={isDeleting}
      visibleColumns={visibleColumns}
    />
  );
}
