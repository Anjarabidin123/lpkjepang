
import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = "Upload Foto" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('File selected:', file.name, file.type, file.size);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Pilih file gambar yang valid (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error", 
        description: "Ukuran file maksimal 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Convert to base64 for storage
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        console.log('Image converted to base64, length:', result.length);
        onChange(result);
        setIsUploading(false);
        toast({
          title: "Berhasil",
          description: "Foto berhasil diupload",
        });
      };
      reader.onerror = () => {
        console.error('FileReader error');
        setIsUploading(false);
        toast({
          title: "Error",
          description: "Gagal mengupload foto",
          variant: "destructive",
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
      toast({
        title: "Error",
        description: "Gagal mengupload foto",
        variant: "destructive",
      });
    }
  }, [onChange, toast]);

  const handleRemove = useCallback(() => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast({
      title: "Info",
      description: "Foto telah dihapus",
    });
  }, [onChange, toast]);

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative group">
            <img 
              src={value} 
              alt="Preview foto siswa" 
              className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
              onError={(e) => {
                console.error('Image load error');
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleRemove}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
            <Camera className="h-8 w-8 text-gray-400" />
          </div>
        )}
        
        <div className="flex-1 space-y-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="hidden"
            id="image-upload-siswa"
          />
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
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
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-2" />
              Hapus Foto
            </Button>
          )}
          <p className="text-xs text-gray-500">
            Format: JPG, PNG, GIF. Maksimal 5MB
          </p>
        </div>
      </div>
    </div>
  );
}
