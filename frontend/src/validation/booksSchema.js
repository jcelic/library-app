import { z } from 'zod';

export const bookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),

  subtitle: z.string().max(255).optional(),

  author: z
    .string()
    .min(1, 'Author is required')
    .max(255, 'Author is too long'),

  category: z.enum(['fiction', 'nonfiction'], {
    message: 'Category is required',
  }),

  imageUrl: z.string().url('Invalid image url').optional().or(z.literal('')),

  status: z.enum(['finished', 'not_finished'], {
    message: 'Select status',
  }),
});
