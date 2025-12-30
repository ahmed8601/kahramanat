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
  const { items, removeItem, totalPrice, totalQuantity, clear, updateItemNote } = useCart();
  const { language } = useLanguage();
  const [showSummary, setShowSummary] = React.useState(false);
  return (
    <div className={`cart-overlay ${open ? 'open' : ''}`}> 
      <div className="cart-header">
        <h2>
          {showSummary
            ? getTranslation(language, ['cart', 'summaryTitle'])
            : getTranslation(language, ['cart', 'title'])}
        </h2>
        <button className="close-btn" onClick={() => {
          if (showSummary) {
            // If on summary screen, return to cart list instead of closing entirely
            setShowSummary(false);
          } else {
            onClose();
          }
        }} aria-label={getTranslation(language, ['cart', 'close'])}>
          &times;
        </button>
      </div>
      <div className="cart-content">
        {totalQuantity === 0 ? (
          <p className="empty">{getTranslation(language, ['cart', 'empty'])}</p>
        ) : showSummary ? (
          // Order summary view
          <div className="summary-list">
            <ul>
              {items.map(item => (
                <li key={item.id} className="summary-item">
                  <span className="summary-name">{item.quantity}× {item.name}</span>
                  {item.note && item.note.trim() !== '' && (
                    <span className="summary-note">({item.note})</span>
                  )}
                  <span className="summary-price">{(item.price * item.quantity).toFixed(2)}&nbsp;BHD</span>
                </li>
              ))}
            </ul>
            <div className="summary-total">
              <span>{getTranslation(language, ['cart', 'total'])}</span>
              <span>{totalPrice.toFixed(2)}\u00a0BHD</span>
            </div>
            <p className="order-placed">{getTranslation(language, ['cart', 'orderPlaced'])}</p>
          </div>
        ) : (
          // Cart items list
          <ul>
            {items.map(item => (
              <li key={item.id} className="cart-item">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-qty">× {item.quantity}</span>
                </div>
                <div className="item-note">
                  <label htmlFor={`note-${item.id}`} className="note-label">
                    {getTranslation(language, ['cart', 'notes'])}:
                  </label>
                  <input
                    id={`note-${item.id}`}
                    type="text"
                    value={item.note || ''}
                    onChange={e => updateItemNote(item.id, e.target.value)}
                    className="note-input"
                    placeholder={getTranslation(language, ['cart', 'notes'])}
                  />
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
      {totalQuantity > 0 && !showSummary && (
        <div className="cart-footer">
          <div className="total">
            <span>{getTranslation(language, ['cart', 'total'])}</span>
            <span>{totalPrice.toFixed(2)}\u00a0BHD</span>
          </div>
          <button
            className="checkout-btn"
            onClick={() => {
              // Enter summary view instead of clearing cart
              setShowSummary(true);
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
        .item-note {
          margin-top: 0.25rem;
          display: flex;
          flex-direction: column;
        }
        .note-label {
          font-size: 0.7rem;
          color: var(--color-text-muted);
          margin-bottom: 0.2rem;
        }
        .note-input {
          background-color: var(--color-background-main);
          border: 1px solid var(--color-surface);
          color: var(--color-text-primary);
          padding: 0.25rem 0.4rem;
          border-radius: 4px;
          font-size: 0.8rem;
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
        .summary-list ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          color: var(--color-text-primary);
          font-size: 0.9rem;
        }
        .summary-name {
          font-weight: 500;
        }
        .summary-note {
          font-style: italic;
          color: var(--color-soft-copper);
          margin-inline-start: 0.25rem;
          font-size: 0.8rem;
        }
        .summary-price {
          color: var(--color-gold-primary);
        }
        .summary-total {
          display: flex;
          justify-content: space-between;
          margin-top: 1rem;
          font-weight: 600;
        }
        .order-placed {
          margin-top: 1rem;
          color: var(--color-soft-copper);
          font-size: 0.9rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default CartOverlay;