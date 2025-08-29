// This file will contain server actions for deck-related operations
'use server';
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { decks } from "@/db/schema";
import { revalidatePath } from 'next/cache';

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

  await db.insert(decks).values({
    name,
    description,
    userId,
  });

  revalidatePath("/dashboard");
}
