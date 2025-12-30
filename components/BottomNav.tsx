"use client";

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';
import CartButton from './CartButton';

interface BottomNavProps {
  onCartClick: () => void;
}

/**
 * Mobile bottom navigation bar that mirrors the top navigation for
 * small screens. It presents each section with a minimalist icon
 * and label, fixed to the bottom of the viewport. This component
 * enhances usability on touch devices and provides an app‑like
 * experience. Only visible on screens narrower than 768px via CSS.
 */
const BottomNav: React.FC<BottomNavProps> = ({ onCartClick }) => {
  // language and setLanguage retrieved below

  // Portal container so the nav is rendered as a direct child of <body>
  // This avoids any stacking-context issues caused by transformed parents
  const portalEl = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = document.createElement('div');
    el.id = '__bottom-nav-portal';
    // Place the portal as a fixed full-viewport layer so it cannot be occluded
    el.style.position = 'fixed';
    el.style.inset = '0px';
    el.style.zIndex = '2147483646';
    el.style.left = '0';
    el.style.top = '0';
    el.style.width = '100%';
    el.style.height = '100%';
    // Parent container should not capture pointer events; the nav element will opt-in
    el.style.pointerEvents = 'none';
    document.body.appendChild(el);
    portalEl.current = el;
    return () => {
      if (portalEl.current && portalEl.current.parentNode) {
        portalEl.current.parentNode.removeChild(portalEl.current);
      }
      portalEl.current = null;
    };
  }, []);

  const { setLanguage, language } = useLanguage();

  // Ensure portal stays attached and the nav remains visible across
  // language changes, scroll events and potential DOM mutations.
  useEffect(() => {
    if (!portalEl.current) return;

    // Inject a strong global rule to force the nav above all content.
    let styleEl = document.getElementById('__bottom-nav-portal-style') as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = '__bottom-nav-portal-style';
      styleEl.innerHTML = `#__bottom-nav-portal .bottom-nav{position:fixed !important; z-index:2147483648 !important; bottom: env(safe-area-inset-bottom,12px) !important; left:12px !important; right:12px !important; pointer-events:auto !important;} @media (min-width:769px){#__bottom-nav-portal .bottom-nav{display:none !important}}`;
      document.head.appendChild(styleEl);
    }

    const ensureVisible = () => {
      const nav = portalEl.current!.querySelector('.bottom-nav') as HTMLElement | null;
      if (nav) {
        nav.style.visibility = 'visible';
        nav.style.opacity = '1';
        nav.style.display = 'flex';
        nav.style.zIndex = '2147483648';
      }
    };

    // Call once to ensure visible immediately after language change
    ensureVisible();

    const onScroll = () => ensureVisible();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Watch for accidental DOM removals and re-attach portal if needed
    const obs = new MutationObserver(() => {
      if (!document.getElementById('__bottom-nav-portal') && portalEl.current) {
        document.body.appendChild(portalEl.current);
      }
    });
    obs.observe(document.body, { childList: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      obs.disconnect();
    };
  }, [language]);

  // Helper to scroll to a section smoothly
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // List of nav items with associated icons and actions

  const navItems: {
    id: string;
    labelKey: string[];
    onClick: () => void;
    icon: JSX.Element;
  }[] = [
    {
      id: 'menu',
      labelKey: ['nav', 'menu'],
      onClick: () => scrollTo('menu'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round">
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="14" y2="17" />
        </svg>
      )
    },
    {
      id: 'founder',
      labelKey: ['nav', 'founder'],
      onClick: () => scrollTo('founder'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="12" cy="7" r="3.5" />
          <path d="M5 21c0-3.5 3-6.5 7-6.5s7 3 7 6.5" />
        </svg>
      )
    },
    {
      id: 'story',
      labelKey: ['nav', 'story'],
      onClick: () => scrollTo('story'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round">
          <path d="M3 6h14a4 4 0 014 4v9H7a4 4 0 01-4-4V6z" />
          <polyline points="7 6 7 14 21 14" />
        </svg>
      )
    },
    {
      id: 'branches',
      labelKey: ['nav', 'branches'],
      onClick: () => scrollTo('branches'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round">
          <path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
      )
    },
    {
      id: 'contact',
      labelKey: ['nav', 'contactUs'],
      onClick: () => scrollTo('contact'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round">
          <path d="M2 3h20v18H2V3z" />
          <path d="M2 7h20" />
          <path d="M6 3v4" />
          <path d="M18 3v4" />
        </svg>
      )
    }
  ];

  // Add language toggle as an extra control rendered after the main items
  const toggleLanguage = () => setLanguage(language === 'ar' ? 'en' : 'ar');

  const navContent = (
    <nav className="bottom-nav" role="navigation" aria-label="Mobile bottom navigation">
      {navItems.map(item => (
        <div
          key={item.id}
          className="bottom-nav-item"
          onClick={item.onClick}
          role="button"
          aria-label={getTranslation(language, item.labelKey)}
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') item.onClick();
          }}
        >
          <span className="icon">{item.icon}</span>
          <span className="label">{getTranslation(language, item.labelKey)}</span>
        </div>
      ))}
      {/* Cart item with badge indicator */}
      <div
        className="bottom-nav-item"
        onClick={onCartClick}
        role="button"
        aria-label={getTranslation(language, ['nav', 'cart'])}
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') onCartClick();
        }}
      >
        <span className="icon cart-icon">
          <CartButton onClick={onCartClick} />
        </span>
        <span className="label">{getTranslation(language, ['nav', 'cart'])}</span>
      </div>
      {/* Language toggle */}
      <div
        className="bottom-nav-item"
        onClick={toggleLanguage}
        role="button"
        aria-label={getTranslation(language, ['languageSwitcher', 'change'])}
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') toggleLanguage();
        }}
      >
        <span className="icon">
          <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round">
            <path d="M12 2v20M2 12h20" />
          </svg>
        </span>
        <span className="label">{language === 'ar' ? 'AR' : 'EN'}</span>
      </div>
      <style jsx>{`
        .bottom-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: fixed;
          /* Floating pill inset so it's visible immediately and above content */
          left: 12px;
          right: 12px;
          bottom: env(safe-area-inset-bottom, 12px);
          width: auto;
          max-width: 960px;
          height: 64px;
          background: rgba(58, 42, 31, 0.85);
          backdrop-filter: blur(18px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.35);
          /* Raise above most page elements so mobile navigation remains accessible */
          z-index: 2147483647;
          /* Ensure the nav is visible immediately and above any hero/image */
          visibility: visible !important;
          opacity: 1 !important;
          transform: translateZ(0);
          will-change: transform;
          /* Ensure touch targets are comfortable */
          padding: 6px 8px;
          /* Allow pointer events on the nav itself even though portal parent is pointer-events:none */
          pointer-events: auto;
        }
        .bottom-nav-item {
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--color-text-secondary);
          font-size: 0.75rem;
          cursor: pointer;
          gap: 4px;
          transition: color 0.18s ease, transform 0.12s ease;
          position: relative;
          outline: none;
          /* Make hit targets at least 48x48px for touch friendliness */
          min-width: 48px;
          min-height: 48px;
          padding: 6px 10px;
        }
        .bottom-nav-item:focus {
          box-shadow: 0 0 0 3px rgba(224,179,102,0.15);
          border-radius: 8px;
        }
        .bottom-nav-item:hover,
        .bottom-nav-item:focus {
          color: var(--color-gold-primary);
          transform: translateY(-2px);
        }
        .icon svg {
          width: 22px;
          height: 22px;
          stroke: currentColor;
        }
        /* Ensure the cart button fits nicely */
        .cart-icon :global(button) {
          /* Remove nested button default styles */
          all: unset;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .label {
          font-weight: 500;
        }
        /* Hide bottom nav on desktop */
        @media (min-width: 769px) {
          .bottom-nav {
            display: none;
          }
        }
      `}</style>
    </nav>
  );

  if (!portalEl.current) return null;
  return createPortal(navContent, portalEl.current);
};

export default BottomNav;