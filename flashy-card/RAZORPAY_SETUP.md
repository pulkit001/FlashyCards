# 🇮🇳 Razorpay Integration Setup Guide

## 📋 Prerequisites

1. **Install Razorpay package:**
   ```bash
   npm install razorpay
   ```

2. **Get Razorpay API Keys:**
   - Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
   - Go to Settings > API Keys
   - Generate Test/Live API Keys

## 🔧 Environment Variables

Add these to your `.env.local` file:

```env
# Razorpay Keys
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id

# Pricing
NEXT_PUBLIC_RAZORPAY_PRO_PRICE=299
```

## 🎯 How It Works

### For Indian Users:
1. **Geo-detection** automatically detects Indian IP addresses
2. **Razorpay pricing** shows ₹299/month instead of Clerk Billing
3. **Payment processing** handles UPI, cards, wallets, and net banking
4. **Automatic upgrade** to Pro plan after successful payment

### For International Users:
- **Clerk Billing** continues to handle payments
- **No changes** to existing workflow

## 🚀 Testing

### Test Mode:
- Use Razorpay test keys (starting with `rzp_test_`)
- Test cards: `4111 1111 1111 1111` (Visa)
- Any future date for expiry
- Any 3-digit CVV

### Production:
- Switch to live keys (starting with `rzp_live_`)
- Enable payment methods in Razorpay dashboard
- Set up webhooks for additional security

## 🔄 Payment Flow

1. **Indian user visits pricing page**
2. **Geo-detection** shows Razorpay option
3. **User clicks "Upgrade to Pro"**
4. **Razorpay checkout** opens
5. **Payment completed** 
6. **Backend verification** confirms payment
7. **Clerk user updated** to Pro plan automatically
8. **User redirected** to success page

## 🛡️ Security Features

- ✅ **Signature verification** ensures payment authenticity
- ✅ **Server-side validation** prevents tampering
- ✅ **Clerk integration** maintains user state
- ✅ **Error handling** for failed payments

## 📊 Features Included

### Geo-Detection Hook (`useGeoLocation`)
- Automatically detects user location
- Fallback for VPN/proxy users
- Caches result for performance

### Razorpay Payment Component
- Beautiful UI matching your theme
- Loading states and error handling
- Mobile-responsive design

### API Routes
- `/api/razorpay/create-order` - Creates payment order
- `/api/razorpay/verify-payment` - Verifies and upgrades user

### Updated Pricing Page
- Smart routing based on location
- Seamless experience for all users
- Consistent branding

## 🎨 Customization

You can customize:
- **Pricing**: Change `NEXT_PUBLIC_RAZORPAY_PRO_PRICE`
- **Currency**: Modify in constants
- **Design**: Update RazorpayPayment component
- **Countries**: Add more countries to geo-detection

## 📞 Support

If you need help:
1. Check Razorpay documentation
2. Test with provided test credentials
3. Monitor browser console for errors
4. Check server logs for API issues

## 🎉 Ready to Go!

Your Razorpay integration is now complete! Indian users will see local pricing and payment methods, while international users continue using Clerk Billing.
