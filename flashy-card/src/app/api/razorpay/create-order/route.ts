import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Razorpay from 'razorpay';

// Initialize Razorpay only if environment variables are available
const createRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  
  if (!keyId || !keySecret) {
    return null;
  }
  
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

export async function POST(request: NextRequest) {
  try {
    // Check if Razorpay is configured
    const razorpay = createRazorpayInstance();
    if (!razorpay) {
      return NextResponse.json(
        { error: 'Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.' },
        { status: 500 }
      );
    }

    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { amount, currency = 'INR' } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    const options = {
      amount: Math.round(amount * 100), // Amount in paise
      currency,
      receipt: `receipt_${userId}_${Date.now()}`,
      notes: {
        userId,
        plan: 'pro_model',
        created_at: new Date().toISOString(),
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });

  } catch (error) {
    console.error('Razorpay create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
