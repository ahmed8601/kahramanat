"use client";

import React from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';

interface CartOverlayProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Overlay panel that displays cart contents. Slides in from the right
 * when open. Provides controls to remove items and to clear the cart.
 */
const CartOverlay: React.FC<CartOverlayProps> = ({ open, onClose }) => {
  const { items, removeItem, totalPrice, totalQuantity, clear } = useCart();
  const { language } = useLanguage();
  return (
    <div className={`cart-overlay ${open ? 'open' : ''}`}> 
      <div className="cart-header">
        <h2>{getTranslation(language, ['cart', 'title'])}</h2>
        <button className="close-btn" onClick={onClose} aria-label={getTranslation(language, ['cart', 'close'])}>
          &times;
        </button>
      </div>
      <div className="cart-content">
        {totalQuantity === 0 ? (
          <p className="empty">{getTranslation(language, ['cart', 'empty'])}</p>
        ) : (
          <ul>
            {items.map(item => (
              <li key={item.id} className="cart-item">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-qty">× {item.quantity}</span>
                </div>
                <div className="item-actions">
                  <span className="item-price">{(item.price * item.quantity).toFixed(2)}&nbsp;BHD</span>
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                    aria-label={getTranslation(language, ['cart', 'remove'])}
                  >
                    {getTranslation(language, ['cart', 'remove'])}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {totalQuantity > 0 && (
        <div className="cart-footer">
          <div className="total">
            <span>{getTranslation(language, ['cart', 'total'])}</span>
            <span>{totalPrice.toFixed(2)}\u00a0BHD</span>
          </div>
          {/*
            The checkout button no longer clears the cart. It merely
            closes the overlay so the user can proceed manually with
            their order. Cart contents remain intact until the user
            removes them explicitly.
          */}
          <button
            className="checkout-btn"
            onClick={() => {
              onClose();
            }}
          >
            {getTranslation(language, ['cart', 'checkout'])}
          </button>
        </div>
      )}
      <style jsx>{`
        .cart-overlay {
          position: fixed;
          top: 0;
          right: 0;
          height: 100%;
          width: 100%;
          max-width: 340px;
          background-color: var(--color-surface);
          box-shadow: -4px 0 12px rgba(0, 0, 0, 0.4);
          transform: translateX(100%);
          transition: transform 0.3s ease;
          z-index: 1200;
          display: flex;
          flex-direction: column;
        }
        .cart-overlay.open {
          transform: translateX(0);
        }
        .cart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .cart-header h2 {
          font-size: 1.2rem;
          color: var(--color-text-primary);
          margin: 0;
        }
        .close-btn {
          background: none;
          border: none;
          color: var(--color-antique-gold);
          font-size: 1.5rem;
          cursor: pointer;
        }
        .cart-content {
          flex-grow: 1;
          overflow-y: auto;
          padding: 1rem;
        }
        .empty {
          color: var(--color-text-secondary);
          text-align: center;
          margin-top: 2rem;
        }
        ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .cart-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        .item-info {
          display: flex;
          flex-direction: column;
        }
        .item-name {
          color: var(--color-text-primary);
          font-size: 0.9rem;
        }
        .item-qty {
          color: var(--color-text-muted);
          font-size: 0.8rem;
        }
        .item-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .item-price {
          color: var(--color-antique-gold);
          font-size: 0.9rem;
        }
        .remove-btn {
          background: none;
          border: 1px solid var(--color-soft-copper);
          color: var(--color-soft-copper);
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-size: 0.75rem;
          cursor: pointer;
        }
        .remove-btn:active {
          transform: scale(0.96);
        }
        .cart-footer {
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding: 1rem;
        }
        .total {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          color: var(--color-text-primary);
        }
        .checkout-btn {
          width: 100%;
          background-color: var(--color-antique-gold);
          border: none;
          color: var(--color-dark-brown);
          padding: 0.6rem;
          border-radius: 4px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
        }
        .checkout-btn:active {
          transform: scale(0.97);
        }
      `}</style>
    </div>
  );
};

export default CartOverlay;