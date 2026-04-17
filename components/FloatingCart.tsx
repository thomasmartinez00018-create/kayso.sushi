import React, { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export const FloatingCart: React.FC = () => {
  const { count, openDrawer } = useCart();
  const [pulse, setPulse] = useState(false);
  const [prevCount, setPrevCount] = useState(count);

  // Pulse animation when count increases
  useEffect(() => {
    if (count > prevCount) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 450);
      return () => clearTimeout(t);
    }
    setPrevCount(count);
  }, [count, prevCount]);

  if (count === 0) return null;

  return (
    <button
      onClick={openDrawer}
      aria-label={`Abrir carrito — ${count} productos`}
      className={`fixed bottom-6 right-[205px] sm:right-[215px] z-50 bg-kayso-orange hover:bg-red-700 text-white rounded-full shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 w-[52px] h-[52px] flex items-center justify-center ${
        pulse ? 'animate-[ping_0.45s_ease-out_1]' : ''
      }`}
      style={{ boxShadow: '0 4px 24px rgba(255,34,0,0.45)' }}
    >
      <ShoppingBag size={22} className="flex-shrink-0" />
      <span className="absolute -top-1 -right-1 bg-white text-kayso-orange border-2 border-kayso-orange text-[11px] font-black rounded-full min-w-[22px] h-[22px] flex items-center justify-center px-1">
        {count}
      </span>
    </button>
  );
};
