
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface JobOrderSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function JobOrderSearch({ searchTerm, onSearchChange }: JobOrderSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        placeholder="Cari job order..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 w-full sm:w-64"
      />
    </div>
  );
}
