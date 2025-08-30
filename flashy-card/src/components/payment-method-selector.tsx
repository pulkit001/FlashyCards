'use client';

import { useState } from 'react';
import { useGeoLocation } from '@/hooks/use-geo-location';
import { RazorpayPayment } from '@/components/razorpay-payment';
import { PricingTable } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, CreditCard, IndianRupee } from 'lucide-react';

export function PaymentMethodSelector() {
  const { isIndia, isLoading, country } = useGeoLocation();
  const [selectedMethod, setSelectedMethod] = useState<'auto' | 'razorpay' | 'clerk'>('auto');

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Detecting your location for optimal payment options...</p>
        </CardContent>
      </Card>
    );
  }

  const showRazorpay = selectedMethod === 'razorpay' || (selectedMethod === 'auto' && isIndia);

  return (
    <div className="space-y-6">
      {/* Location Detection Info */}
      <div className="text-center">
        {isIndia ? (
          <div className="text-sm text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 px-4 py-2 rounded-lg inline-block">
            🇮🇳 Detected location: India - Special pricing available with Razorpay
          </div>
        ) : (
          <div className="text-sm text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 px-4 py-2 rounded-lg inline-block">
            🌍 Location: {country || 'International'} - Clerk Billing recommended
          </div>
        )}
      </div>

      {/* Payment Method Toggle (for testing) */}
      <div className="flex justify-center">
        <div className="flex bg-muted rounded-lg p-1">
          <Button
            variant={selectedMethod === 'auto' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedMethod('auto')}
            className="text-xs"
          >
            Auto-detect
          </Button>
          <Button
            variant={selectedMethod === 'razorpay' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedMethod('razorpay')}
            className="text-xs"
          >
            <IndianRupee className="h-3 w-3 mr-1" />
            Razorpay
          </Button>
          <Button
            variant={selectedMethod === 'clerk' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedMethod('clerk')}
            className="text-xs"
          >
            <CreditCard className="h-3 w-3 mr-1" />
            Clerk
          </Button>
        </div>
      </div>

      {/* Payment Options */}
      {showRazorpay ? (
        <div className="grid gap-8 md:grid-cols-2">
          {/* Free Plan */}
          <Card className="border-2 border-muted">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Free Plan</CardTitle>
              <CardDescription className="text-lg">
                Perfect for getting started
              </CardDescription>
              <div className="text-3xl font-bold text-muted-foreground mt-4">
                ₹0
                <span className="text-sm font-normal">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Up to 3 decks</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Basic flashcards</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Standard support</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Pro Plan with Razorpay */}
          <RazorpayPayment />
        </div>
      ) : (
        <PricingTable />
      )}

      {/* Payment Method Info */}
      <div className="text-center text-sm text-muted-foreground">
        {showRazorpay ? (
          <p>
            💳 Paying with Razorpay - Supports UPI, Cards, Wallets & Net Banking
          </p>
        ) : (
          <p>
            💳 Paying with Clerk Billing - Supports international cards
          </p>
        )}
      </div>
    </div>
  );
}
