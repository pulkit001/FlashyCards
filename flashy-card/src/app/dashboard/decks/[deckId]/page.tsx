
import { auth } from "@clerk/nextjs/server";
import { SUBSCRIPTION } from "@/lib/constants";
import { notFound } from "next/navigation";
import { getDeckCards, Card as Flashcard } from "@/db/queries/cards";
import { getDeckById, Deck } from "@/db/queries/decks";
import { CardForm } from "@/components/card-form";
import { CardItem } from "@/components/card-item";
import { RefreshButton } from "@/components/refresh-button";
import { AIGenerateCards } from "@/components/ai-generate-cards";
import { SubscriptionGuard } from "@/components/subscription-guard";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageContainer, Flex, CardGrid } from "@/components/ui/layout";
import { PageTitle, Muted } from "@/components/ui/typography";
import { EmptyState, StatusBadge } from "@/components/ui/status";
import { isRecentlyUpdated } from "@/lib/utils";

interface DeckDetailPageProps {
  params: Promise<{
    deckId: string;
  }>;
}

// This helper function is now imported from utils

export default async function DeckDetailPage({ params }: DeckDetailPageProps) {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1>Please sign in to view this deck.</h1>
      </div>
    );
  }

  const { deckId } = await params;

  // No need for isNaN check as deckId is now a string
  // if (isNaN(deckId)) {
  //   notFound();
  // }

  let deckCards: Flashcard[] = [];
  let deck: Deck | undefined;

  try {
    deck = await getDeckById(deckId, userId);
    if (!deck) {
      notFound();
    }
    deckCards = await getDeckCards(deckId, userId);
  } catch (error) {
    console.error("Error fetching deck or cards:", error);
    // Optionally, you can handle the error more gracefully here, e.g., display a message to the user.
  }

  return (
    <main className="container mx-auto flex flex-col gap-8 py-8 max-w-7xl">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-6">
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard">← Return to Decks</Link>
            </Button>
            <RefreshButton />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">{deck?.name}</h1>
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-medium text-foreground text-base">
                {deckCards.length} card{deckCards.length !== 1 ? 's' : ''}
              </p>
              {deck?.createdAt && (
                <p>Created: {new Date(deck.createdAt).toLocaleString()}</p>
              )}
              {deck?.lastUpdated && (
                <p className={`${isRecentlyUpdated(deck.lastUpdated) ? 'text-muted-foreground font-medium' : ''}`}>
                  Last Updated: {new Date(deck.lastUpdated).toLocaleString()}
                  {isRecentlyUpdated(deck.lastUpdated) && ' (Recently)'}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <SubscriptionGuard feature={SUBSCRIPTION.FEATURES.AI_CARDS}>
            <AIGenerateCards deckId={deckId} />
          </SubscriptionGuard>
          <CardForm deckId={deckId} />
        </div>
      </div>
      
      {deckCards.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-6">🃏</div>
          <h2 className="text-2xl font-semibold text-muted-foreground mb-3">No cards yet</h2>
          <p className="text-muted-foreground mb-8">Create your first card manually or generate 10 cards with AI!</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                      <SubscriptionGuard feature={SUBSCRIPTION.FEATURES.AI_CARDS}>
            <AIGenerateCards deckId={deckId} />
          </SubscriptionGuard>
            <CardForm deckId={deckId} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {deckCards.map((card: Flashcard) => (
            <CardItem key={card.id} card={card} deckId={deckId} />
          ))}
        </div>
      )}
    </main>
  );
}
