import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // Check if Razorpay secret is configured
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpaySecret) {
      return NextResponse.json(
        { error: 'Razorpay is not configured. Please set RAZORPAY_KEY_SECRET environment variable.' },
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

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment details' },
        { status: 400 }
      );
    }

    // Verify signature
    const shasum = crypto.createHmac('sha256', razorpaySecret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Update user to Pro plan in Clerk
    const clerk = await clerkClient();
    await clerk.users.updateUser(userId, {
      publicMetadata: {
        plan: 'pro_model',
        paymentMethod: 'razorpay',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        upgradeDate: new Date().toISOString(),
      }
    });

    return NextResponse.json({ 
      message: 'Payment verified and user upgraded to Pro',
      success: true 
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
