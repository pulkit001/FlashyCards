import { auth } from "@clerk/nextjs/server";
import { CreateDeckForm } from "@/components/create-deck-form";
import { getUserDecks, Deck } from "@/db/queries/decks";
import { DeckCard } from "@/components/deck-card";


export default async function DashboardPage() {
  const { userId } = await auth();

  console.log("Authenticated userId:", userId);

  if (!userId) {
    // Handle unauthenticated user, perhaps redirect to sign-in
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1>Please sign in to view your dashboard.</h1>
      </div>
    );
  }

  let userDecks: Deck[] = [];
  try {
    userDecks = await getUserDecks(userId);
  } catch (error) {
    console.error("Error fetching user decks:", error);
    // Optionally, you can handle the error more gracefully here, e.g., display a message to the user.
  }

  console.log("Fetched user decks:", userDecks);

  return (

<div className="container mx-auto p-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
        <h1 className="text-4xl font-bold text-foreground">Your Decks</h1>
        <CreateDeckForm />
      </div>
      
      {userDecks.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-semibold text-muted-foreground mb-2">No decks yet</h2>
          <p className="text-muted-foreground mb-6">Create your first deck to get started with flashcards!</p>
          <CreateDeckForm />
        </div>
      ) : (
        <div className="flex flex-wrap gap-6">
          {userDecks.map((deck: Deck) => (
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </div>
      )}
    </div>
  );
}
