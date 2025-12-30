"use client";

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';
import Image from 'next/image';
import MenuSection from '../components/MenuSection';
import FounderSection from '../components/FounderSection';
import OurStorySection from '../components/OurStorySection';
import BranchesSection from '../components/BranchesSection';
import ContactSection from '../components/ContactSection';

/**
 * The main page of the restaurant website. It composes all the
 * sections defined in the information architecture and provides a
 * hero header with a striking background image. All text content is
 * retrieved from the translation utility according to the current
 * language selected in the context.
 */
export default function HomePage() {
  const { language } = useLanguage();
  return (
    <div id="top">
      <section className="hero-section">
        {/* Use the new premium hero image from the assets folder. The image covers the
         entire hero section and is loaded responsively. */}
        <Image
          src="/assets/hero/hero-poster.webp"
          alt="Hero"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="overlay">
          <h1 className="hero-title">
            {getTranslation(language, ['hero', 'title'])}
          </h1>
          <p className="hero-subtitle">
            {getTranslation(language, ['hero', 'subtitle'])}
          </p>
        </div>
      </section>
      <MenuSection />
      <FounderSection />
      <OurStorySection />
      <BranchesSection />
      <ContactSection />
      <style jsx>{`
        .hero-section {
          position: relative;
          height: 70vh;
          width: 100%;
          overflow: hidden;
        }
        /* Reduce hero height on small devices so navigation and menu are visible */
        @media (max-width: 390px) {
          .hero-section {
            height: 45vh;
          }
        }
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          /* Create a gradient mask behind the text for improved contrast */
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.6) 0%,
            rgba(0, 0, 0, 0.4) 40%,
            rgba(0, 0, 0, 0.6) 100%
          );
          backdrop-filter: blur(2px);
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 1.2s ease-out forwards;
        }
        .hero-title {
          font-size: 2.7rem;
          color: var(--color-gold-primary);
          margin: 0;
          text-align: center;
          text-shadow: 0 2px 6px rgba(0, 0, 0, 0.8);
        }
        .hero-subtitle {
          font-size: 1.3rem;
          color: var(--color-gold-subtle);
          margin-top: 0.5rem;
          text-align: center;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
        }
        @media (max-width: 768px) {
          .hero-title {
            font-size: 1.8rem;
          }
          .hero-subtitle {
            font-size: 1rem;
          }
        }

        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}