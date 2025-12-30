"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextProps {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  totalQuantity: number;
  totalPrice: number;
  clear: () => void;
}

const CartContext = createContext<CartContextProps>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  totalQuantity: 0,
  totalPrice: 0,
  clear: () => {}
});

/**
 * Provider component for managing cart state. It stores the cart in
 * localStorage to persist between sessions and updates a badge count
 * whenever items change. All prices are stored as numbers and should
 * be displayed formatted by the UI.
 */
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Hydrate cart from storage
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('cart');
      if (stored) {
        try {
          const parsed: CartItem[] = JSON.parse(stored);
          setItems(parsed);
        } catch {
          // ignore invalid JSON
        }
      }
    }
  }, []);

  useEffect(() => {
    // Persist cart whenever it changes
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === id);
      if (!existing) return prev;
      if (existing.quantity > 1) {
        return prev.map(i => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i));
      }
      return prev.filter(i => i.id !== id);
    });
  };

  const clear = () => setItems([]);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, totalQuantity, totalPrice, clear }}
    >
      {children}
    </CartContext.Provider>
  );
};

/**
 * Hook to access cart context.
 */
export const useCart = () => useContext(CartContext);