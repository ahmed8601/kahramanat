"use client";

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';

/**
 * Simple language switcher that toggles between English and Arabic.
 * It uses the LanguageContext to persist the choice across the app.
 */
const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const toggle = () => setLanguage(language === 'en' ? 'ar' : 'en');
  return (
    <button
      aria-label={getTranslation(language, ['languageSwitcher', 'change'])}
      onClick={toggle}
      className="lang-switch"
    >
      {language === 'en'
        ? getTranslation(language, ['languageSwitcher', 'en'])
        : getTranslation(language, ['languageSwitcher', 'ar'])}
      <style jsx>{`
        .lang-switch {
          background: none;
          border: none;
          color: var(--color-antique-gold);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          transition: transform 0.1s ease;
        }
        .lang-switch:active {
          transform: scale(0.96);
        }
      `}</style>
    </button>
  );
};

export default LanguageSwitcher;