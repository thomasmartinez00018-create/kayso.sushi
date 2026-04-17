
import React, { useState, useEffect } from 'react';
import { MessageCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../constants';
import { trackAndRedirectToWhatsApp } from '../services/trackingService';
import { useCart } from '../contexts/CartContext';

interface FloatingWhatsAppProps {
  onRedirect: (url: string) => void;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ onRedirect }) => {
  const [visible, setVisible] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);
  const { count, subtotal, openDrawer } = useCart();
  const hasCart = count > 0;

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1500);
    const handleScroll = () => {
      if (window.scrollY > 300) setVisible(true);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleWhatsApp = () => {
    const url = trackAndRedirectToWhatsApp(
      'Hola! Quiero hacer un pedido 🍣',
      WHATSAPP_NUMBER,
      { resumen: 'Botón flotante WhatsApp' }
    );
    onRedirect(url);
    setFallbackUrl(url);
  };

  const handleViewCart = () => {
    openDrawer();
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      {hasCart ? (
        // CART-AWARE MODE: primary CTA drives to checkout, not to WhatsApp
        <button
          onClick={handleViewCart}
          className="relative flex items-center gap-3 bg-kayso-orange hover:bg-red-700 text-white rounded-full shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 pl-4 pr-5 py-3"
          style={{ boxShadow: '0 4px 24px rgba(255,34,0,0.5)' }}
          aria-label={`Ver tu pedido — ${count} productos`}
        >
          <span className="absolute inset-0 rounded-full bg-kayso-orange animate-ping opacity-25 pointer-events-none"></span>
          <div className="relative z-10 flex items-center gap-2.5">
            <div className="relative">
              <ShoppingBag size={20} className="flex-shrink-0" />
              <span className="absolute -top-2 -right-2 bg-white text-kayso-orange border-2 border-kayso-orange text-[10px] font-black rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {count}
              </span>
            </div>
            <div className="flex flex-col items-start leading-tight">
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">Tu pedido</span>
              <span className="text-sm font-black whitespace-nowrap">${subtotal.toLocaleString()} · Finalizar</span>
            </div>
            <ArrowRight size={16} className="ml-1" />
          </div>
        </button>
      ) : (
        // EMPTY CART: classic WhatsApp CTA
        <button
          onClick={handleWhatsApp}
          className="relative flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-full shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 px-5 py-3.5"
          style={{ boxShadow: '0 4px 24px rgba(37,211,102,0.45)' }}
          aria-label="Pedí por WhatsApp"
        >
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 pointer-events-none"></span>
          <MessageCircle size={20} className="flex-shrink-0 relative z-10" />
          <span className="font-black text-sm whitespace-nowrap relative z-10">Pedí por WhatsApp</span>
        </button>
      )}

      {fallbackUrl && !hasCart && (
        <a
          href={fallbackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-[10px] text-[#25D366] underline mt-1.5 opacity-80"
        >
          ¿No se abrió? Tocá acá
        </a>
      )}
    </div>
  );
};
