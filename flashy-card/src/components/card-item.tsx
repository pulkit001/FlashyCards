'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteCard } from "@/app/dashboard/actions";
import { Card as Flashcard } from "@/db/queries/cards";
import { CardForm } from './card-form';
import { DeleteConfirmationDialog } from './delete-confirmation-dialog';

interface CardItemProps {
  card: Flashcard;
  deckId: string;
}

export function CardItem({ card, deckId }: CardItemProps) {
  const handleDelete = async () => {
    const formData = new FormData();
    formData.append('cardId', card.id);
    formData.append('deckId', deckId);
    
    await deleteCard(formData);
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
            <CardForm deckId={deckId} card={card} />
            
            <DeleteConfirmationDialog
              title="Delete Card"
              description="Are you sure you want to delete this card? This action cannot be undone."
              onDelete={handleDelete}
              variant="destructive"
              size="sm"
            />
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
