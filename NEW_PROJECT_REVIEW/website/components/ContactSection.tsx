"use client";

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';

/**
 * Contact section summarising all ways of reaching the restaurant. It
 * lists phone and WhatsApp numbers for each branch, a general email
 * address and links to social media accounts. Numbers and handles are
 * taken from the translation dictionary so that they can easily be
 * localised if necessary.
 */
const ContactSection: React.FC = () => {
  const { language } = useLanguage();
  // Retrieve all contact values from the translation map. Keeping the
  // values inside the translation file avoids hard‑coding them here.
  const riffaPhone = getTranslation(language, ['contact', 'riffaPhone']);
  const riffaWhats = getTranslation(language, ['contact', 'riffaWhatsApp']);
  const galaliPhone = getTranslation(language, ['contact', 'galaliPhone']);
  const galaliWhats = getTranslation(language, ['contact', 'galaliWhatsApp']);
  const email = getTranslation(language, ['contact', 'email']);
  const instagram = getTranslation(language, ['contact', 'instagram']);
  const snapchat = getTranslation(language, ['contact', 'snapchat']);
  const tiktok = getTranslation(language, ['contact', 'tiktok']);

  return (
    <section id="contact" className="section contact-section">
      <h2 className="section-title">
        {getTranslation(language, ['contact', 'title'])}
      </h2>
      <div className="contact-grid">
        <div className="contact-card">
          <h3 className="contact-branch">
            {getTranslation(language, ['branches', 'riffa', 'title'])}
          </h3>
          <p className="contact-item">
            Phone:{' '}
            <a href={`tel:${riffaPhone}`} className="contact-link">
              {riffaPhone}
            </a>
          </p>
          <p className="contact-item">
            WhatsApp:{' '}
            <a
              href={`https://wa.me/${riffaWhats}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              +{riffaWhats}
            </a>
          </p>
        </div>
        <div className="contact-card">
          <h3 className="contact-branch">
            {getTranslation(language, ['branches', 'galali', 'title'])}
          </h3>
          <p className="contact-item">
            Phone:{' '}
            <a href={`tel:${galaliPhone}`} className="contact-link">
              {galaliPhone}
            </a>
          </p>
          <p className="contact-item">
            WhatsApp:{' '}
            <a
              href={`https://wa.me/${galaliWhats}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              +{galaliWhats}
            </a>
          </p>
        </div>
        <div className="contact-card">
          <h3 className="contact-branch">Email &amp; Social</h3>
          <p className="contact-item">
            Email:{' '}
            <a href={`mailto:${email}`} className="contact-link">
              {email}
            </a>
          </p>
          <p className="contact-item">
            Instagram:{' '}
            <a
              href={`https://instagram.com/${instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              {instagram}
            </a>
          </p>
          <p className="contact-item">
            Snapchat:{' '}
            <a
              href={`https://www.snapchat.com/add/${snapchat.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              {snapchat}
            </a>
          </p>
          <p className="contact-item">
            TikTok:{' '}
            <a
              href={`https://www.tiktok.com/@${tiktok.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              {tiktok}
            </a>
          </p>
        </div>
      </div>
      <style jsx>{`
        .contact-section {
          padding: 4rem 1rem;
          background-color: var(--color-background-main);
        }
        .section-title {
          text-align: center;
          margin-bottom: 2rem;
          color: var(--color-gold-primary);
          font-size: 2rem;
          font-weight: 600;
        }
        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          max-width: 1000px;
          margin: 0 auto;
        }
        .contact-card {
          background-color: var(--color-surface);
          padding: 1.5rem;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .contact-branch {
          color: var(--color-gold-primary);
          font-size: 1.2rem;
          margin: 0 0 0.5rem 0;
        }
        .contact-item {
          color: var(--color-text-secondary);
          font-size: 0.9rem;
          margin: 0;
        }
        .contact-link {
          color: var(--color-gold-subtle);
          text-decoration: none;
        }
        .contact-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </section>
  );
};

export default ContactSection;