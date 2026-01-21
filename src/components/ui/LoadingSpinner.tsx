
import React from 'react';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  text?: string;
}

export function LoadingSpinner({ size = 24, color = '#3b82f6', text }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className="animate-spin rounded-full border-2 border-gray-200 border-t-current"
        style={{ 
          width: size, 
          height: size, 
          color: color,
          borderTopColor: color
        }}
      />
      {text && (
        <p className="mt-2 text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
}
