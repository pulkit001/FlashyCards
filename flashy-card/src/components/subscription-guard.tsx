'use client'

import { useSubscription } from '@/hooks/use-subscription'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Crown, Sparkles } from "lucide-react"
import Link from 'next/link'
import { ReactNode } from 'react'
import { SUBSCRIPTION, ROUTES } from '@/lib/constants'
import type { SubscriptionPlan, SubscriptionFeature } from '@/lib/types'

interface SubscriptionGuardProps {
  children: ReactNode
  feature?: SubscriptionFeature
  plan?: SubscriptionPlan
  fallback?: ReactNode
  className?: string
}

export function SubscriptionGuard({ 
  children, 
  feature, 
  plan, 
  fallback, 
  className = "" 
}: SubscriptionGuardProps) {
  const { isLoaded, hasFeature, hasPlan } = useSubscription()

  if (!isLoaded) {
    return (
      <div className={`flex justify-center items-center p-4 ${className}`}>
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  // If checking for a specific plan
  if (plan) {
    const hasAccess = hasPlan(plan)
    if (!hasAccess) {
      return fallback || <DefaultFallback requiredPlan={plan} />
    }
  }

  // If checking for a specific feature
  if (feature) {
    const hasAccess = hasFeature(feature)
    if (!hasAccess) {
      return fallback || <DefaultFallback requiredFeature={feature} />
    }
  }

  return <>{children}</>
}

interface DefaultFallbackProps {
  requiredPlan?: string
  requiredFeature?: string
}

function DefaultFallback({ requiredPlan, requiredFeature }: DefaultFallbackProps) {
  const getFeatureName = (feature: string) => {
    switch (feature) {
      case SUBSCRIPTION.FEATURES.UNLIMITED_DECKS:
        return 'Unlimited Decks'
      case SUBSCRIPTION.FEATURES.AI_CARDS:
        return 'AI-Generated Cards'
      default:
        return 'Premium Feature'
    }
  }

  const getPlanName = (plan: string) => {
    switch (plan) {
      case SUBSCRIPTION.PLANS.PRO:
        return 'Pro'
      case SUBSCRIPTION.PLANS.FREE:
        return 'Free'
      default:
        return 'Premium'
    }
  }

  return (
    <Card className="border-2 border-dashed border-muted-foreground/20">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          {requiredFeature === 'ai_cards' ? (
            <Sparkles className="h-12 w-12 text-primary" />
          ) : (
            <Crown className="h-12 w-12 text-primary" />
          )}
        </div>
        <CardTitle className="text-xl">
          {requiredFeature ? getFeatureName(requiredFeature) : getPlanName(requiredPlan!)} Required
        </CardTitle>
        <CardDescription>
          {requiredFeature === SUBSCRIPTION.FEATURES.UNLIMITED_DECKS && 
            "You've reached the 3 deck limit. Upgrade to Pro for unlimited decks."}
          {requiredFeature === SUBSCRIPTION.FEATURES.AI_CARDS && 
            "Upgrade to Pro to access AI-generated flashcards."}
          {requiredPlan === SUBSCRIPTION.PLANS.PRO && 
            "This feature requires a Pro subscription."}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Link href={ROUTES.PRICING}>
          <Button className="w-full">
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Pro
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
