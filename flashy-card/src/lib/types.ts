import { SUBSCRIPTION } from './constants';

// Subscription types
export type SubscriptionPlan = typeof SUBSCRIPTION.PLANS[keyof typeof SUBSCRIPTION.PLANS];
export type SubscriptionFeature = typeof SUBSCRIPTION.FEATURES[keyof typeof SUBSCRIPTION.FEATURES];

// Form data types
export interface CreateDeckFormData {
  name: string;
  description?: string;
}

export interface CreateCardFormData {
  deckId: string;
  frontText: string;
  backText: string;
  description?: string;
}

export interface UpdateCardFormData extends CreateCardFormData {
  cardId: string;
}

export interface GenerateCardsFormData {
  deckId: string;
  topic: string;
}

// API response types
export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface GenerateCardsResult {
  success: boolean;
  count: number;
  message: string;
}

// Component prop types
export interface BaseModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
}

export interface TriggerProps {
  trigger?: React.ReactNode;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Date utility type
export interface Timestamps {
  createdAt: Date;
  updatedAt?: Date;
}

// User session types
export interface UserSession {
  userId: string;
  plan: SubscriptionPlan;
  hasFeature: (feature: SubscriptionFeature) => boolean;
  hasPlan: (plan: SubscriptionPlan) => boolean;
}

// Component state types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface FormState<T = Record<string, unknown>> extends LoadingState {
  data: T;
  isDirty: boolean;
  isValid: boolean;
}
