"use client";

import Image from 'next/image';
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';

export interface MenuItemData {
  id: string;
  category?: string;
  image: string;
  price?: number | null;
  priceLabel?: { [lang: string]: string };
  name: string | { [lang: string]: string };
  desc?: string | { [lang: string]: string };
}

interface MenuItemCardProps {
  item: MenuItemData;
  currency: string;
  language: 'en' | 'ar';
  /**
   * Optional index of this card in the list. Used to stagger
   * entrance animations when displaying a set of products. If
   * undefined the default animation delay is zero.
   */
  index?: number;
}

/**
 * Card component representing a single menu item. Data is passed
 * entirely through props; names, descriptions and prices are not
 * translated automatically because the JSON defines them. Only UI
 * elements like the add button and feedback messages are translated.
 */
const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, currency, language, index }) => {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  // Resolve name and description based on language. Fallback to string if provided directly.
  const name = typeof item.name === 'object' ? item.name[language] : (item.name as any);
  const description =
    item.desc && typeof item.desc === 'object'
      ? item.desc[language]
      : (item.desc as any);
  // Determine price display. If price is provided use currency, otherwise use the price label in the current language.
  let priceDisplay = '';
  if (item.price !== undefined && item.price !== null && typeof item.price === 'number') {
    priceDisplay = `${item.price.toFixed(3)} ${currency}`;
  } else {
    const pl = (item as any).priceLabel;
    if (typeof pl === 'string' && pl.trim().length > 0) {
      priceDisplay = pl;
    } else if (pl && typeof pl === 'object' && pl[language]) {
      priceDisplay = pl[language];
    } else {
      priceDisplay = language === 'ar' ? 'السعر عند الطلب' : 'Price on request';
    }
  }

  const handleAdd = () => {
    console.log('[MenuItemCard] handleAdd clicked for item:', item && item.id ? item.id : item, 'name:', item && item.name ? item.name : 'unknown');
    try {
      const sizes = (item as any).sizes;
      const hasPriceField = Object.prototype.hasOwnProperty.call(item, 'price');
      const rawPrice = hasPriceField ? (item as any).price : undefined;

      // Fixed price: add directly
      if (typeof rawPrice === 'number') {
        console.log('[MenuItemCard] Adding fixed-price item:', item.id, 'price:', rawPrice);
        addItem(item as any);
        console.log('[MenuItemCard] addItem called, setAdded(true)');
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
        return;
      }

      // price === null and sizes array -> trigger size-selection logic
      if (rawPrice === null && Array.isArray(sizes) && sizes.length > 0) {
        try {
          const labels = sizes.map((s: any, i: number) => `${i + 1}: ${s.label || s.name || s.title || `Size ${i + 1}`}`).join('\n');
          const promptText = (language === 'ar' ? 'اختر رقم المقاس:' : 'Choose size number:');
          const answer = window.prompt(`${labels}\n\n${promptText}`);
          if (!answer) return;
          const idx = parseInt(answer, 10) - 1;
          if (Number.isNaN(idx) || idx < 0 || idx >= sizes.length) return;
          const sizeLabel = sizes[idx].label || sizes[idx].name || String(idx + 1);
          console.log('[MenuItemCard] Adding item with size index', idx, 'label', sizeLabel);
          addItem(item as any, { selectedSizeIndex: idx, sizeLabel });
          setAdded(true);
          setTimeout(() => setAdded(false), 1200);
        } catch (err) {
          console.error('[MenuItemCard] size selection failed', err);
        }
        return;
      }

      // price === null and no sizes -> add as price-on-request
      console.log('[MenuItemCard] Adding price-on-request item:', item.id);
      addItem(item as any);
      setAdded(true);
      setTimeout(() => setAdded(false), 1200);
    } catch (err) {
      console.error('[MenuItemCard] handleAdd unexpected error', err);
    }
  };

  return (
    <div
      className="menu-card"
      style={{
        // Staggered animation delay based on index (max 0.6s). Default to 0
        animationDelay: `${index ? index * 70 : 0}ms`
      }}
    >
      <div className="image-wrapper">
        {/* Prefix image paths that do not start with a slash so they resolve from the public root. */}
        <Image
          src={item.image.startsWith('/') ? item.image : `/${item.image}`}
          alt={typeof item.name === 'object' ? (item.name as any)[language] : (item.name as any)}
          width={400}
          height={300}
          className="menu-image"
          priority={false}
        />
      </div>
      <h3 className="menu-title">{name}</h3>
      {description && (
        <p className="menu-description">{description}</p>
      )}
      <div className="menu-footer">
        <span className="menu-price">{priceDisplay}</span>
        <button className="add-btn" onClick={handleAdd} aria-label={language === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}>
          {language === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}
        </button>
      </div>
      {added && (
        <span className="add-feedback">
          {getTranslation(language, ['menu', 'added'])}
        </span>
      )}
      <style jsx>{`
        .menu-card {
            display: flex;
            flex-direction: column;
            background-color: var(--color-surface);
            border-radius: 10px;
            overflow: hidden;
            /* ensure stacking context for child layering */
            position: relative;
            z-index: 0;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            animation: fadeInUp 0.6s ease forwards;
          }
        .menu-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 14px rgba(0, 0, 0, 0.3);
        }
        .menu-card:active {
          transform: scale(0.97);
        }
        .image-wrapper {
          /* Use modern aspect-ratio for predictable sizing across browsers
             and keep the image visually underneath the content. */
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          z-index: 0;
        }
        .menu-image {
          /* Position image absolutely to fully cover the wrapper while
             remaining beneath textual content. Disable pointer-events so
             taps/clicks reach the CTA. */
          object-fit: cover;
          display: block;
          width: 100% !important;
          height: 100% !important;
          position: absolute !important;
          inset: 0 !important;
          z-index: 0 !important;
          pointer-events: none;
        }
        .menu-title {
          position: relative;
          z-index: 1;
          font-size: 1.05rem;
          font-weight: 600;
          margin: 0.5rem 0.75rem 0;
          color: var(--color-text-primary);
        }
        .menu-description {
          position: relative;
          z-index: 1;
          flex-grow: 1;
          font-size: 0.85rem;
          margin: 0.25rem 0.75rem;
          color: var(--color-text-secondary);
          line-height: 1.4;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .menu-footer {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0.75rem 0.75rem;
        }
        .menu-price {
          font-size: 1rem;
          font-weight: 500;
          color: var(--color-gold-primary);
        }
        .add-btn {
          position: relative;
          z-index: 2; /* ensure CTA sits above the image */
          background-color: var(--color-gold-primary);
          color: var(--color-dark-brown);
          border: none;
          padding: 0.35rem 0.8rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 600;
          transition: background-color 0.2s ease, transform 0.1s ease;
        }
        .add-btn:hover {
          background-color: var(--color-gold-subtle);
        }
        .add-btn:active {
          transform: scale(0.95);
        }
        .add-feedback {
          position: absolute;
          bottom: 0.5rem;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(0, 0, 0, 0.6);
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          font-size: 0.75rem;
          color: var(--color-gold-primary);
          pointer-events: none;
          z-index: 3;
          animation: fadeInOut 1.2s ease forwards;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInOut {
          0% {
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default MenuItemCard;