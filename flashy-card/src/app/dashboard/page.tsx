import { auth } from "@clerk/nextjs/server";
import { CreateDeckForm } from "@/components/create-deck-form";
import { getUserDecks, Deck, getUserDeckCount } from "@/db/queries/decks";
import { DeckCard } from "@/components/deck-card";
import { SubscriptionGuard } from "@/components/subscription-guard";
import { APP_CONFIG, SUBSCRIPTION } from "@/lib/constants";
import { UnauthorizedError } from "@/lib/errors";
import { PageContainer } from "@/components/ui/layout";
import { Flex, CardGrid } from "@/components/ui/layout";
import { PageTitle } from "@/components/ui/typography";
import { EmptyState, UsageStats } from "@/components/ui/status";


export default async function DashboardPage() {
  const { userId, has } = await auth();

  console.log("Authenticated userId:", userId);

  if (!userId) {
    throw new UnauthorizedError();
  }

  const hasProPlan = has({ plan: SUBSCRIPTION.PLANS.PRO });
  
  let userDecks: Deck[] = [];
  let deckCount = 0;
  try {
    userDecks = await getUserDecks(userId);
    deckCount = await getUserDeckCount(userId);
  } catch (error) {
    console.error("Error fetching user decks:", error);
    // Optionally, you can handle the error more gracefully here, e.g., display a message to the user.
  }

  console.log("Fetched user decks:", userDecks);
  console.log("User deck count:", deckCount);
  console.log("Has Pro plan:", hasProPlan);

  const canCreateMoreDecks = hasProPlan || deckCount < APP_CONFIG.FREE_DECK_LIMIT;

  return (
    <PageContainer>
      <Flex variant="between" className="mb-10" gap="lg">
        <div className="space-y-3">
          <PageTitle>Your Decks</PageTitle>
          {!hasProPlan && (
            <UsageStats
              current={deckCount}
              limit={APP_CONFIG.FREE_DECK_LIMIT}
              label="Decks"
              plan="Free"
            />
          )}
        </div>
        
        {canCreateMoreDecks ? (
          <CreateDeckForm />
        ) : (
          <SubscriptionGuard feature={SUBSCRIPTION.FEATURES.UNLIMITED_DECKS}>
            <CreateDeckForm />
          </SubscriptionGuard>
        )}
      </Flex>
      
      {userDecks.length === 0 ? (
        <EmptyState
          icon={<div className="text-6xl">📚</div>}
          title="No decks yet"
          description="Create your first deck to get started with flashcards!"
          action={
            canCreateMoreDecks ? (
              <CreateDeckForm />
            ) : (
              <SubscriptionGuard feature={SUBSCRIPTION.FEATURES.UNLIMITED_DECKS}>
                <CreateDeckForm />
              </SubscriptionGuard>
            )
          }
        />
      ) : (
        <CardGrid variant="cards">
          {userDecks.map((deck: Deck) => (
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </CardGrid>
      )}
    </PageContainer>
  );
}
