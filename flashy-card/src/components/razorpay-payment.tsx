'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, CheckCircle, Sparkles, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RazorpayInstance {
  open(): void;
  on(event: string, handler: () => void): void;
}

interface RazorpayConstructor {
  new (options: unknown): RazorpayInstance;
}

declare global {
  interface Window {
    Razorpay: RazorpayConstructor;
  }
}

export function RazorpayPayment() {
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      setScriptLoaded(false);
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePayment = async () => {
    if (!scriptLoaded || !window.Razorpay) {
      alert('Payment system is loading. Please try again in a moment.');
      return;
    }

    setIsLoading(true);

    try {
      // Create order
      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: 299, // ₹299 for Pro plan
          currency: 'INR'
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Razorpay options
      const options: Record<string, unknown> = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Flashy Cards',
        description: 'Pro Plan Subscription - Unlimited Decks & AI Cards',
        order_id: orderData.orderId,
        handler: async function (response: Record<string, unknown>) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // Redirect to success page
              router.push('/pricing/success');
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support if amount was deducted.');
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: user?.fullName || '',
          email: user?.primaryEmailAddress?.emailAddress || '',
        },
        notes: {
          userId: user?.id,
          plan: 'pro_model'
        },
        theme: {
          color: '#000000',
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-2 border-primary shadow-lg">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Crown className="h-12 w-12 text-yellow-500" />
        </div>
        <CardTitle className="text-2xl">Pro Plan</CardTitle>
        <CardDescription className="text-lg">
          Perfect for power users who want unlimited access
        </CardDescription>
        <div className="text-3xl font-bold text-primary mt-4">
          ₹299
          <span className="text-sm text-muted-foreground font-normal">/month</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
            <span>Unlimited flashcard decks</span>
          </div>
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 text-purple-500 mr-3" />
            <span>AI-generated cards</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
            <span>Advanced study modes</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
            <span>Priority support</span>
          </div>
        </div>
        
        <Button 
          onClick={handlePayment} 
          disabled={isLoading || !scriptLoaded}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : !scriptLoaded ? (
            'Loading...'
          ) : (
            'Upgrade to Pro'
          )}
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          🔒 Secure payment powered by Razorpay
        </p>
      </CardContent>
    </Card>
  );
}
