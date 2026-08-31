'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('archistore_lang') as Language;
    if (saved && (saved === 'en' || saved === 'ro' || saved === 'fr')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('archistore_lang', lang);
    }
  };

  const t = (path: string): string => {
    const keys = path.split('.');
    let currentDict: any = translations[language] || translations.en;
    let fallbackDict: any = translations.en;

    for (const key of keys) {
      if (currentDict && currentDict[key] !== undefined) {
        currentDict = currentDict[key];
      } else {
        currentDict = null;
        break;
      }
    }

    if (currentDict && typeof currentDict === 'string') {
      return currentDict;
    }

    // Fallback to English
    for (const key of keys) {
      if (fallbackDict && fallbackDict[key] !== undefined) {
        fallbackDict = fallbackDict[key];
      } else {
        return path; // Return key path if missing
      }
    }

    return typeof fallbackDict === 'string' ? fallbackDict : path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
