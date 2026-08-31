import { describe, it, expect } from 'vitest';
import { PlanCreateSchema } from '@/lib/validators';

describe('Admin Plan Creation Validation & Image Upload Payload', () => {
  it('validates a complete plan creation payload including custom images', () => {
    const payload = {
      title: 'The Riviera Horizon Villa',
      slug: 'riviera-horizon-villa',
      description: 'Luxury 2-story contemporary residence with glass facades and pool pavilion.',
      sqm: 320,
      bedrooms: 4,
      bathrooms: 3.5,
      stories: 2,
      garageSpaces: 2,
      widthM: 16.5,
      depthM: 19.5,
      style: 'Modern',
      foundationType: 'Slab',
      ceilingHeight: '3.0m Ground / 2.8m Upper',
      roofPitch: '10° Monolithic',
      price: 1650,
      isPublished: true,
      featured: true,
      pdfFileName: 'riviera-construction-set.pdf',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          caption: 'Main Exterior Elevation',
          isFloorPlan: false,
          sortOrder: 0,
        },
        {
          url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
          caption: 'First Level Floor Plan Schematic',
          isFloorPlan: true,
          sortOrder: 1,
        },
      ],
    };

    const result = PlanCreateSchema.safeParse(payload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.images?.length).toBe(2);
      expect(result.data.images?.[1].isFloorPlan).toBe(true);
      expect(result.data.sqm).toBe(320);
    }
  });

  it('rejects plan creation payload with missing required specs or invalid image URL', () => {
    const invalidPayload = {
      title: 'Invalid Villa',
      slug: 'invalid-villa',
      description: 'Too short',
      sqm: -10, // Invalid negative sqm
      bedrooms: 0,
      bathrooms: 0,
      stories: 0,
      garageSpaces: 0,
      widthM: 0,
      depthM: 0,
      style: 'Modern',
      foundationType: 'Slab',
      ceilingHeight: '2.7m',
      roofPitch: '30°',
      price: -500,
      pdfFileName: '',
      images: [
        {
          url: 'not-a-valid-url',
          caption: 'Bad Image',
          isFloorPlan: false,
        },
      ],
    };

    const result = PlanCreateSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
  });
});
