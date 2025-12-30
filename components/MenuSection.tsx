"use client";

import React, { useEffect, useState } from 'react';
import MenuItemCard from './MenuItemCard';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';
import { validateMenuData } from '../utils/menu';

/**
 * Section component for the restaurant menu. It loads menu items from
 * the public menu.json file. If no items exist the section shows a
 * friendly message indicating that the curated menu will be available
 * soon. No items are hard‑coded; everything is read from the JSON at
 * runtime.
 */
const MenuSection: React.FC = () => {
  const { language } = useLanguage();
  // Hold the full menu data from the JSON including categories, dishes and currency
  const [menuData, setMenuData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  // Track the currently selected category id. Defaults to the first category once data is loaded
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    // Fetch menu data from the public JSON file. If the file does not
    // exist or contains invalid JSON, fall back to an empty array.
    fetch('/menu.json')
      .then(res => res.json())
      .then(data => {
        // Validate and normalize menu structure before usage
        const validated = validateMenuData(data);
        if (validated) {
          setMenuData(validated as any);
          if (Array.isArray(validated.categories) && validated.categories.length > 0) {
            setSelectedCategory(validated.categories[0].id);
          }
        } else {
          setMenuData(null);
        }
      })
      .catch(() => {
        setMenuData(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const hasData = menuData && Array.isArray(menuData.categories) && Array.isArray(menuData.dishes) && menuData.dishes.length > 0;

  // When a category is clicked update selection
  const handleCategoryClick = (id: string) => {
    setSelectedCategory(id);
    // Scroll to menu top when changing category to keep context
    const section = document.getElementById('menu');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="menu" className="section menu-section">
      <h2 className="section-title">
        {getTranslation(language, ['menu', 'title'])}
      </h2>
      {/* Tagline prompting users to pick dishes */}
      <p className="menu-tagline">{getTranslation(language, ['menu', 'tagline'])}</p>
      {loading ? (
        <p className="coming-soon">…</p>
      ) : hasData ? (
        <>
          {/* Category selector bar */}
          <div
            className="category-bar"
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            {menuData.categories.map((cat: any) => (
              <button
                key={cat.id}
                className={`category-tab ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat.id)}
              >
                {cat[language]}
              </button>
            ))}
          </div>
          {/* Dishes grid filtered by selected category */}
          <div className="menu-grid">
            {menuData.dishes
              .filter((dish: any) => !selectedCategory || dish.category === selectedCategory)
              .map((dish: any, index: number) => (
                <MenuItemCard
                  key={dish.id}
                  item={dish}
                  currency={menuData.currency || 'BD'}
                  language={language}
                  // Pass index for animation delay
                  // We'll cast to any because MenuItemCard currently doesn't accept index
                  {...({ index } as any)}
                />
              ))}
          </div>
        </>
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
          margin-bottom: 0.5rem;
          color: var(--color-gold-primary);
          font-size: 2rem;
          font-weight: 600;
        }
        .menu-tagline {
          text-align: center;
          margin-bottom: 1.5rem;
          color: var(--color-gold-subtle);
          font-size: 1rem;
          font-weight: 400;
        }
        .category-bar {
          display: flex;
          overflow-x: auto;
          gap: 1rem;
          padding: 0.5rem 0.25rem;
          margin-bottom: 2rem;
          justify-content: flex-start;
        }
        .category-tab {
          background: none;
          border: none;
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--color-text-secondary);
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: color 0.3s ease, border-color 0.3s ease;
          white-space: nowrap;
        }
        .category-tab.active,
        .category-tab:hover {
          color: var(--color-gold-primary);
          border-color: var(--color-gold-primary);
        }
        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
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