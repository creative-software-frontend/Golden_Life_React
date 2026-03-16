import React from 'react';
import { MoreVertical, Eye, Pencil, ToggleLeft, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ProductActionsProps } from '../types';

export const ProductActions: React.FC<ProductActionsProps> = ({
  product,
  onView,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onView(product)} className="cursor-pointer">
          <Eye className="mr-2 h-4 w-4" />
          <span>View Details</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(product)} className="cursor-pointer">
          <Pencil className="mr-2 h-4 w-4" />
          <span>Edit Product</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onToggleStatus(product)} 
          className="cursor-pointer"
        >
          <ToggleLeft className="mr-2 h-4 w-4" />
          <span>{product.status === 1 ? 'Deactivate' : 'Activate'}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onDelete(product)} 
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
