
import React from 'react';

export type ViewMode = 'table' | 'grid-2' | 'grid-3';

interface GridViewProps {
  viewMode: ViewMode;
  items: any[];
  renderCard: (item: any) => React.ReactNode;
  className?: string;
}

export function GridView({ viewMode, items, renderCard, className = "" }: GridViewProps) {
  if (viewMode === 'table') {
    return null; // Table view is handled separately
  }

  // Define grid columns based on view mode with proper responsive classes
  const gridCols = viewMode === 'grid-2' 
    ? 'grid-cols-1 md:grid-cols-2' 
    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-8">
        <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-gray-300 rounded-2xl opacity-50"></div>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Belum ada data</h3>
        <p className="text-gray-600 font-medium">Data akan muncul di sini setelah ditambahkan</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols} gap-4 ${className}`}>
      {items.map((item, index) => (
        <div key={item.id || index} className="w-full">
          {renderCard(item)}
        </div>
      ))}
    </div>
  );
}
