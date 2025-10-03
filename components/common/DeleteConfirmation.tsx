'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
} from '@/components/ui/alert-dialog';
import { Trash2, AlertCircle } from 'lucide-react';

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName: string;
  itemType?: string;
  isDeleting: boolean;
  icon?: 'trash' | 'alert' | 'none';
  confirmButtonText?: string;
  cancelButtonText?: string;
  destructive?: boolean;
}

/**
 * A reusable confirmation dialog for delete operations
 * 
 * @param isOpen - Whether the dialog is open
 * @param onClose - Function to call when the dialog is closed
 * @param onConfirm - Function to call when the delete action is confirmed
 * @param title - Custom title for the dialog (defaults to "Delete [itemType]")
 * @param description - Custom description (defaults to "Are you sure you want to delete this [itemType]?")
 * @param itemName - Name of the item being deleted (displayed in the description)
 * @param itemType - Type of item being deleted (e.g., "Vendor", "Document")
 * @param isDeleting - Whether the delete operation is in progress
 * @param icon - Icon to display in the title ('trash', 'alert', or 'none')
 * @param confirmButtonText - Text for the confirm button (defaults to "Delete")
 * @param cancelButtonText - Text for the cancel button (defaults to "Cancel")
 * @param destructive - Whether to use destructive styling (red) for the confirm button
 */
export function DeleteConfirmation({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  itemType = 'item',
  isDeleting,
  icon = 'trash',
  confirmButtonText = 'Delete',
  cancelButtonText = 'Cancel',
  destructive = true
}: DeleteConfirmationProps) {
  // Default title and description if not provided
  const dialogTitle = title || `Delete ${itemType}`;
  const dialogDescription = description || 
    `Are you sure you want to delete ${itemName ? `"${itemName}"` : `this ${itemType}`}? This action cannot be undone.`;

  // Icon component based on the icon prop
  const IconComponent = () => {
    if (icon === 'none') return null;
    
    const iconClass = "mr-2 h-5 w-5";
    return icon === 'trash' 
      ? <Trash2 className={iconClass} /> 
      : <AlertCircle className={iconClass} />;
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className={`flex items-center ${destructive ? 'text-red-600' : ''}`}>
            <IconComponent />
            {dialogTitle}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {dialogDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>{cancelButtonText}</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }} 
            disabled={isDeleting}
            className={destructive 
              ? "bg-red-600 hover:bg-red-700 focus:ring-red-600" 
              : ""}
          >
            {isDeleting ? (
              <>
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full inline-block"></span>
                {confirmButtonText === 'Delete' ? 'Deleting...' : confirmButtonText + '...'}
              </>
            ) : (
              confirmButtonText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
