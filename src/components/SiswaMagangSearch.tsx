
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SiswaMagangSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function SiswaMagangSearch({ searchTerm, onSearchChange }: SiswaMagangSearchProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari siswa magang..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>
  );
}
