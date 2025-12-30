"use client";

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';

/**
 * Section component listing the restaurant's locations. Each location
 * displays its name, a short description, and a click‑to‑call link.
 */
const LocationsSection: React.FC = () => {
  const { language } = useLanguage();
  const locations = [
    {
      id: 'riffa',
      phone: '+97311112222'
    },
    {
      id: 'galali',
      phone: '+97333334444'
    }
  ];
  return (
    <section id="locations" className="section locations-section">
      <h2 className="section-title">{getTranslation(language, ['locations', 'title'])}</h2>
      <div className="locations-grid">
        {locations.map(loc => (
          <div key={loc.id} className="location-card">
            <h3 className="location-title">{getTranslation(language, ['locations', loc.id, 'title'])}</h3>
            <p className="location-desc">{getTranslation(language, ['locations', loc.id, 'description'])}</p>
            <a href={`tel:${loc.phone}`} className="call-link">
              {loc.phone}
            </a>
          </div>
        ))}
      </div>
      <style jsx>{`
        .locations-section {
          padding: 4rem 1rem;
          background-color: var(--color-surface);
        }
        .section-title {
          text-align: center;
          margin-bottom: 2rem;
          color: var(--color-antique-gold);
          font-size: 2rem;
          font-weight: 600;
        }
        .locations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          max-width: 1000px;
          margin: 0 auto;
        }
        .location-card {
          background-color: var(--color-background-main);
          padding: 1.5rem;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }
        .location-title {
          color: var(--color-antique-gold);
          font-size: 1.2rem;
          margin: 0;
        }
        .location-desc {
          color: var(--color-text-secondary);
          font-size: 0.9rem;
          margin: 0;
        }
        .call-link {
          margin-top: auto;
          color: var(--color-soft-copper);
          font-weight: 600;
          text-decoration: none;
          font-size: 0.9rem;
        }
        .call-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </section>
  );
};

export default LocationsSection;