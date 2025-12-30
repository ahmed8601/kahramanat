"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Language } from '../utils/translations';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

// Default context values. These will be replaced by the provider.
const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  setLanguage: () => {}
});

/**
 * Provider component for managing language selection. It persists the chosen
 * language in localStorage so that it is remembered across sessions. It
 * also updates the document direction attribute to support RTL layouts.
 */
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Hydrate language from localStorage if present
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('language') : null;
    if (stored === 'en' || stored === 'ar') {
      setLanguageState(stored);
    }
  }, []);

  useEffect(() => {
    // Persist language
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('language', language);
      // Update HTML lang and dir attributes
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Hook to access the language context.
 */
export const useLanguage = () => useContext(LanguageContext);