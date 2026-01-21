import React from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Settings2 } from "lucide-react";
import type { SiswaRegularColumnConfig } from "@/hooks/useSiswaRegularColumnVisibility";

interface SiswaRegularColumnVisibilityControlProps {
  columns: SiswaRegularColumnConfig[];
  onToggleColumn: (key: string) => void;
}

export function SiswaRegularColumnVisibilityControl({ 
  columns, 
  onToggleColumn 
}: SiswaRegularColumnVisibilityControlProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="bg-white/80 border-gray-200 hover:bg-gray-50">
          <Settings2 className="w-4 h-4 mr-2" />
          Kolom
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[56rem] -mt-24" align="start">
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Tampilkan Kolom</h4>
          <div className="grid grid-cols-5 gap-x-3 gap-y-2">
            {columns.map((column) => (
              <div key={column.key} className="flex items-center space-x-2">
                <Checkbox
                  id={`regular-column-${column.key}`}
                  checked={column.visible}
                  onCheckedChange={() => onToggleColumn(column.key)}
                />
                <label
                  htmlFor={`regular-column-${column.key}`}
                  className="text-sm font-normal cursor-pointer truncate"
                >
                  {column.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}