import { z } from 'zod';

export const shelfSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Shelf name is required')
    .max(100, 'Shelf name is too long'),
});
