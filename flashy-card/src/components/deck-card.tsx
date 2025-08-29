'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteDeck } from "@/app/dashboard/actions";
import { Deck } from "@/db/queries/decks";
import { DeleteConfirmationDialog } from './delete-confirmation-dialog';
import Link from 'next/link';
import { format } from "date-fns";

interface DeckCardProps {
  deck: Deck;
}

export function DeckCard({ deck }: DeckCardProps) {
  const handleDelete = async () => {
    const formData = new FormData();
    formData.append('id', deck.id);
    
    await deleteDeck(formData);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] w-80 flex-shrink-0">
      <Link href={`/dashboard/decks/${deck.id}`} className="block">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg mb-2">
            {deck.name}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed text-muted-foreground">
            {deck.description || "No description"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          <div className="space-y-3 mb-6">
            <p className="text-xs text-muted-foreground">
              Created: {format(new Date(deck.createdAt), "PPP")}
            </p>
            <p className="text-xs text-muted-foreground">
              Last Updated: {format(new Date(deck.lastUpdated), "PPP")}
            </p>
          </div>
        </CardContent>
      </Link>
      <div className="px-6 pb-4">
        <div className="flex justify-end">
          <DeleteConfirmationDialog
            title="Delete Deck"
            description={`Are you sure you want to delete "${deck.name}"? This will also delete all cards in this deck. This action cannot be undone.`}
            onDelete={handleDelete}
            variant="destructive"
            size="sm"
            trigger={
              <button 
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-destructive text-destructive-foreground hover:bg-destructive/90 px-3 py-2 rounded-md text-sm font-medium"
              >
                Delete
              </button>
            }
          />
        </div>
      </div>
    </Card>
  );
}
