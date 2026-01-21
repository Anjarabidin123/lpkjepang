
import React from 'react';
import { Badge } from "@/components/ui/badge";

export function StatusBadges() {
  return (
    <div className="flex flex-wrap gap-3">
      <Badge variant="outline" className="glass border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all duration-200 px-3 py-1 font-medium">Inactive</Badge>
      <Badge variant="default" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 hover:shadow-lg hover:shadow-blue-500/25 px-3 py-1 font-semibold">Recruiting</Badge>
      <Badge variant="secondary" className="bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0 hover:shadow-lg hover:shadow-teal-500/25 px-3 py-1 font-semibold">Cetak</Badge>
      <Badge variant="default" className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0 hover:shadow-lg hover:shadow-indigo-500/25 px-3 py-1 font-semibold">Pelatihan</Badge>
      <Badge variant="default" className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 hover:shadow-lg hover:shadow-red-500/25 px-3 py-1 font-semibold">Wawancara</Badge>
      <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 hover:shadow-lg hover:shadow-green-500/25 px-3 py-1 font-semibold">Selesai</Badge>
      <Badge variant="outline" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 hover:shadow-lg hover:shadow-orange-500/25 px-3 py-1 font-semibold">Cancel</Badge>
    </div>
  );
}
