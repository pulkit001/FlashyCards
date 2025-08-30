// App-wide constants
export const APP_CONFIG = {
  // Subscription limits
  FREE_DECK_LIMIT: 3,
  AI_CARDS_PER_GENERATION: 10,
  
  // UI constants
  CARD_MIN_WIDTH: 300,
  CARD_MAX_WIDTH: 400,
  
  // Database limits
  DECK_NAME_MAX_LENGTH: 256,
  CARD_TEXT_MAX_LENGTH: 1000,
  TOPIC_MAX_LENGTH: 256,
  
  // Time constants
  RECENTLY_UPDATED_HOURS: 24,
  SUCCESS_MESSAGE_DELAY: 2000,
  
  // Grid breakpoints
  GRID_BREAKPOINTS: {
    md: 2, // columns at medium screen
    xl: 3, // columns at large screen  
    '2xl': 4, // columns at extra large screen
  },
} as const;

// Plan and feature identifiers
export const SUBSCRIPTION = {
  PLANS: {
    FREE: 'free_user',
    PRO: 'pro_model',
  },
  FEATURES: {
    UNLIMITED_DECKS: 'unlimited_deck_limit',
    AI_CARDS: 'ai_cards',
    BASIC_DECK_LIMIT: '3_deck_limit',
  },
} as const;

// API and external service constants
export const API = {
  GEMINI_MODEL: 'gemini-1.5-flash',
  GEMINI_RETRY_ATTEMPTS: 1,
} as const;

// Route paths
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  PRICING: '/pricing',
  PRICING_SUCCESS: '/pricing/success',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized',
  DECK_LIMIT_REACHED: 'Free users can only create up to 3 decks. Upgrade to Pro for unlimited decks.',
  AI_PRO_REQUIRED: 'AI card generation is a Pro feature. Upgrade to Pro to access AI-powered flashcards.',
  INVALID_DECK_ID: 'Invalid deck ID.',
  CARD_CREATION_FAILED: 'Failed to create card.',
  DECK_CREATION_FAILED: 'Failed to create deck.',
  AI_GENERATION_FAILED: 'Failed to generate AI cards. Please try again later.',
  NO_CARDS_GENERATED: 'No flashcards were generated. Please try a different topic.',
} as const;

// Payment constants
export const PAYMENT = {
  RAZORPAY: {
    CURRENCY: 'INR',
    PRO_PRICE: 299, // in INR
  },
  SUPPORTED_COUNTRIES: {
    INDIA: 'IN',
  },
} as const;

// API endpoints
export const API_ENDPOINTS = {
  RAZORPAY_CREATE_ORDER: '/api/razorpay/create-order',
  RAZORPAY_VERIFY_PAYMENT: '/api/razorpay/verify-payment',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  CARD_CREATED: 'Card created successfully!',
  CARD_UPDATED: 'Card updated successfully!',
  CARD_DELETED: 'Card deleted successfully!',
  DECK_CREATED: 'Deck created successfully!',
  DECK_DELETED: 'Deck deleted successfully!',
  PAYMENT_SUCCESS: 'Payment successful! Welcome to Pro!',
} as const;
