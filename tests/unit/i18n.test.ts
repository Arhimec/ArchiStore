import { describe, it, expect } from 'vitest';
import { translations } from '@/lib/i18n/translations';

describe('Multilingual Translation Dictionary Integrity', () => {
  it('contains valid dictionaries for English, Romanian, and French', () => {
    expect(translations.en).toBeDefined();
    expect(translations.ro).toBeDefined();
    expect(translations.fr).toBeDefined();
  });

  it('has matching top-level translation sections across all languages', () => {
    const enSections = Object.keys(translations.en).sort();
    const roSections = Object.keys(translations.ro).sort();
    const frSections = Object.keys(translations.fr).sort();

    expect(roSections).toEqual(enSections);
    expect(frSections).toEqual(enSections);
  });

  it('translates core navigation items accurately', () => {
    expect(translations.en.nav.browsePlans).toBe('Browse Stock Plans');
    expect(translations.ro.nav.browsePlans).toBe('Răsfoiește Proiecte');
    expect(translations.fr.nav.browsePlans).toBe('Parcourir les Plans');
  });

  it('translates technical specifications titles correctly', () => {
    expect(translations.en.pdp.totalArea).toBe('TOTAL HEATED AREA');
    expect(translations.ro.pdp.totalArea).toBe('SUPRAFAȚĂ UTILĂ TOTALĂ');
    expect(translations.fr.pdp.totalArea).toBe('SURFACE HABITABLE TOTALE');
  });
});
