import { db } from "@/db";
import { cards } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { InferSelectModel } from "drizzle-orm";

export type Card = InferSelectModel<typeof cards>;

export async function getDeckCards(deckId: string, userId: string): Promise<Card[]> {
  if (!deckId || !userId) {
    console.error("Deck ID and User ID are required to fetch cards.");
    return [];
  }
  try {
    const deckCards = await db.query.cards.findMany({
      where: and(eq(cards.deckId, deckId), eq(cards.userId, userId)),
    });
    return deckCards;
  } catch (error) {
    console.error("Error fetching deck cards:", error);
    throw new Error("Failed to fetch deck cards.");
  }
}

export async function createCardQuery(deckId: string, userId: string, frontText: string, backText: string, description: string | undefined) {
  try {
    await db.insert(cards).values({
      deckId,
      userId,
      frontText,
      backText,
      description,
    });
  } catch (error) {
    console.error("Error creating card:", error);
    throw new Error("Failed to create card.");
  }
}

export async function deleteCardQuery(cardId: string, userId: string) {
  try {
    const result = await db.delete(cards).where(and(eq(cards.id, cardId), eq(cards.userId, userId)));
    
    if (result.rowCount === 0) {
      throw new Error("Card not found or unauthorized to delete.");
    }
    return cardId;
  } catch (error) {
    console.error("Error deleting card:", error);
    throw new Error("Failed to delete card.");
  }
}

export async function updateCardQuery(cardId: string, userId: string, frontText: string, backText: string, description: string | undefined) {
  try {
    await db.update(cards).set({
      frontText,
      backText,
      description,
      updatedAt: new Date(),
    }).where(and(eq(cards.id, cardId), eq(cards.userId, userId)));
  } catch (error) {
    console.error("Error updating card:", error);
    throw new Error("Failed to update card.");
  }
}

export async function getCardById(cardId: string, userId: string): Promise<Card | undefined> {
  try {
    const card = await db.query.cards.findFirst({
      where: and(eq(cards.id, cardId), eq(cards.userId, userId)),
    });
    return card;
  } catch (error) {
    console.error("Error fetching card by ID:", error);
    throw new Error("Failed to fetch card.");
  }
}

export async function getCardDeckId(cardId: string, userId: string): Promise<string | undefined> {
  try {
    const card = await db.query.cards.findFirst({
      where: and(eq(cards.id, cardId), eq(cards.userId, userId)),
      columns: {
        deckId: true,
      },
    });
    return card?.deckId;
  } catch (error) {
    console.error("Error fetching card deck ID:", error);
    throw new Error("Failed to fetch card deck ID.");
  }
}
