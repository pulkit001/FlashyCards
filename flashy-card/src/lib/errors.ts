import { ERROR_MESSAGES } from './constants';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public field?: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = ERROR_MESSAGES.UNAUTHORIZED) {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'UnauthorizedError';
  }
}

export class SubscriptionError extends AppError {
  constructor(message: string) {
    super(message, 'SUBSCRIPTION_ERROR', 403);
    this.name = 'SubscriptionError';
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, originalError?: unknown) {
    super(message, 'DATABASE_ERROR', 500);
    this.name = 'DatabaseError';
    
    if (originalError) {
      console.error('Original database error:', originalError);
    }
  }
}

// Error handling utility
export function handleError(error: unknown): never {
  if (error instanceof AppError) {
    throw error;
  }
  
  if (error instanceof Error) {
    throw new AppError(error.message);
  }
  
  throw new AppError('An unexpected error occurred');
}

// Safe async function wrapper
export function safeAsync<T extends any[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      return handleError(error);
    }
  };
}

// Type guard for checking if error is of specific type
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

export function isUnauthorizedError(error: unknown): error is UnauthorizedError {
  return error instanceof UnauthorizedError;
}

export function isSubscriptionError(error: unknown): error is SubscriptionError {
  return error instanceof SubscriptionError;
}
