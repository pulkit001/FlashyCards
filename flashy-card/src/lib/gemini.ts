import { GoogleGenerativeAI } from '@google/generative-ai';
import { APP_CONFIG, API, ERROR_MESSAGES } from './constants';
import { AppError, DatabaseError } from './errors';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is required');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export interface FlashCard {
  question: string;
  answer: string;
}

interface GenerateFlashcardsOptions {
  topic: string;
  count?: number;
  retryAttempts?: number;
}

export async function generateFlashcards(
  options: GenerateFlashcardsOptions | string,
  legacyCount?: number
): Promise<FlashCard[]> {
  // Support both new options object and legacy string + count parameters
  const { topic, count, retryAttempts } = typeof options === 'string' 
    ? { topic: options, count: legacyCount ?? APP_CONFIG.AI_CARDS_PER_GENERATION, retryAttempts: API.GEMINI_RETRY_ATTEMPTS }
    : { count: APP_CONFIG.AI_CARDS_PER_GENERATION, retryAttempts: API.GEMINI_RETRY_ATTEMPTS, ...options };
  try {
    const model = genAI.getGenerativeModel({ model: API.GEMINI_MODEL });
    
    const prompt = `Generate exactly ${count} flashcards for the topic: "${topic}".

Each flashcard should have a clear question and a concise answer that helps with learning and understanding the topic.

Format your response as a JSON array with exactly this structure:
[
  {
    "question": "Clear, specific question about the topic",
    "answer": "Concise, accurate answer"
  }
]

Requirements:
- Questions should be diverse (definitions, examples, applications, comparisons, etc.)
- Answers should be informative but concise (1-3 sentences)
- Focus on key concepts and practical knowledge
- Ensure questions are clear and unambiguous
- Make flashcards educational and useful for studying

Topic: ${topic}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return parseAndValidateFlashcards(text, count);
    
  } catch (error) {
    console.error('Error generating flashcards:', error);
    
    if (error instanceof AppError) {
      throw error;
    }
    
    if (error instanceof Error) {
      throw new AppError(error.message);
    }
    
    throw new AppError(ERROR_MESSAGES.AI_GENERATION_FAILED  );
}

function parseAndValidateFlashcards(text: string, count: number): FlashCard[] {
  // Extract JSON from the response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new AppError('Failed to parse flashcards from AI response');
  }
  
  let flashcards: unknown;
  try {
    flashcards = JSON.parse(jsonMatch[0]);
  } catch {
    throw new AppError('Invalid JSON response from AI');
  }
  
  // Validate the response structure
  if (!Array.isArray(flashcards) || flashcards.length === 0) {
    throw new AppError(ERROR_MESSAGES.NO_CARDS_GENERATED);
  }
  
  // Validate and filter each flashcard
  const validFlashcards = flashcards.filter((card): card is FlashCard => 
    isValidFlashcard(card)
  );
  
  if (validFlashcards.length === 0) {
    throw new AppError(ERROR_MESSAGES.NO_CARDS_GENERATED);
  }
  
  // Return exactly the requested count (or as many as we got)
  return validFlashcards.slice(0, count);
}

function isValidFlashcard(card: unknown): card is FlashCard {
  return (
    typeof card === 'object' &&
    card !== null &&
    'question' in card &&
    'answer' in card &&
    typeof card.question === 'string' &&
    typeof card.answer === 'string' &&
    card.question.trim().length > 0 &&
    card.answer.trim().length > 0
  );
}
}
