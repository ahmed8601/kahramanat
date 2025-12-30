"use client";

import Image from 'next/image';
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';

export interface MenuItemData {
  id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
}

interface MenuItemCardProps {
  item: MenuItemData;
}

/**
 * Card component representing a single menu item. Data is passed
 * entirely through props; names, descriptions and prices are not
 * translated automatically because the JSON defines them. Only UI
 * elements like the add button and feedback messages are translated.
 */
const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const { addItem } = useCart();
  const { language } = useLanguage();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({ id: item.id, name: item.name, price: item.price, image: item.image });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="menu-card">
      <div className="image-wrapper">
        <Image
          src={item.image}
          alt={item.name}
          width={400}
          height={300}
          className="menu-image"
          priority={false}
        />
      </div>
      <h3 className="menu-title">{item.name}</h3>
      {item.description && (
        <p className="menu-description">{item.description}</p>
      )}
      <div className="menu-footer">
        <span className="menu-price">{item.price.toFixed(2)}&nbsp;BHD</span>
        <button className="add-btn" onClick={handleAdd} aria-label="add to cart">
          {getTranslation(language, ['menu', 'addToCart'])}
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
          border-radius: 8px;
          overflow: hidden;
          position: relative;
          transition: transform 0.2s ease;
        }
        .menu-card:active {
          transform: scale(0.96);
        }
        .image-wrapper {
          position: relative;
          width: 100%;
          height: 0;
          padding-bottom: 65%;
        }
        .menu-image {
          object-fit: cover;
        }
        .menu-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0.5rem 0.75rem 0;
          color: var(--color-text-primary);
        }
        .menu-description {
          flex-grow: 1;
          font-size: 0.9rem;
          margin: 0.25rem 0.75rem;
          color: var(--color-text-secondary);
          line-height: 1.4;
        }
        .menu-footer {
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
          background-color: var(--color-gold-primary);
          color: var(--color-dark-brown);
          border: none;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
          transition: transform 0.1s ease;
        }
        .add-btn:active {
          transform: scale(0.96);
        }
        .add-feedback {
          position: absolute;
          bottom: 0.5rem;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(0, 0, 0, 0.6);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          color: var(--color-gold-primary);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default MenuItemCard;