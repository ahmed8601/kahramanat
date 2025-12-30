"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
  id: string;
  name: string;
  // price stored as numeric value used for totals; may be 0 for price-on-request
  price: number;
  // optional human-friendly label for price (e.g. "السعر عند الطلب")
  priceLabel?: string | null;
  // whether this item should be included when summing the cart total
  includedInTotal?: boolean;
  quantity: number;
  image?: string;
  // optional selected size index for items with multiple sizes
  sizeIndex?: number | null;
  // optional selected size label
  sizeLabel?: string | null;
  note?: string;
}

interface CartContextProps {
  items: CartItem[];
  // Preferred API per project spec
  addToCart: (item: any, opts?: { selectedSizeIndex?: number; sizeLabel?: string }) => void;
  // Backwards compatible alias (also accepts options for size selection)
  addItem: (item: any, opts?: { selectedSizeIndex?: number; sizeLabel?: string }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
  totalQuantity: number;
  totalPrice: number;
  clear: () => void;
  updateItemNote: (id: string, note: string) => void;
}

const CartContext = createContext<CartContextProps>({
  items: [],
  addToCart: () => {},
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  totalQuantity: 0,
  totalPrice: 0,
  clear: () => {},
  updateItemNote: () => {}
});

/**
 * Provider component for managing cart state. It stores the cart in
 * localStorage to persist between sessions and updates a badge count
 * whenever items change. All prices are stored as numbers and should
 * be displayed formatted by the UI.
 */
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const STORAGE_KEY = 'cart';

  const safeGet = (key: string) => {
    try {
      if (typeof window === 'undefined') return null;
      const raw = window.localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const safeSet = (key: string, value: any) => {
    try {
      if (typeof window === 'undefined') return;
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // swallow storage errors (e.g., quota/security)
    }
  };

  useEffect(() => {
    // Hydrate cart from storage using safe wrapper
    const parsed = safeGet(STORAGE_KEY);
    if (Array.isArray(parsed)) {
      setItems(parsed as CartItem[]);
    }
  }, []);

  useEffect(() => {
    // Persist cart whenever it changes with safe wrapper
    safeSet(STORAGE_KEY, items);
  }, [items]);

  // Core add to cart implementation. Accepts arbitrary item from menu and
  // optional size selection. Merges items by id and size index.
  const addToCart = (menuItem: any, opts?: { selectedSizeIndex?: number; sizeLabel?: string }) => {
    console.log('[CartContext] addToCart called with menuItem:', menuItem);
    try {
      // Defensive checks - do not assume menuItem structure
      const id = menuItem && menuItem.id ? String(menuItem.id) : `${Math.random().toString(36).slice(2,9)}`;
      const nameObj = menuItem && menuItem.name ? menuItem.name : { en: '', ar: '' };
      const name = typeof nameObj === 'string' ? nameObj : nameObj;

      const sizes = menuItem && menuItem.sizes !== undefined ? menuItem.sizes : null;
      const rawPrice = menuItem && Object.prototype.hasOwnProperty.call(menuItem, 'price') ? menuItem.price : null;

      let priceValue = 0;
      let priceLabel: string | null = null;
      let includedInTotal = true;
      let sizeIndex: number | null = null;
      let sizeLabel: string | null = null;

      // price-on-request: price === null && sizes === null
      if (rawPrice === null && (sizes === null || sizes === undefined)) {
        priceValue = 0;
        priceLabel = 'السعر عند الطلب';
        includedInTotal = false;
      } else if (rawPrice === null && Array.isArray(sizes)) {
        // multiple sizes: require opts.selectedSizeIndex to pick
        const idx = typeof opts?.selectedSizeIndex === 'number' ? opts!.selectedSizeIndex : null;
        if (idx !== null && Array.isArray(sizes) && sizes[idx]) {
          sizeIndex = idx;
          const s = sizes[idx];
          // try to read numeric price from size
          if (s && typeof s.price === 'number') {
            priceValue = s.price;
            includedInTotal = true;
            sizeLabel = s.label && typeof s.label === 'string' ? s.label : String(idx + 1);
          } else {
            priceValue = 0;
            priceLabel = 'السعر عند الطلب';
            includedInTotal = false;
            sizeLabel = s && s.label ? String(s.label) : String(idx + 1);
          }
        } else {
          // No size selected — do not add to cart automatically. Fall back to price-on-request behavior.
          priceValue = 0;
          priceLabel = 'السعر عند الطلب';
          includedInTotal = false;
        }
      } else if (typeof rawPrice === 'number') {
        priceValue = rawPrice;
        includedInTotal = true;
      } else {
        // Unexpected shape: treat as price-on-request
        priceValue = 0;
        priceLabel = 'السعار عند الطلب';
        includedInTotal = false;
      }

      const finalId = sizeIndex !== null ? `${id}-size-${sizeIndex}` : id;

      setItems(prev => {
        console.log('[CartContext] setItems called, prev.length:', prev.length);
        // merge by id (already includes size suffix)
        const existing = prev.find(i => i.id === finalId);
        if (existing) {
          console.log('[CartContext] Item exists, incrementing quantity');
          return prev.map(i => (i.id === finalId ? { ...i, quantity: i.quantity + 1 } : i));
        }
        console.log('[CartContext] New item, adding to cart');
        const newItem: CartItem = {
          id: finalId,
          name: typeof name === 'string' ? name : name.en || name.ar || '',
          price: typeof priceValue === 'number' ? priceValue : 0,
          priceLabel: priceLabel || null,
          includedInTotal,
          quantity: 1,
          image: menuItem && menuItem.image ? String(menuItem.image) : undefined,
          sizeIndex,
          sizeLabel: opts?.sizeLabel || sizeLabel || null,
          note: ''
        };
        console.log('[CartContext] New item:', newItem);
        return [...prev, newItem];
      });
    } catch {
      // Swallow errors to ensure renderMenu and cart actions never crash UI
    }
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const clear = () => setItems([]);

  /**
   * Update a note for a specific item in the cart. If the item is not
   * found this call has no effect. Note values are persisted to
   * localStorage alongside the other cart properties.
   */
  const updateItemNote = (id: string, note: string) => {
    setItems(prev => prev.map(item => (item.id === id ? { ...item, note } : item)));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    setItems(prev => {
      if (newQuantity <= 0) return prev.filter(i => i.id !== id);
      return prev.map(i => (i.id === id ? { ...i, quantity: newQuantity } : i));
    });
  };

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    if (item.includedInTotal === false) return sum;
    if (typeof item.price !== 'number') return sum;
    return sum + item.price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
          addToCart,
            addItem: (item: any, opts?: any) => addToCart(item, opts),
        removeItem,
        updateQuantity,
        totalQuantity,
        totalPrice,
        clear,
        updateItemNote
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/**
 * Hook to access cart context.
 */
export const useCart = () => useContext(CartContext);