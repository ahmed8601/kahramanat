"use client";

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';

/**
 * Section component listing the restaurant's branches. Each branch card
 * displays its name, a short description, and quick actions for calling,
 * messaging via WhatsApp and viewing or navigating to the location on
 * Google Maps. Data for phone numbers, WhatsApp numbers and map links
 * are hard‑coded here per the provided requirements; no extra
 * information is invented beyond what was specified.
 */
const BranchesSection: React.FC = () => {
  const { language } = useLanguage();
  const branches = [
    {
      id: 'riffa',
      phone: '17131413',
      whatsapp: '97317131413',
      map: 'https://maps.app.goo.gl/ejSrGQjg5zHHMRVt8',
      navigate: 'https://www.google.com/maps/dir/?api=1&destination=26.1358149,50.5748089'
    },
    {
      id: 'galali',
      phone: '17131213',
      whatsapp: '97317131213',
      map: 'https://maps.app.goo.gl/w3yp778YeyzS8Fwr8',
      navigate: 'https://www.google.com/maps/dir/?api=1&destination=26.2572074,50.6248327'
    }
  ];
  return (
    <section id="branches" className="section branches-section">
      <h2 className="section-title">
        {getTranslation(language, ['branches', 'title'])}
      </h2>
      <div className="branches-grid">
        {branches.map(branch => (
          <div key={branch.id} className="branch-card">
            <h3 className="branch-name">
              {getTranslation(language, ['branches', branch.id, 'title'])}
            </h3>
            <p className="branch-desc">
              {getTranslation(language, ['branches', branch.id, 'description'])}
            </p>
            <div className="branch-actions">
              <a href={`tel:${branch.phone}`} className="branch-link" aria-label="call">
                {branch.phone}
              </a>
              <a
                href={`https://wa.me/${branch.whatsapp}`}
                className="branch-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                WhatsApp
              </a>
              <a
                href={branch.map}
                className="branch-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Map"
              >
                Map
              </a>
              <a
                href={branch.navigate}
                className="branch-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Navigate"
              >
                Navigate
              </a>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .branches-section {
          padding: 4rem 1rem;
          background-color: var(--color-surface);
        }
        .section-title {
          text-align: center;
          margin-bottom: 2rem;
          color: var(--color-gold-primary);
          font-size: 2rem;
          font-weight: 600;
        }
        .branches-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          max-width: 1000px;
          margin: 0 auto;
        }
        .branch-card {
          background-color: var(--color-background-main);
          padding: 1.5rem;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .branch-name {
          color: var(--color-gold-primary);
          font-size: 1.3rem;
          margin: 0;
        }
        .branch-desc {
          color: var(--color-text-secondary);
          font-size: 0.9rem;
          margin: 0;
        }
        .branch-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: auto;
        }
        .branch-link {
          background-color: var(--color-gold-subtle);
          color: var(--color-dark-brown);
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          text-decoration: none;
          font-size: 0.8rem;
          font-weight: 600;
          transition: transform 0.1s ease;
        }
        .branch-link:active {
          transform: scale(0.95);
        }
      `}</style>
    </section>
  );
};

export default BranchesSection;