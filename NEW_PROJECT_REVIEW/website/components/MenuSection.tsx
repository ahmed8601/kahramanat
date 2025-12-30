"use client";

import React, { useEffect, useState } from 'react';
import MenuItemCard from './MenuItemCard';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';

/**
 * Section component for the restaurant menu. It loads menu items from
 * the public menu.json file. If no items exist the section shows a
 * friendly message indicating that the curated menu will be available
 * soon. No items are hard‑coded; everything is read from the JSON at
 * runtime.
 */
const MenuSection: React.FC = () => {
  const { language } = useLanguage();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch menu data from the public JSON file. If the file does not
    // exist or contains invalid JSON, fall back to an empty array.
    fetch('/menu.json')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          setItems([]);
        }
      })
      .catch(() => {
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const hasItems = items && items.length > 0;

  return (
    <section id="menu" className="section menu-section">
      <h2 className="section-title">
        {getTranslation(language, ['menu', 'title'])}
      </h2>
      {loading ? (
        <p className="coming-soon">…</p>
      ) : hasItems ? (
        <div className="menu-grid">
          {items.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="coming-soon">
          {getTranslation(language, ['menu', 'empty'])}
        </p>
      )}
      <style jsx>{`
        .menu-section {
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
        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .coming-soon {
          text-align: center;
          color: var(--color-text-secondary);
          font-size: 1rem;
        }
      `}</style>
    </section>
  );
};

export default MenuSection;