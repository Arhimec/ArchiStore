import { describe, it, expect } from 'vitest';
import { CheckoutRequestSchema, CatalogFilterSchema, PlanCreateSchema } from '@/lib/validators';

describe('Zod Schema Validation & Legal Checkbox Enforcement', () => {
  it('rejects checkout request if licenseAgreed is false or missing', () => {
    const invalidPayload = {
      planId: '123e4567-e89b-12d3-a456-426614174000',
      licenseAgreed: false,
      customerEmail: 'buyer@example.com',
    };

    const result = CheckoutRequestSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
  });

  it('accepts checkout request when licenseAgreed is explicitly true', () => {
    const validPayload = {
      planId: '123e4567-e89b-12d3-a456-426614174000',
      licenseAgreed: true,
      customerEmail: 'buyer@example.com',
      customerName: 'Alice Architect',
    };

    const result = CheckoutRequestSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it('parses catalog filter query parameters safely', () => {
    const rawFilter = {
      search: 'farmhouse',
      minSqm: '150',
      maxSqm: '300',
      bedrooms: '3',
      style: 'Farmhouse',
      sortBy: 'price-asc',
    };

    const result = CatalogFilterSchema.safeParse(rawFilter);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.minSqm).toBe(150);
      expect(result.data.bedrooms).toBe(3);
    }
  });

  it('validates plan creation schema for admin endpoints', () => {
    const planPayload = {
      title: 'Modern Minimalist Villa',
      slug: 'modern-minimalist-villa',
      description: 'High-end luxury single story residence.',
      sqm: 260,
      bedrooms: 4,
      bathrooms: 3.5,
      stories: 1,
      garageSpaces: 2,
      widthM: 15,
      depthM: 18,
      style: 'Modern',
      foundationType: 'Slab',
      ceilingHeight: '3.0m Monolithic',
      roofPitch: '2° Flat',
      price: 1450,
      isPublished: true,
      featured: true,
      pdfFileName: 'villa-construction-set.pdf',
    };

    const result = PlanCreateSchema.safeParse(planPayload);
    expect(result.success).toBe(true);
  });
});
