import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const decks = pgTable("decks", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description"),
  userId: varchar("userId", { length: 256 }).notNull(), // Auth0 user ID
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  deckId: serial("deckId").references(() => decks.id).notNull(),
  frontText: text("frontText").notNull(),
  backText: text("backText").notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
