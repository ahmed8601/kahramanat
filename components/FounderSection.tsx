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
          <div className="image-card">
            <Image
              src="/assets/owner/owner.webp"
              alt={getTranslation(language, ['founder', 'name'])}
              width={760}
              height={950}
              className="founder-image"
              priority={false}
            />
          </div>
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
          flex: 0 0 420px;
          display: flex;
          justify-content: center;
          position: relative;
        }
        .image-card {
          width: 100%;
          max-width: 420px;
          border-radius: 14px;
          overflow: hidden;
          background: linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.06));
          box-shadow: 0 8px 30px rgba(0,0,0,0.35);
          border: 1px solid rgba(224,179,102,0.06);
          transform: translateZ(0);
        }
        .founder-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          aspect-ratio: 4/5;
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
          .founder-section {
            padding: 2rem 0.75rem;
          }
          .section-title {
            font-size: 1.5rem;
          }
          .section-subtitle {
            font-size: 1rem;
            margin-bottom: 1rem;
          }
          .founder-content {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }
          .image-container {
            flex-basis: auto;
            width: 90%;
            max-width: 360px;
          }
          .image-card {
            max-width: 360px;
            width: 88%;
          }
          .text-container {
            text-align: center;
            padding: 0 0.75rem;
            max-width: 760px;
          }
          .founder-name {
            font-size: 1.35rem;
            letter-spacing: 0.2px;
            margin-top: 6px;
          }
          .founder-role {
            font-size: 1rem;
            color: var(--color-gold-subtle);
          }
          .founder-description {
            font-size: 1rem;
            line-height: 1.7;
            margin-top: 0.75rem;
          }
          .founder-quote {
            margin-top: 1rem;
            font-size: 0.97rem;
            border-inline-start: none;
            padding: 0.5rem 0;
          }
          .founder-quote {
            border-left: none;
            border-right: none;
            padding-left: 0;
            padding-right: 0;
          }
        }

        @keyframes shimmer {
          0% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.7;
          }
        }
      `}</style>
    </section>
  );
};

export default FounderSection;