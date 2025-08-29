'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateCard, deleteCard } from "@/app/dashboard/actions";
import { Card as Flashcard } from "@/db/queries/cards";

interface CardItemProps {
  card: Flashcard;
  deckId: string;
}

export function CardItem({ card, deckId }: CardItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeletingConfirm, setIsDeletingConfirm] = useState(false);
  const [editForm, setEditForm] = useState({
    frontText: card.frontText,
    backText: card.backText,
    description: card.description || '',
  });

  const handleEdit = async (formData: FormData) => {
    try {
      setIsUpdating(true);
      formData.append('cardId', card.id);
      formData.append('deckId', deckId);
      formData.append('frontText', editForm.frontText);
      formData.append('backText', editForm.backText);
      formData.append('description', editForm.description);
      
      await updateCard(formData);
      setIsEditing(false);
      // Reset form to current values
      setEditForm({
        frontText: editForm.frontText,
        backText: editForm.backText,
        description: editForm.description,
      });
    } catch (error) {
      console.error('Error updating card:', error);
      // You could add a toast notification here
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeletingConfirm(true);
      const formData = new FormData();
      formData.append('cardId', card.id);
      formData.append('deckId', deckId);
      
      await deleteCard(formData);
      setIsDeleting(false);
    } catch (error) {
      console.error('Error deleting card:', error);
      // You could add a toast notification here
    } finally {
      setIsDeletingConfirm(false);
    }
  };

  return (
    <Card className="w-80 flex-shrink-0">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-3">{card.frontText}</CardTitle>
            <CardDescription className="text-sm leading-relaxed mb-4">
              {card.backText}
            </CardDescription>
            {card.description && (
              <p className="text-sm text-muted-foreground">
                {card.description}
              </p>
            )}
          </div>
          <div className="flex gap-3 ml-4">
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-4"
                >
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader className="space-y-3">
                  <DialogTitle className="text-2xl font-bold">Edit Card</DialogTitle>
                  <DialogDescription className="text-base text-muted-foreground">
                    Update your flashcard details.
                  </DialogDescription>
                </DialogHeader>
                <form action={handleEdit} className="space-y-6 py-2">
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="frontText" className="text-right font-medium">
                        Front
                      </Label>
                      <Input
                        id="frontText"
                        value={editForm.frontText}
                        onChange={(e) => setEditForm(prev => ({ ...prev, frontText: e.target.value }))}
                        className="col-span-3 h-11"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="backText" className="text-right font-medium">
                        Back
                      </Label>
                      <Input
                        id="backText"
                        value={editForm.backText}
                        onChange={(e) => setEditForm(prev => ({ ...prev, backText: e.target.value }))}
                        className="col-span-3 h-11"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right font-medium">
                        Description
                      </Label>
                      <Input
                        id="description"
                        value={editForm.description}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        className="col-span-3 h-11"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)} size="lg">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isUpdating} size="lg">
                      {isUpdating ? 'Updating...' : 'Update Card'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-9 px-4"
                >
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader className="space-y-3">
                  <DialogTitle className="text-2xl font-bold">Delete Card</DialogTitle>
                  <DialogDescription className="text-base text-muted-foreground">
                    Are you sure you want to delete this card? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDeleting(false)} size="lg">
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={handleDelete}
                    disabled={isDeletingConfirm}
                    size="lg"
                  >
                    {isDeletingConfirm ? 'Deleting...' : 'Delete Card'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>Created: {new Date(card.createdAt).toLocaleString()}</p>
          {card.updatedAt && card.updatedAt !== card.createdAt && (
            <p className="text-muted-foreground">
              Updated: {new Date(card.updatedAt).toLocaleString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
