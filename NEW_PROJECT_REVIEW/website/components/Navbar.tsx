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
          <button
            className="mobile-toggle"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" stroke="var(--color-antique-gold)" fill="none" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </nav>
      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="mobile-overlay">
          <button className="close-overlay" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            &times;
          </button>
          <ul className="mobile-links">
            {sections.map(({ id, key }) => (
              <li
                key={id}
                onClick={() => {
                  if (id === 'cart') {
                    onCartClick();
                  } else if (id === 'contact') {
                    scrollTo('contact');
                  } else if (id === 'branches') {
                    scrollTo('branches');
                  } else {
                    scrollTo(id);
                  }
                }}
              >
                {id === 'cart' ? (
                  <div className="cart-mobile-item">
                    {getTranslation(language, ['nav', 'cart'])}
                    <CartButton onClick={onCartClick} />
                  </div>
                ) : (
                  getTranslation(language, key)
                )}
              </li>
            ))}
            <li>
              <LanguageSwitcher />
            </li>
            <li>
              <InstallAppButton />
            </li>
          </ul>
        </div>
      )}
      <style jsx>{`
        .nav-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          background-color: var(--color-dark-brown);
          backdrop-filter: blur(10px);
        }
        .nav {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0.5rem 1rem;
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
          cursor: pointer;
          color: var(--color-text-primary);
          font-size: 0.9rem;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        .nav-links li:hover {
          color: var(--color-antique-gold);
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
          background: rgba(26, 26, 26, 0.8);
          backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          padding-top: 4rem;
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
          color: var(--color-antique-gold);
          cursor: pointer;
        }
        .mobile-links {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          align-items: center;
        }
        .mobile-links li {
          color: var(--color-text-primary);
          font-size: 1.2rem;
          font-weight: 500;
          cursor: pointer;
        }
        .mobile-links li button {
          color: var(--color-text-primary);
        }
      `}</style>
    </header>
  );
};

export default Navbar;