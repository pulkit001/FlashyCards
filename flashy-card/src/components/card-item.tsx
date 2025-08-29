'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteCard } from "@/app/dashboard/actions";
import { Card as Flashcard } from "@/db/queries/cards";
import { CardForm } from './card-form';
import { DeleteConfirmationDialog } from './delete-confirmation-dialog';
import { X, Edit } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";
import { useCallback } from "react";

interface CardItemProps {
  card: Flashcard;
  deckId: string;
}

export function CardItem({ card, deckId }: CardItemProps) {
  const handleDelete = useCallback(async () => {
    const formData = new FormData();
    formData.append('cardId', card.id);
    formData.append('deckId', deckId);
    
    await deleteCard(formData);
  }, [card.id, deckId]);

  return (
    <Card className="group relative flex-1 min-w-[300px] max-w-[400px] hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20">
      {/* Edit and Delete buttons at top-right */}
      <div className="absolute top-3 right-3 z-10 flex gap-1">
        <CardForm 
          deckId={deckId} 
          card={card}
          trigger={
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-60 hover:opacity-100 hover:bg-muted/80 rounded-full"
            >
              <Edit className="h-3 w-3" />
            </Button>
          }
        />
        
        <DeleteConfirmationDialog
          title="Delete Card"
          description="Are you sure you want to delete this card? This action cannot be undone."
          onDelete={handleDelete}
          trigger={
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-60 hover:opacity-100 hover:bg-destructive/10 hover:text-destructive rounded-full"
            >
              <X className="h-3 w-3" />
            </Button>
          }
        />
      </div>

      <CardHeader className="pb-4 pr-12">
        <CardTitle className="text-lg mb-3 leading-tight">{card.frontText}</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          {card.backText}
        </CardDescription>
        {card.description && (
          <p className="text-xs text-muted-foreground mt-2 italic">
            {card.description}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="text-xs text-muted-foreground border-t pt-3">
          <div className="flex justify-between items-center">
            <span>Created: {new Date(card.createdAt).toLocaleDateString()}</span>
            {card.updatedAt && card.updatedAt !== card.createdAt && (
              <span className="text-muted-foreground">
                Updated: {new Date(card.updatedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
