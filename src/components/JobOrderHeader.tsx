
import React from 'react';

interface JobOrderHeaderProps {
  onCreateNew?: () => void;
}

export function JobOrderHeader({ onCreateNew }: JobOrderHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Job Order</h1>
        <p className="text-gray-600 mt-2">Kelola permintaan pekerjaan dan penempatan siswa</p>
      </div>
    </div>
  );
}
