'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCard, updateCard } from "@/app/dashboard/actions";
import { Card as Flashcard } from "@/db/queries/cards";
import { Plus, Edit } from "lucide-react";

interface CardFormProps {
  deckId: string;
  card?: Flashcard; // Optional - if provided, it's edit mode
  trigger?: React.ReactNode; // Custom trigger element
  onClose?: () => void; // Optional callback when dialog closes
}

export function CardForm({ deckId, card, trigger, onClose }: CardFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    frontText: card?.frontText || '',
    backText: card?.backText || '',
    description: card?.description || '',
  });

  const isEditMode = !!card;
  const title = isEditMode ? "Edit Card" : "Create New Card";
  const description = isEditMode ? "Update your flashcard details." : "Fill in the details for your new flashcard.";
  const submitText = isEditMode ? "Update Card" : "Create Card";
  const submitAction = isEditMode ? "updating" : "creating";

  // Update form data when card changes (for edit mode)
  useEffect(() => {
    if (card) {
      setFormData({
        frontText: card.frontText,
        backText: card.backText,
        description: card.description || '',
      });
    }
  }, [card]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      const formDataObj = new FormData();
      formDataObj.append('deckId', deckId);
      formDataObj.append('frontText', formData.frontText);
      formDataObj.append('backText', formData.backText);
      formDataObj.append('description', formData.description);

      if (isEditMode && card) {
        formDataObj.append('cardId', card.id);
        await updateCard(formDataObj);
      } else {
        await createCard(formDataObj);
      }

      setOpen(false);
      onClose?.(); // Call onClose callback if provided
      // Reset form for create mode
      if (!isEditMode) {
        setFormData({
          frontText: '',
          backText: '',
          description: '',
        });
      }
    } catch (error) {
      console.error(`Error ${submitAction} card:`, error);
      // You could add a toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    onClose?.(); // Call onClose callback if provided
    // Reset form to original values for edit mode
    if (card) {
      setFormData({
        frontText: card.frontText,
        backText: card.backText,
        description: card.description || '',
      });
    }
  };

  // Default trigger if none provided
  const defaultTrigger = isEditMode ? (
    <Button variant="outline" size="sm" className="h-9 px-4">
      <Edit className="h-4 w-4 mr-2" />
      Edit
    </Button>
  ) : (
    <Button size="lg" className="shadow-lg hover:shadow-xl">
      <Plus className="h-5 w-5 mr-2" />
      Create New Card
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
        <form onSubmit={handleSubmit} className="space-y-6 py-2">
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="frontText" className="text-right font-medium">
                Front
              </Label>
              <Input
                id="frontText"
                value={formData.frontText}
                onChange={(e) => setFormData(prev => ({ ...prev, frontText: e.target.value }))}
                className="col-span-3 h-11"
                placeholder="Enter front text"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="backText" className="text-right font-medium">
                Back
              </Label>
              <Input
                id="backText"
                value={formData.backText}
                onChange={(e) => setFormData(prev => ({ ...prev, backText: e.target.value }))}
                className="col-span-3 h-11"
                placeholder="Enter back text"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right font-medium">
                Description
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="col-span-3 h-11"
                placeholder="Enter description (optional)"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              size="lg"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} size="lg">
              {isSubmitting ? `${submitAction.charAt(0).toUpperCase() + submitAction.slice(1)}...` : submitText}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
