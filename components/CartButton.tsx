"use client";

import React from 'react';
import { useCart } from '../context/CartContext';

interface CartButtonProps {
  onClick: () => void;
}

/**
 * Button displaying a cart icon with a badge for item count. When pressed
 * it triggers the provided onClick callback to open the cart overlay.
 */
const CartButton: React.FC<CartButtonProps> = ({ onClick }) => {
  const { totalQuantity } = useCart();
  return (
    <button className="cart-button" onClick={onClick} aria-label="Cart">
      {/* Simple cart icon using SVG */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 4h-2l-1 2h2l3.6 7.59-1.35 2.44C8.89 16.37 9.16 17 9.64 17h8.72c.48 0 .89-.32 1.04-.78l3.24-10.22c.15-.47-.19-.9-.69-.9H5.21"
          stroke="var(--color-antique-gold)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10.5" cy="20.5" r="1.5" fill="var(--color-antique-gold)" />
        <circle cx="17.5" cy="20.5" r="1.5" fill="var(--color-antique-gold)" />
      </svg>
      {totalQuantity > 0 && <span className="badge">{totalQuantity}</span>}
      <style jsx>{`
        .cart-button {
          position: relative;
          background: none;
          border: none;
          padding: 0.3rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cart-button:active {
          transform: scale(0.95);
        }
        .badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background-color: var(--color-soft-copper);
          color: var(--color-dark-brown);
          border-radius: 50%;
          padding: 0 5px;
          font-size: 0.7rem;
          line-height: 1.2;
          min-width: 18px;
          text-align: center;
        }
      `}</style>
    </button>
  );
};

export default CartButton;