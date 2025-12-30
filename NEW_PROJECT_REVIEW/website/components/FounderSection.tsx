"use client";

import Image from 'next/image';
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';

/**
 * Section introducing the founder. Presents a portrait alongside
 * translated details including subtitle, name, role, description and
 * a quote. The layout flips direction based on the active language to
 * support both LTR and RTL reading orders seamlessly.
 */
const FounderSection: React.FC = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  return (
    <section id="founder" className="section founder-section">
      <h2 className="section-title">
        {getTranslation(language, ['founder', 'title'])}
      </h2>
      <h3 className="section-subtitle">
        {getTranslation(language, ['founder', 'subtitle'])}
      </h3>
      <div
        className="founder-content"
        style={{ flexDirection: isArabic ? 'row-reverse' : 'row' }}
      >
        <div className="image-container">
          <Image
            src="/founder.webp"
            alt={getTranslation(language, ['founder', 'name'])}
            width={400}
            height={400}
            className="founder-image"
            priority={false}
          />
        </div>
        <div
          className="text-container"
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          <h4 className="founder-name">
            {getTranslation(language, ['founder', 'name'])}
          </h4>
          <p className="founder-role">
            {getTranslation(language, ['founder', 'role'])}
          </p>
          <p className="founder-description">
            {getTranslation(language, ['founder', 'description'])}
          </p>
          <blockquote className="founder-quote">
            {getTranslation(language, ['founder', 'quote'])}
          </blockquote>
        </div>
      </div>
      <style jsx>{`
        .founder-section {
          padding: 4rem 1rem;
          background-color: var(--color-surface);
        }
        .section-title {
          text-align: center;
          margin-bottom: 1rem;
          color: var(--color-gold-primary);
          font-size: 2rem;
          font-weight: 600;
        }
        .section-subtitle {
          text-align: center;
          margin-bottom: 2rem;
          color: var(--color-gold-subtle);
          font-size: 1.2rem;
          font-weight: 500;
        }
        .founder-content {
          display: flex;
          align-items: flex-start;
          gap: 2rem;
          max-width: 1100px;
          margin: 0 auto;
        }
        .image-container {
          flex: 0 0 400px;
          display: flex;
          justify-content: center;
        }
        .founder-image {
          border-radius: 8px;
          object-fit: cover;
        }
        .text-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          text-align: inherit;
        }
        .founder-name {
          color: var(--color-gold-primary);
          font-size: 1.5rem;
          margin: 0;
        }
        .founder-role {
          color: var(--color-gold-subtle);
          font-size: 1rem;
          margin: 0;
        }
        .founder-description {
          color: var(--color-text-secondary);
          font-size: 0.95rem;
          line-height: 1.5;
          margin-top: 0.5rem;
        }
        .founder-quote {
          margin-top: 1rem;
          font-style: italic;
          color: var(--color-gold-subtle);
          border-inline-start: 3px solid var(--color-gold-primary);
          padding: 0.5rem 1rem;
        }
        @media (max-width: 768px) {
          .founder-content {
            flex-direction: column;
            align-items: center;
          }
          .image-container {
            flex-basis: auto;
            width: 80%;
          }
          .text-container {
            text-align: center;
          }
          .founder-quote {
            border-left: none;
            border-right: none;
          }
        }
      `}</style>
    </section>
  );
};

export default FounderSection;