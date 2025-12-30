"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';

/**
 * Button that triggers the PWA install prompt when available.
 * Listens for the beforeinstallprompt event and caches the event until
 * the user presses the button. After prompting, the cached event is
 * cleared.
 */
const InstallAppButton: React.FC = () => {
  const { language } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setVisible(false);
    }
    setDeferredPrompt(null);
  };

  if (!visible) return null;
  return (
    <button className="install-btn" onClick={handleClick}>
      {getTranslation(language, ['nav', 'install'])}
      <style jsx>{`
        .install-btn {
          background: none;
          border: 1px solid var(--color-antique-gold);
          color: var(--color-antique-gold);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          cursor: pointer;
          margin-left: 0.5rem;
          transition: background-color 0.15s ease;
        }
        .install-btn:hover {
          background-color: rgba(201, 162, 77, 0.1);
        }
        .install-btn:active {
          transform: scale(0.96);
        }
      `}</style>
    </button>
  );
};

export default InstallAppButton;