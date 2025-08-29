// This file will contain server actions for deck-related operations
'use server';
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from 'next/cache';
import { createDeckQuery, deleteDeckQuery, updateDeckQuery, updateDeckLastUpdated } from "@/db/queries/decks";
import { createCardQuery, deleteCardQuery, updateCardQuery, getCardDeckId } from "@/db/queries/cards";

const createDeckSchema = z.object({
  name: z.string().min(1, "Name is required").max(256),
  description: z.string().optional(),
});

export async function createDeck(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const validatedFields = createDeckSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!validatedFields.success) {
    throw new Error(validatedFields.error.message);
  }

  const { name, description } = validatedFields.data;

  await createDeckQuery(name, description, userId);

  revalidatePath("/dashboard");
}

export async function deleteDeck(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const deckId = formData.get("id") as string;

  if (!deckId) {
    console.error("Delete Deck Error: Invalid deck ID received.", { deckId, userId });
    throw new Error("Invalid deck ID.");
  }

  try {
    await deleteDeckQuery(deckId, userId);
    console.log(`Deck ${deckId} deleted successfully by user ${userId}.`);
  } catch (error) {
    console.error(`Delete Deck Error for deck ${deckId} by user ${userId}:`, error);
    throw error; // Re-throw the error after logging
  }

  revalidatePath("/dashboard");
}

const createCardSchema = z.object({
  deckId: z.string(),
  frontText: z.string().min(1, "Front text is required"),
  backText: z.string().min(1, "Back text is required"),
  description: z.string().optional(),
});

export async function createCard(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const validatedFields = createCardSchema.safeParse({
    deckId: formData.get("deckId"),
    frontText: formData.get("frontText"),
    backText: formData.get("backText"),
    description: formData.get("description"),
  });

  if (!validatedFields.success) {
    throw new Error(validatedFields.error.message);
  }

  const { deckId, frontText, backText, description } = validatedFields.data;

  await createCardQuery(deckId, userId, frontText, backText, description);
  await updateDeckLastUpdated(deckId, userId); // Update lastUpdated timestamp for the deck

  revalidatePath(`/dashboard/decks/${deckId}`);
}

const deleteCardSchema = z.object({
  cardId: z.string(),
  deckId: z.string().optional(), // Make deckId optional
});

export async function deleteCard(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const validatedFields = deleteCardSchema.safeParse({
    cardId: formData.get("cardId"),
    deckId: formData.get("deckId"),
  });

  if (!validatedFields.success) {
    throw new Error(validatedFields.error.message);
  }

  const { cardId, deckId: providedDeckId } = validatedFields.data;

  // If deckId is not provided, get it from the card
  const actualDeckId = providedDeckId || await getCardDeckId(cardId, userId);
  if (!actualDeckId) {
    throw new Error("Could not determine deck ID for card.");
  }

  await deleteCardQuery(cardId, userId);
  await updateDeckLastUpdated(actualDeckId, userId); // Update lastUpdated timestamp for the deck

  revalidatePath(`/dashboard/decks/${actualDeckId}`);
}

const updateCardSchema = z.object({
  cardId: z.string(),
  deckId: z.string().optional(), // Make deckId optional
  frontText: z.string().min(1, "Front text is required"),
  backText: z.string().min(1, "Back text is required"),
  description: z.string().optional(),
});

export async function updateCard(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const validatedFields = updateCardSchema.safeParse({
    cardId: formData.get("cardId"),
    deckId: formData.get("deckId"),
    frontText: formData.get("frontText"),
    backText: formData.get("backText"),
    description: formData.get("description"),
  });

  if (!validatedFields.success) {
    throw new Error(validatedFields.error.message);
  }

  const { cardId, deckId: providedDeckId, frontText, backText, description } = validatedFields.data;

  // If deckId is not provided, get it from the card
  const actualDeckId = providedDeckId || await getCardDeckId(cardId, userId);
  if (!actualDeckId) {
    throw new Error("Could not determine deck ID for card.");
  }

  await updateCardQuery(cardId, userId, frontText, backText, description);
  await updateDeckLastUpdated(actualDeckId, userId); // Update lastUpdated timestamp for the deck

  revalidatePath(`/dashboard/decks/${actualDeckId}`);
}
