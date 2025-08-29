'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2 } from 'lucide-react';

interface DeleteConfirmationDialogProps {
  title: string;
  description: string;
  onDelete: () => Promise<void>;
  trigger?: React.ReactNode;
  variant?: 'default' | 'destructive';
  size?: 'sm' | 'default' | 'lg';
}

export function DeleteConfirmationDialog({ 
  title, 
  description, 
  onDelete, 
  trigger,
  variant = 'destructive',
  size = 'default'
}: DeleteConfirmationDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete();
      setOpen(false);
    } catch (error) {
      console.error('Error deleting item:', error);
      // You could add a toast notification here
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  // Default trigger if none provided
  const defaultTrigger = (
    <Button variant={variant} size={size} className="h-9 px-4">
      <Trash2 className="h-4 w-4 mr-2" />
      Delete
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={handleCancel} size="lg">
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
            size="lg"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
