import { z } from 'zod';
import { APP_CONFIG } from './constants';

// Common validation schemas
export const commonSchemas = {
  id: z.string().min(1, 'ID is required'),
  email: z.string().email('Invalid email address'),
  url: z.string().url('Invalid URL'),
  nonEmptyString: z.string().min(1, 'This field is required'),
  optionalString: z.string().optional(),
} as const;

// Deck validation schemas
export const deckSchemas = {
  name: z.string()
    .min(1, 'Deck name is required')
    .max(APP_CONFIG.DECK_NAME_MAX_LENGTH, `Deck name must be ${APP_CONFIG.DECK_NAME_MAX_LENGTH} characters or less`),
  description: z.string().optional(),
  
  createDeck: z.object({
    name: z.string()
      .min(1, 'Deck name is required')
      .max(APP_CONFIG.DECK_NAME_MAX_LENGTH, `Deck name must be ${APP_CONFIG.DECK_NAME_MAX_LENGTH} characters or less`),
    description: z.string().optional(),
  }),
  
  updateDeck: z.object({
    id: commonSchemas.id,
    name: z.string()
      .min(1, 'Deck name is required')
      .max(APP_CONFIG.DECK_NAME_MAX_LENGTH, `Deck name must be ${APP_CONFIG.DECK_NAME_MAX_LENGTH} characters or less`),
    description: z.string().optional(),
  }),
} as const;

// Card validation schemas
export const cardSchemas = {
  frontText: z.string()
    .min(1, 'Front text is required')
    .max(APP_CONFIG.CARD_TEXT_MAX_LENGTH, `Front text must be ${APP_CONFIG.CARD_TEXT_MAX_LENGTH} characters or less`),
  backText: z.string()
    .min(1, 'Back text is required')
    .max(APP_CONFIG.CARD_TEXT_MAX_LENGTH, `Back text must be ${APP_CONFIG.CARD_TEXT_MAX_LENGTH} characters or less`),
  description: z.string().optional(),
  
  createCard: z.object({
    deckId: commonSchemas.id,
    frontText: z.string()
      .min(1, 'Front text is required')
      .max(APP_CONFIG.CARD_TEXT_MAX_LENGTH, `Front text must be ${APP_CONFIG.CARD_TEXT_MAX_LENGTH} characters or less`),
    backText: z.string()
      .min(1, 'Back text is required')
      .max(APP_CONFIG.CARD_TEXT_MAX_LENGTH, `Back text must be ${APP_CONFIG.CARD_TEXT_MAX_LENGTH} characters or less`),
    description: z.string().optional(),
  }),
  
  updateCard: z.object({
    id: commonSchemas.id,
    deckId: commonSchemas.id,
    frontText: z.string()
      .min(1, 'Front text is required')
      .max(APP_CONFIG.CARD_TEXT_MAX_LENGTH, `Front text must be ${APP_CONFIG.CARD_TEXT_MAX_LENGTH} characters or less`),
    backText: z.string()
      .min(1, 'Back text is required')
      .max(APP_CONFIG.CARD_TEXT_MAX_LENGTH, `Back text must be ${APP_CONFIG.CARD_TEXT_MAX_LENGTH} characters or less`),
    description: z.string().optional(),
  }),
} as const;

// AI generation validation schemas
export const aiSchemas = {
  topic: z.string()
    .min(1, 'Topic is required')
    .max(APP_CONFIG.TOPIC_MAX_LENGTH, `Topic must be ${APP_CONFIG.TOPIC_MAX_LENGTH} characters or less`),
  count: z.number()
    .int('Count must be an integer')
    .min(1, 'Count must be at least 1')
    .max(50, 'Count must be 50 or less'),
  
  generateCards: z.object({
    topic: z.string()
      .min(1, 'Topic is required')
      .max(APP_CONFIG.TOPIC_MAX_LENGTH, `Topic must be ${APP_CONFIG.TOPIC_MAX_LENGTH} characters or less`),
    deckId: commonSchemas.id,
    count: z.number()
      .int('Count must be an integer')
      .min(1, 'Count must be at least 1')
      .max(50, 'Count must be 50 or less')
      .default(APP_CONFIG.AI_CARDS_PER_GENERATION),
  }),
} as const;

// Utility function to validate form data
export function validateFormData<T>(
  schema: z.ZodSchema<T>, 
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors = result.error.issues.map((err: z.ZodIssue) => {
    const path = err.path.join('.');
    return path ? `${path}: ${err.message}` : err.message;
  });
  
  return { success: false, errors };
}

// Utility function to extract and validate form data
export function extractFormData(formData: FormData) {
  const obj: Record<string, any> = {};
  for (const [key, value] of formData.entries()) {
    if (obj[key]) {
      if (Array.isArray(obj[key])) {
        obj[key].push(value);
      } else {
        obj[key] = [obj[key], value];
      }
    } else {
      obj[key] = value;
    }
  }
  return obj;
}

// Utility to create form validation error messages
export function formatValidationErrors(errors: string[]): string {
  if (errors.length === 1) {
    return errors[0];
  }
  
  if (errors.length === 2) {
    return `${errors[0]} and ${errors[1]}`;
  }
  
  const lastError = errors.pop();
  return `${errors.join(', ')}, and ${lastError}`;
}
