import { db } from "@/db";
import { decks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { InferSelectModel } from "drizzle-orm";
import { and } from "drizzle-orm";

export type Deck = InferSelectModel<typeof decks>;

export async function getUserDecks(userId: string): Promise<Deck[]> {
  if (!userId) {
    console.error("User ID is required to fetch decks.");
    return [];
  }
  try {
    const userDecks = await db.query.decks.findMany({
      where: eq(decks.userId, userId),
    });
    return userDecks;
  } catch (error) {
    console.error("Error fetching user decks:", error);
    throw new Error("Failed to fetch user decks.");
  }
}

export async function createDeckQuery(name: string, description: string | undefined, userId: string) {
  try {
    await db.insert(decks).values({
      name,
      description,
      userId,
      lastUpdated: new Date(),
    });
  } catch (error) {
    console.error("Error creating deck:", error);
    throw new Error("Failed to create deck.");
  }
}

export async function deleteDeckQuery(deckId: string, userId: string) {
  try {
    const result = await db.delete(decks).where(and(eq(decks.id, deckId), eq(decks.userId, userId)));

    if (result.rowCount === 0) {
      throw new Error("Deck not found or unauthorized to delete.");
    }
    return deckId; // Return the deleted deckId if successful
  } catch (error) {
    console.error("Error deleting deck:", error);
    throw new Error("Failed to delete deck.");
  }
}

export async function getDeckById(deckId: string, userId: string): Promise<Deck | undefined> {
  try {
    const deck = await db.query.decks.findFirst({
      where: and(eq(decks.id, deckId), eq(decks.userId, userId)),
    });
    return deck;
  } catch (error) {
    console.error("Error fetching deck by ID:", error);
    throw new Error("Failed to fetch deck.");
  }
}

export async function updateDeckQuery(deckId: string, userId: string, name: string, description: string | undefined) {
  try {
    await db.update(decks).set({
      name,
      description,
      lastUpdated: new Date(),
    }).where(and(eq(decks.id, deckId), eq(decks.userId, userId)));
  } catch (error) {
    console.error("Error updating deck:", error);
    throw new Error("Failed to update deck.");
  }
}

export async function updateDeckLastUpdated(deckId: string, userId: string) {
  try {
    await db.update(decks).set({
      lastUpdated: new Date(),
    }).where(and(eq(decks.id, deckId), eq(decks.userId, userId)));
  } catch (error) {
    console.error("Error updating deck last updated timestamp:", error);
    throw new Error("Failed to update deck last updated timestamp.");
  }
}
