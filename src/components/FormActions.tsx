
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

interface FormActionsProps {
  onSave: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function FormActions({ onSave, onCancel, isLoading }: FormActionsProps) {
  return (
    <div className="flex gap-2">
      <Button 
        size="sm" 
        onClick={onSave}
        disabled={isLoading}
        className="bg-green-600 hover:bg-green-700"
      >
        <Save className="w-4 h-4 mr-1" />
        Simpan
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onCancel}
        disabled={isLoading}
      >
        <X className="w-4 h-4 mr-1" />
        Batal
      </Button>
    </div>
  );
}
