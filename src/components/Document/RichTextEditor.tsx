import React from 'react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export interface RichTextEditorRef {
  insertVariable: (variable: string) => void;
  getContent: () => string;
}

// Versi Sederhana Sementara untuk menghindari Error TipTap saat Development
export const RichTextEditor = React.forwardRef<RichTextEditorRef, RichTextEditorProps>(
  ({ content, onChange, placeholder, className }, ref) => {

    // Fungsi dummy untuk insertVariable
    const insertVariable = (variable: string) => {
      onChange(content + ` {{${variable}}} `);
    };

    React.useImperativeHandle(ref, () => ({
      insertVariable,
      getContent: () => content,
    }));

    return (
      <div className={cn('flex flex-col border rounded-lg overflow-hidden bg-white', className)}>
        <textarea
          className="w-full h-40 p-4 border-none resize-y focus:ring-0 focus:outline-none"
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'Mulai menulis...'}
        />
        <div className="bg-gray-50 p-2 text-xs text-gray-500 border-t">
          Rich Text Editor dinonaktifkan sementara untuk perbaikan dependensi.
        </div>
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';
