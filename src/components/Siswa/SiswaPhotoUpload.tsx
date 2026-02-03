import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Camera } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { toast } from 'sonner';

interface SiswaPhotoUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  disabled?: boolean;
}

export function SiswaPhotoUpload({ 
  value, 
  onChange, 
  label = "Foto Siswa",
  disabled = false 
}: SiswaPhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Pilih file gambar yang valid (JPG, PNG, etc.)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    setIsUploading(true);
    
    try {
      // Convert to base64 for storage
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        onChange(result);
        setIsUploading(false);
        toast.success("Foto berhasil diupload");
      };
      reader.onerror = () => {
        setIsUploading(false);
        toast.error("Gagal mengupload foto");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
      toast.error("Gagal mengupload foto");
    }
  }, [onChange]);

  const handleRemove = useCallback(() => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success("Foto telah dihapus");
  }, [onChange]);

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center gap-4">
        <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
          <AvatarImage 
            src={value || ''} 
            alt="Foto siswa"
            className="object-cover"
          />
          <AvatarFallback className="bg-blue-500 text-white">
            <User className="w-10 h-10" />
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading || disabled}
            className="hidden"
            id="siswa-photo-upload"
          />
          <Button
            type="button"
            variant="outline"
            disabled={isUploading || disabled}
            className="w-full justify-start"
            onClick={handleButtonClick}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Mengupload...' : value ? 'Ganti Foto' : 'Pilih Foto'}
          </Button>
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={disabled}
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-2" />
              Hapus Foto
            </Button>
          )}
          <p className="text-xs text-muted-foreground">
            Format: JPG, PNG, GIF. Maksimal 5MB
          </p>
        </div>
      </div>
    </div>
  );
}
