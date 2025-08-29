ALTER TABLE "public"."cards" DROP CONSTRAINT "cards_deckId_decks_id_fk";
--> statement-breakpoint
ALTER TABLE "public"."cards" ADD CONSTRAINT "cards_deckId_decks_id_fk" FOREIGN KEY ("deckId") REFERENCES "public"."decks"("id") ON DELETE cascade ON UPDATE no action;