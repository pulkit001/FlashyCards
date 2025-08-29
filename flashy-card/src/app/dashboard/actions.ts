// This file will contain server actions for deck-related operations
'use server';
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from 'next/cache';
import { createDeckQuery, deleteDeckQuery, updateDeckQuery, updateDeckLastUpdated, getUserDeckCount } from "@/db/queries/decks";
import { createCardQuery, deleteCardQuery, updateCardQuery, getCardDeckId } from "@/db/queries/cards";
import { generateFlashcards } from "@/lib/gemini";
import { APP_CONFIG, SUBSCRIPTION, ERROR_MESSAGES, ROUTES } from "@/lib/constants";
import { UnauthorizedError, SubscriptionError, ValidationError, AppError } from "@/lib/errors";
import type { CreateDeckFormData, CreateCardFormData, UpdateCardFormData, GenerateCardsFormData, GenerateCardsResult } from "@/lib/types";

const createDeckSchema = z.object({
  name: z.string().min(1, "Name is required").max(APP_CONFIG.DECK_NAME_MAX_LENGTH),
  description: z.string().optional(),
});

export async function createDeck(formData: FormData) {
  const { userId, has } = await auth();

  if (!userId) {
    throw new UnauthorizedError();
  }

  // Check if user has pro plan
  const hasProPlan = has({ plan: SUBSCRIPTION.PLANS.PRO });
  
  // If user is not pro, check deck limit
  if (!hasProPlan) {
    const currentDeckCount = await getUserDeckCount(userId);
    if (currentDeckCount >= APP_CONFIG.FREE_DECK_LIMIT) {
      throw new SubscriptionError(ERROR_MESSAGES.DECK_LIMIT_REACHED);
    }
  }

  const validatedFields = createDeckSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!validatedFields.success) {
    throw new ValidationError(validatedFields.error.message);
  }

  const { name, description } = validatedFields.data;

  await createDeckQuery(name, description, userId);

  revalidatePath(ROUTES.DASHBOARD);
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
  frontText: z.string().min(1, "Front text is required").max(APP_CONFIG.CARD_TEXT_MAX_LENGTH),
  backText: z.string().min(1, "Back text is required").max(APP_CONFIG.CARD_TEXT_MAX_LENGTH),
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

const generateCardsSchema = z.object({
  topic: z.string().min(1, "Topic is required").max(APP_CONFIG.TOPIC_MAX_LENGTH),
  deckId: z.string().min(1, "Deck ID is required"),
});

export async function generateAICards(formData: FormData): Promise<GenerateCardsResult> {
  const { userId, has } = await auth();

  if (!userId) {
    throw new UnauthorizedError();
  }

  // Check if user has pro plan - AI features are Pro only
  const hasProPlan = has({ plan: SUBSCRIPTION.PLANS.PRO });
  if (!hasProPlan) {
    throw new SubscriptionError(ERROR_MESSAGES.AI_PRO_REQUIRED);
  }

  const validatedFields = generateCardsSchema.safeParse({
    topic: formData.get("topic"),
    deckId: formData.get("deckId"),
  });

  if (!validatedFields.success) {
    throw new Error(validatedFields.error.message);
  }

  const { topic, deckId } = validatedFields.data;

  try {
    // Generate flashcards using AI
    const flashcards = await generateFlashcards({ topic, count: APP_CONFIG.AI_CARDS_PER_GENERATION });
    
    if (flashcards.length === 0) {
      throw new AppError(ERROR_MESSAGES.NO_CARDS_GENERATED);
    }

    // Create cards in the database
    const createdCards = [];
    for (const flashcard of flashcards) {
      try {
        await createCardQuery(deckId, userId, flashcard.question, flashcard.answer, undefined);
        createdCards.push(flashcard);
      } catch (error) {
        console.error("Error creating card:", error);
        // Continue with other cards even if one fails
      }
    }

    if (createdCards.length === 0) {
      throw new Error("Failed to create cards. Please try again.");
    }

    // Update deck timestamp
    await updateDeckLastUpdated(deckId, userId);

    revalidatePath(`/dashboard/decks/${deckId}`);
    
    return {
      success: true,
      count: createdCards.length,
      message: `Successfully generated ${createdCards.length} AI-powered flashcards!`
    };

  } catch (error) {
    console.error("Error generating AI cards:", error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error("Failed to generate AI cards. Please try again later.");
  }
}
