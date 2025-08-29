import { PricingTable } from '@clerk/nextjs'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start learning with flashcards for free, or unlock powerful AI features with Pro
          </p>
        </div>

        {/* Simple Pricing Table */}
        <div className="max-w-4xl mx-auto">
          <PricingTable />
        </div>
      </div>
    </div>
  )
}
