-- Fix schema references to ensure tables are properly in public schema
-- Drop existing foreign key constraints
ALTER TABLE IF EXISTS "cards" DROP CONSTRAINT IF EXISTS "cards_deckId_decks_id_fk";

-- Drop existing tables if they exist in wrong schema
DROP TABLE IF EXISTS "cards";
DROP TABLE IF EXISTS "decks";

-- Recreate tables explicitly in public schema
CREATE TABLE "public"."decks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text,
	"user_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_updated" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "public"."cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"deckId" uuid NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"frontText" text NOT NULL,
	"backText" text NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

-- Add foreign key constraint with proper schema references
ALTER TABLE "public"."cards" ADD CONSTRAINT "cards_deckId_decks_id_fk" 
FOREIGN KEY ("deckId") REFERENCES "public"."decks"("id") ON DELETE cascade ON UPDATE no action;
