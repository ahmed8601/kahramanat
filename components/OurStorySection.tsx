"use client";

import Image from 'next/image';
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';

/**
 * Section telling the story of the restaurant. Combines a visual from
 * the provided assets with translated title, subtitle, body text and
 * a highlighted quote. The layout adapts between LTR and RTL based on
 * the selected language.
 */
const OurStorySection: React.FC = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  return (
    <section id="story" className="section story-section">
      <h2 className="section-title">
        {getTranslation(language, ['story', 'title'])}
      </h2>
      <h3 className="section-subtitle">
        {getTranslation(language, ['story', 'subtitle'])}
      </h3>
      <div
        className="story-content"
        style={{ flexDirection: isArabic ? 'row-reverse' : 'row' }}
      >
        <div className="story-image">
          {/* Image container with subtle motion and overlay effect */}
          <Image
            src="/assets/story/story.webp"
            alt="Story"
            width={500}
            height={400}
            className="image"
            priority={false}
          />
        </div>
        <div
          className="story-text"
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          <p className="description">
            {getTranslation(language, ['story', 'description'])}
          </p>
          <blockquote className="quote">
            {getTranslation(language, ['story', 'quote'])}
          </blockquote>
        </div>
      </div>
      <style jsx>{`
        .story-section {
          padding: 4rem 1rem;
          background-color: var(--color-background-main);
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
        .story-content {
          display: flex;
          align-items: flex-start;
          gap: 2rem;
          max-width: 1100px;
          margin: 0 auto;
        }
        .story-image {
          flex: 0 0 500px;
          display: flex;
          justify-content: center;
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          max-height: 460px;
        }
        .story-image::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            145deg,
            rgba(0, 0, 0, 0.4) 0%,
            rgba(58, 42, 31, 0.6) 100%
          );
          pointer-events: none;
        }
        .image {
          border-radius: 12px;
          object-fit: cover;
          width: 100%;
          height: 100%;
          transform: scale(1.03);
          /* subtle motion only on large viewports */
          animation: none;
        }
        .story-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          text-align: inherit;
          /* Animate text entrance */
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUpStory 1s ease forwards;
          animation-delay: 0.3s;
        }
        .description {
          color: var(--color-text-secondary);
          font-size: 0.95rem;
          line-height: 1.6;
        }
        .quote {
          margin-top: 1rem;
          font-style: italic;
          color: var(--color-gold-subtle);
          border-inline-start: 3px solid var(--color-gold-primary);
          padding: 0.5rem 1rem;
        }
        @media (max-width: 768px) {
          .story-section {
            padding: 2rem 0.75rem;
          }
          .section-title {
            font-size: 1.5rem;
          }
          .section-subtitle {
            font-size: 1rem;
            margin-bottom: 1rem;
          }
          .story-content {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }
          .story-image {
            flex-basis: auto;
            width: 90%;
            max-width: 420px;
            max-height: 360px;
          }
          .image {
            width: 100%;
            height: auto;
            transform: none;
            animation: none;
          }
          .story-text {
            text-align: center;
            padding: 0 0.75rem;
            max-width: 760px;
            font-size: 1rem;
          }
          .quote {
            border-inline-start: none;
            padding: 0.5rem 0.5rem;
          }
        }

        @keyframes panImage {
          from {
            transform: scale(1.05) translateY(-4%);
          }
          to {
            transform: scale(1.05) translateY(4%);
          }
        }

        @keyframes fadeInUpStory {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default OurStorySection;