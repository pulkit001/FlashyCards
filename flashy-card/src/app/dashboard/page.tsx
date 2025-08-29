import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { decks } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { InferSelectModel } from 'drizzle-orm';
import { CreateDeckForm } from '@/components/create-deck-form';
import { format } from "date-fns";

type Deck = InferSelectModel<typeof decks>;

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
    userDecks = await db.query.decks.findMany({
      where: eq(decks.userId, userId),
    });
  } catch (error) {
    console.error("Error fetching user decks:", error);
    // Optionally, you can handle the error more gracefully here, e.g., display a message to the user.
  }

  console.log("Fetched user decks:", userDecks);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Your Decks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userDecks.map((deck: Deck) => (
          <div key={deck.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-2">{deck.name}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{deck.description}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Created: {format(new Date(deck.createdAt), "PPP")}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <CreateDeckForm />
      </div>
    </div>
  );
}
