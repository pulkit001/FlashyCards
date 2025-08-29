'use client'

import { useUser } from '@clerk/nextjs'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Crown, Sparkles } from "lucide-react"
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function PricingSuccessPage() {
  const { user } = useUser()
  const [isNewPro, setIsNewPro] = useState(false)

  useEffect(() => {
    // Check if user just upgraded to pro
    const hasProPlan = user?.publicMetadata?.plan === 'pro_model'
    setIsNewPro(hasProPlan)
  }, [user])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Header */}
          <div className="mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <CheckCircle className="h-20 w-20 text-green-500" />
                {isNewPro && (
                  <Crown className="h-8 w-8 text-yellow-500 absolute -top-2 -right-2" />
                )}
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Welcome to Pro!
            </h1>
            <p className="text-xl text-muted-foreground">
              Your subscription is now active. Enjoy unlimited flashcards and AI-powered features!
            </p>
          </div>

          {/* Pro Features Card */}
          <Card className="mb-8 border-2 border-primary shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-primary mr-2" />
                <CardTitle className="text-2xl">Pro Features Unlocked</CardTitle>
              </div>
              <CardDescription className="text-lg">
                Here's what you can now do with your Pro subscription
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4 text-left">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Create unlimited flashcard decks</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Generate cards using AI technology</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Access advanced study modes</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Track your learning progress</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Get priority customer support</span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link href="/dashboard">
              <Button size="lg" className="w-full md:w-auto">
                Start Creating Decks
              </Button>
            </Link>
            <div className="text-sm text-muted-foreground">
              Ready to create your first AI-powered flashcard deck?
            </div>
          </div>

          {/* Support Info */}
          <div className="mt-12 p-6 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-2">Need Help Getting Started?</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Check out our help section or contact support for assistance with your new Pro features.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link href="/help">
                <Button variant="outline" size="sm">
                  View Help Docs
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
