"use client";

import React, { useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import CartButton from './CartButton';
import InstallAppButton from './InstallAppButton';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';

interface NavbarProps {
  onCartClick: () => void;
}

/**
 * Top navigation bar. On desktop it displays the logo, centered navigation
 * links and actions on the right. On mobile it collapses the links into
 * a hamburger menu with a glassmorphic overlay. The component uses no
 * external libraries and relies purely on CSS for responsiveness.
 */
const Navbar: React.FC<NavbarProps> = ({ onCartClick }) => {
  const { language } = useLanguage();
  // We no longer use a hamburger mobile menu because a dedicated bottom
  // navigation is provided. The mobileOpen state and handlers remain but
  // are unused.
  const [mobileOpen, setMobileOpen] = useState(false);

  const sections: { id: string; key: string[] }[] = [
    { id: 'menu', key: ['nav', 'menu'] },
    { id: 'founder', key: ['nav', 'founder'] },
    { id: 'story', key: ['nav', 'story'] },
    { id: 'branches', key: ['nav', 'branches'] },
    { id: 'cart', key: ['nav', 'cart'] },
    { id: 'contact', key: ['nav', 'contactUs'] }
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileOpen(false);
  };

  return (
    <header className="nav-container">
      <nav className="nav">
        <div className="logo" onClick={() => scrollTo('top')}>
          <img src="/logo.png" alt="logo" width="48" height="48" />
        </div>
        <ul className="nav-links">
          {sections.map(({ id, key }) => (
            <li key={id} onClick={() => {
              if (id === 'cart') {
                onCartClick();
              } else if (id === 'contact') {
                scrollTo('contact');
              } else if (id === 'branches') {
                scrollTo('branches');
              } else {
                scrollTo(id);
              }
            }}>
              {id === 'cart' ? (
                <div className="cart-nav-item">
                  {/* Use cart button inside nav item */}
                  <CartButton onClick={onCartClick} />
                </div>
              ) : (
                getTranslation(language, key)
              )}
            </li>
          ))}
        </ul>
        <div className="actions">
          <LanguageSwitcher />
          <InstallAppButton />
        </div>
      </nav>
      {/* Mobile overlay removed as bottom navigation handles mobile interactions */}
      <style jsx>{`
        .nav-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          /* Glassy backdrop with a subtle dark tint */
          background: rgba(58, 42, 31, 0.6);
          backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .nav {
          max-width: 1200px;
          margin: 0 auto;
          height: 64px;
          padding: 0 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .logo {
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        .nav-links {
          display: flex;
          gap: 1.5rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .nav-links li {
          position: relative;
          cursor: pointer;
          color: var(--color-text-primary);
          font-size: 0.95rem;
          font-weight: 500;
          padding: 0.5rem 0;
          transition: color 0.25s ease;
        }
        .nav-links li:hover {
          color: var(--color-gold-primary);
        }
        /* Elegant underline on hover */
        .nav-links li::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--color-gold-primary);
          transition: width 0.3s ease;
        }
        .nav-links li:hover::after {
          width: 100%;
        }
        .nav-links li .cart-nav-item {
          display: flex;
          align-items: center;
        }
        .actions {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.2rem;
          color: var(--color-gold-primary);
        }
        /* Mobile styles */
        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
          .mobile-toggle {
            display: block;
          }
        }
        /* Mobile overlay */
        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(58, 42, 31, 0.7);
          backdrop-filter: blur(24px) saturate(180%);
          display: flex;
          flex-direction: column;
          padding-top: 5rem;
          animation: slideDown 0.3s ease forwards;
          z-index: 1100;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .close-overlay {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 2rem;
          color: var(--color-gold-primary);
          cursor: pointer;
        }
        .mobile-links {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          align-items: center;
        }
        .mobile-links li {
          color: var(--color-text-primary);
          font-size: 1.4rem;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.25s ease;
        }
        .mobile-links li:hover {
          color: var(--color-gold-primary);
        }
        .mobile-links li button {
          color: inherit;
        }
      `}</style>
    </header>
  );
};

export default Navbar;