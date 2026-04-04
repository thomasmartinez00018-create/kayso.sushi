
import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../constants';
import { trackAndRedirectToWhatsApp } from '../services/trackingService';

interface FloatingWhatsAppProps {
  onRedirect: (url: string) => void;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ onRedirect }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2500);
    const handleScroll = () => {
      if (window.scrollY > 300) setVisible(true);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClick = () => {
    const url = trackAndRedirectToWhatsApp(
      'Hola! Quiero hacer un pedido 🍣',
      WHATSAPP_NUMBER,
      { resumen: 'Botón flotante WhatsApp' }
    );
    onRedirect(url);
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <button
        onClick={handleClick}
        className="relative flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-full shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 px-5 py-3.5"
        style={{ boxShadow: '0 4px 24px rgba(37,211,102,0.45)' }}
        aria-label="Pedí por WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 pointer-events-none"></span>
        <MessageCircle size={20} className="flex-shrink-0 relative z-10" />
        <span className="font-black text-sm whitespace-nowrap relative z-10">Pedí por WhatsApp</span>
      </button>
    </div>
  );
};
