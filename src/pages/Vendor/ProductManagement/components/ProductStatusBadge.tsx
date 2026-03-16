import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ProductStatusBadgeProps } from '../types';

export const ProductStatusBadge: React.FC<ProductStatusBadgeProps> = ({ status }) => {
  const isActive = status === 1;
  
  return (
    <Badge
      variant={isActive ? 'default' : 'secondary'}
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold
        ${isActive 
          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400' 
          : 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
        }
      `}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isActive ? 'bg-emerald-600 dark:bg-emerald-400' : 'bg-red-600 dark:bg-red-400'
        }`}
      />
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  );
};
