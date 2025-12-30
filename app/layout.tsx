"use client";

import './globals.css';
import React, { useEffect, useState } from 'react';
import { LanguageProvider } from '../context/LanguageContext';
import { CartProvider } from '../context/CartContext';
import Navbar from '../components/Navbar';
import CartOverlay from '../components/CartOverlay';
import BottomNav from '../components/BottomNav';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);

  // Register the service worker once on mount (kept minimal and safe)
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch(err => {
          console.warn('Service worker registration failed', err);
        });
    }
  }, []);

  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#e0b366" />
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Load Cairo, Tajawal and Montserrat font families */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&family=Tajawal:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
      </head>
      <body>
        <LanguageProvider>
          <CartProvider>
            <Navbar onCartClick={() => setCartOpen(true)} />
            <CartOverlay open={cartOpen} onClose={() => setCartOpen(false)} />
            {/* Add bottom margin to account for the mobile bottom nav */}
            <main style={{ paddingTop: '60px', paddingBottom: '70px' }}>{children}</main>
            {/* Bottom navigation only visible on small screens */}
            <BottomNav onCartClick={() => setCartOpen(true)} />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}