import { z } from 'zod';

export const createBookSchema = z.object({
  title: z.string().trim().min(1).max(255),

  subtitle: z.string().trim().max(255).nullable().optional(),

  author: z.string().trim().min(1).max(255),

  category: z.enum(['fiction', 'nonfiction']),

  image_source_url: z.string().url().nullable().optional(),

  status: z.enum(['finished', 'not_finished']),

  list_type: z.enum(['owned', 'wishlist']),

  is_favorite: z.boolean(),
});

export const updateBookSchema = createBookSchema;
