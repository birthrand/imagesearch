import { z } from 'zod';

export const searchSchema = z.object({
  query: z
    .string({ required_error: 'Query is required' })
    .trim()
    .min(1, 'Query must contain at least one character')
    .max(100, 'Query must be less than 100 characters'),
  page: z
    .coerce.number()
    .int('Page must be an integer')
    .min(1, 'Page must be greater than 0')
    .max(50, 'Page cannot exceed 50')
    .optional()
    .default(1),
  perPage: z
    .coerce.number()
    .int('perPage must be an integer')
    .min(1, 'perPage must be greater than 0')
    .max(30, 'perPage cannot exceed 30')
    .optional()
    .default(10)
});

export class InputValidationError extends Error {
  constructor(issues) {
    super('Invalid input');
    this.name = 'InputValidationError';
    this.issues = issues;
  }
}

export function parseSearchInput(input) {
  const result = searchSchema.safeParse(input);

  if (!result.success) {
    const { fieldErrors } = result.error.flatten();
    throw new InputValidationError(fieldErrors);
  }

  return result.data;
}
