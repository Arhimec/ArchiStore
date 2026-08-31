import { describe, it, expect } from 'vitest';

function calculateOrderTotal(basePrice: number, quantity = 1, taxRate = 0.0) {
  const subtotal = basePrice * quantity;
  const tax = subtotal * taxRate;
  return Math.round((subtotal + tax) * 100) / 100;
}

function calculatePricePerSqft(price: number, sqft: number) {
  if (sqft <= 0) return 0;
  return Math.round((price / sqft) * 100) / 100;
}

describe('Architectural Stock Plan Financial & Metric Calculations', () => {
  it('calculates order total accurately with tax', () => {
    const total = calculateOrderTotal(1250.0, 1, 0.08); // 8% sales tax
    expect(total).toBe(1350.0);
  });

  it('calculates price per square foot correctly', () => {
    const pricePerSqft = calculatePricePerSqft(1250.0, 2500);
    expect(pricePerSqft).toBe(0.5);
  });

  it('handles bulk plan pricing without rounding errors', () => {
    const total = calculateOrderTotal(950.0, 2, 0.0);
    expect(total).toBe(1900.0);
  });
});
