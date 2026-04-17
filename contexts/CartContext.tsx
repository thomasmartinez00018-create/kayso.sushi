import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { CartItem } from '../types';

const STORAGE_KEY = 'kayso_cart_v1';

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  drawerOpen: boolean;
  toast: string | null;
  addItem: (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  showToast: (message: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function loadFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(i => i && typeof i.id === 'string' && typeof i.price === 'number');
  } catch {
    return [];
  }
}

function saveToStorage(items: CartItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore (storage quota, private mode, etc.)
  }
}

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => loadFromStorage());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    saveToStorage(items);
  }, [items]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    const timer = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(timer);
  }, []);

  const addItem = useCallback<CartContextValue['addItem']>((item) => {
    const quantityToAdd = item.quantity ?? 1;
    let wasEmpty = false;
    setItems(prev => {
      if (prev.length === 0) wasEmpty = true;
      // Merge identical products (same productId + same details + same price)
      const existing = prev.findIndex(
        i => i.productId === item.productId && i.details === item.details && i.price === item.price
      );
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = { ...next[existing], quantity: next[existing].quantity + quantityToAdd };
        return next;
      }
      const newItem: CartItem = {
        id: `cart_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: quantityToAdd,
        details: item.details,
        image: item.image,
      };
      return [...prev, newItem];
    });
    showToast(`Agregado: ${item.name}`);

    // Teaching moment: when the cart goes from empty to 1 item, auto-open
    // the drawer so the user learns the flow (multi-product order).
    // On subsequent adds we only show the toast — no interruption.
    if (wasEmpty) {
      setTimeout(() => setDrawerOpen(true), 450);
    }
  }, [showToast]);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems(prev => {
      if (quantity <= 0) return prev.filter(i => i.id !== id);
      return prev.map(i => (i.id === id ? { ...i, quantity } : i));
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setDrawerOpen(d => !d), []);

  const count = items.reduce((n, i) => n + i.quantity, 0);
  const subtotal = items.reduce((n, i) => n + i.quantity * i.price, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        subtotal,
        drawerOpen,
        toast,
        addItem,
        removeItem,
        updateQuantity,
        clear,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
