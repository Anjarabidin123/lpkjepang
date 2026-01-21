
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { User } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { FormData } from '@/hooks/useSiswaMagangForm';
import { ImageUpload } from './ImageUpload';

interface SiswaMagangFormHeaderProps {
  form: UseFormReturn<FormData>;
}

export function SiswaMagangFormHeader({ form }: SiswaMagangFormHeaderProps) {
  const avatarValue = form.watch('avatar_url');
  
  return (
    <div className="flex items-center space-x-6 mb-6 p-4 bg-gray-50 rounded-lg">
      <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
        <AvatarImage 
          src={avatarValue || ''} 
          alt="Foto siswa"
          className="object-cover"
        />
        <AvatarFallback className="bg-blue-500 text-white">
          <User className="w-10 h-10" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <FormField
          control={form.control}
          name="avatar_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Foto Siswa</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value || ''}
                  onChange={(url) => {
                    console.log('Image URL changed:', url ? 'Image uploaded' : 'Image removed');
                    field.onChange(url);
                  }}
                  label="Upload Foto Siswa"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
