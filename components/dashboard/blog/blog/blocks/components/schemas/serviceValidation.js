// components/admin/dashboard/service/blocks/components/schemas/serviceValidation.js
import { z } from 'zod';

export const serviceSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(60, 'Title should be less than 60 characters'),
  description: z.string()
    .min(1, 'Description is required')
    .max(160, 'Description should be less than 160 characters'),
  slug: z.string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  keywords: z.string()
    .min(1, 'Keywords are required'),
    businessGoal: z.string()
    .min(1, 'Description is required')
    .max(160, 'Description should be less than 160 characters'),
  status: z.enum(['draft', 'published', 'archived']),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
  content: z.array(z.any()).optional(),
});