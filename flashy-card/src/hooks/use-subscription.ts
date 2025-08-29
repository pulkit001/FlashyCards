'use client';

import { useAuth } from '@clerk/nextjs';
import { SUBSCRIPTION } from '@/lib/constants';
import type { SubscriptionPlan, SubscriptionFeature } from '@/lib/types';

export interface UseSubscriptionReturn {
  isLoaded: boolean;
  isProUser: boolean;
  isFreeUser: boolean;
  currentPlan: SubscriptionPlan | null;
  hasFeature: (feature: SubscriptionFeature) => boolean;
  hasPlan: (plan: SubscriptionPlan) => boolean;
  canCreateDecks: boolean;
  canUseAI: boolean;
  hasUnlimitedDecks: boolean;
}

export function useSubscription(): UseSubscriptionReturn {
  const { isLoaded, has } = useAuth();

  const isProUser = isLoaded ? has({ plan: SUBSCRIPTION.PLANS.PRO }) : false;
  const isFreeUser = isLoaded ? has({ plan: SUBSCRIPTION.PLANS.FREE }) : false;

  const hasFeature = (feature: SubscriptionFeature): boolean => {
    if (!isLoaded) return false;
    return has({ feature });
  };

  const hasPlan = (plan: SubscriptionPlan): boolean => {
    if (!isLoaded) return false;
    return has({ plan });
  };

  // Determine current plan
  const currentPlan: SubscriptionPlan | null = isLoaded
    ? isProUser
      ? SUBSCRIPTION.PLANS.PRO
      : isFreeUser
      ? SUBSCRIPTION.PLANS.FREE
      : null
    : null;

  // Feature shortcuts
  const canCreateDecks = isLoaded && (isProUser || hasFeature(SUBSCRIPTION.FEATURES.BASIC_DECK_LIMIT));
  const canUseAI = isLoaded && hasFeature(SUBSCRIPTION.FEATURES.AI_CARDS);
  const hasUnlimitedDecks = isLoaded && hasFeature(SUBSCRIPTION.FEATURES.UNLIMITED_DECKS);

  return {
    isLoaded,
    isProUser,
    isFreeUser,
    currentPlan,
    hasFeature,
    hasPlan,
    canCreateDecks,
    canUseAI,
    hasUnlimitedDecks,
  };
}
