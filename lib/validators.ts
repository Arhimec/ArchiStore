import { z } from 'zod';

export const CatalogFilterSchema = z.object({
  search: z.string().optional(),
  minSqm: z.coerce.number().min(0).optional(),
  maxSqm: z.coerce.number().min(0).optional(),
  bedrooms: z.coerce.number().min(0).optional(),
  bathrooms: z.coerce.number().min(0).optional(),
  stories: z.coerce.number().min(0).optional(),
  style: z.string().optional(),
  foundationType: z.string().optional(),
  minWidthM: z.coerce.number().min(0).optional(),
  maxWidthM: z.coerce.number().min(0).optional(),
  minDepthM: z.coerce.number().min(0).optional(),
  maxDepthM: z.coerce.number().min(0).optional(),
  sortBy: z.enum(['price-asc', 'price-desc', 'sqm-asc', 'sqm-desc', 'newest']).default('newest'),
});

export type CatalogFilterInput = z.infer<typeof CatalogFilterSchema>;

export const CheckoutRequestSchema = z.object({
  planId: z.string().uuid().or(z.string().min(1)),
  licenseAgreed: z.literal(true, {
    errorMap: () => ({
      message: 'You must acknowledge the single-build license and engineering stamp requirement before proceeding.',
    }),
  }),
  customerEmail: z.string().email(),
  customerName: z.string().optional(),
});

export type CheckoutRequestInput = z.infer<typeof CheckoutRequestSchema>;

export const PlanCreateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase kebab-case'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  sqm: z.number().int().positive('Sqm must be positive'),
  bedrooms: z.number().int().min(1),
  bathrooms: z.number().positive(),
  stories: z.number().int().min(1),
  garageSpaces: z.number().int().min(0),
  widthM: z.number().positive(),
  depthM: z.number().positive(),
  style: z.string().min(2),
  foundationType: z.string().min(2),
  ceilingHeight: z.string().min(1),
  roofPitch: z.string().min(1),
  price: z.number().positive(),
  isPublished: z.boolean().default(true),
  featured: z.boolean().default(false),
  pdfFileName: z.string().min(1),
  images: z
    .array(
      z.object({
        url: z.string().url('Must be a valid image URL'),
        caption: z.string().optional(),
        isFloorPlan: z.boolean().default(false),
        sortOrder: z.number().int().default(0),
      })
    )
    .optional(),
});

export type PlanCreateInput = z.infer<typeof PlanCreateSchema>;
