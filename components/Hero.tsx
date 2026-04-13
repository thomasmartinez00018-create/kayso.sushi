
import React, { useState } from 'react';
import { Star, MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../constants';
import { trackAndRedirectToWhatsApp } from '../services/trackingService';

interface HeroProps {
  onViewMenu: () => void;
  onOpenBuilder: () => void;
  onRedirect?: (url: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onViewMenu, onOpenBuilder, onRedirect }) => {
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);

  const handleViewPremium = () => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      onViewMenu();
    }
  };

  const handleWhatsAppOrder = () => {
    const url = trackAndRedirectToWhatsApp('Hola! Quiero hacer un pedido', WHATSAPP_NUMBER, { resumen: 'Contacto desde Hero' });
    if (onRedirect) onRedirect(url);
    setFallbackUrl(url);
  };

  return (
    <div className="relative bg-kayso-dark overflow-hidden min-h-[85vh] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1553621042-f6e147245754?q=75&w=1200&auto=format&fit=crop"
          alt="Sushi Background Kayso" 
          className="w-full h-full object-cover opacity-40 scale-105 animate-slow-zoom"
          // @ts-ignore
          fetchpriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-kayso-dark via-kayso-dark/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-kayso-dark via-kayso-dark/60 to-transparent"></div>
      </div>

      {/* Seigaiha Wave Pattern Top Border */}
      <div className="absolute top-0 left-0 right-0 h-8 wave-separator opacity-40 z-20"></div>

      {/* Atmospheric elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Red radial glow */}
        <div className="absolute left-[-10%] top-[10%] w-[800px] h-[800px] rounded-full opacity-[0.07]" style={{ background: 'radial-gradient(ellipse, #FF2200 0%, transparent 60%)' }}></div>
        {/* Decorative kanji */}
        <div className="absolute right-[-1%] top-0 bottom-0 flex items-center pointer-events-none select-none hidden xl:flex">
          <span className="text-[22rem] font-black leading-none font-display" style={{ color: 'rgba(255,255,255,0.018)', letterSpacing: '-0.05em' }}>寿司</span>
        </div>
        {/* Diagonal accent line */}
        <div className="absolute top-0 right-[38%] w-px h-full opacity-[0.07]" style={{ background: 'linear-gradient(to bottom, transparent 0%, #FF2200 40%, transparent 100%)' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="md:w-2/3 lg:w-1/2">
          <div className="flex items-center gap-4 mb-8 animate-fade-in-up">
            <div className="w-8 h-px bg-kayso-orange flex-shrink-0"></div>
            <span className="text-kayso-orange text-[10px] font-black uppercase tracking-[0.28em]">San Miguel & Muñiz</span>
            <div className="flex text-yellow-500 gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="currentColor" />)}
            </div>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-8xl xl:text-[9rem] font-black font-display text-white leading-[0.88] mb-4 animate-fade-in-up overflow-hidden" style={{ animationDelay: '0.1s' }}>
            ARMÁ TU COMBO Y <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-kayso-orange via-red-500 to-orange-400 break-words">
               PEDÍ POR WHATSAPP
            </span>
            <span className="block text-3xl sm:text-4xl md:text-5xl mt-2">EN MINUTOS</span>
          </h1>

          <div className="flex flex-wrap items-stretch gap-3 mb-8 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <div className="pill-accent bg-black/50 backdrop-blur-md px-4 py-3">
              <p className="text-kayso-orange text-[9px] font-black uppercase tracking-[0.15em] mb-0.5">Combos desde</p>
              <p className="text-white text-xl font-black font-display leading-none">$14.500</p>
              <p className="text-gray-600 text-[9px] font-bold mt-0.5">· 15 PIEZAS</p>
            </div>
            <div className="pill-accent-muted bg-black/50 backdrop-blur-md px-4 py-3">
              <p className="text-gray-500 text-[9px] font-bold uppercase tracking-[0.15em] mb-0.5">Abierto hoy</p>
              <p className="text-white text-sm font-bold leading-none">19:00 — 23:30</p>
            </div>
            <div className="pill-accent-muted bg-black/50 backdrop-blur-md px-4 py-3">
              <p className="text-gray-500 text-[9px] font-bold uppercase tracking-[0.15em] mb-0.5">Zona de entrega</p>
              <p className="text-white text-xs font-bold leading-none">San Miguel / Muñiz</p>
            </div>
          </div>
          
          <p className="text-xl text-gray-300 mb-10 leading-relaxed font-light max-w-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Calidad premium, ingredientes frescos y la libertad de elegir. Elegí una de nuestras selecciones curadas o armá tu tabla pieza por pieza.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={handleViewPremium}
              className="group relative overflow-hidden bg-kayso-orange text-white px-10 py-5 rounded-2xl font-black font-display text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-2xl shadow-kayso-orange/30"
              style={{ boxShadow: '0 8px 32px rgba(255,34,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)' }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></span>
              VER SELECCIONES PREMIUM
            </button>
            <button
              onClick={onOpenBuilder}
              className="bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-xl border border-white/[0.1] hover:border-white/20 text-white px-10 py-5 rounded-2xl font-black font-display text-lg transition-all flex items-center justify-center gap-2"
            >
              Armá tu combo
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-2 bg-yellow-500/5 border border-yellow-500/15 px-3 py-1.5 rounded-lg">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="currentColor" />)}
              </div>
              <span className="text-yellow-500/80 text-[10px] font-black uppercase tracking-wider">4.9 Google (+90)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-600 tracking-widest uppercase">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              Delivery propio
            </div>
            <span className="text-[10px] font-bold text-gray-600 tracking-widest uppercase">San Miguel · Muñiz</span>
          </div>

          <div className="mt-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <button
              onClick={handleWhatsAppOrder}
              className="relative flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-6 py-3.5 rounded-2xl font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-lg"
              style={{ boxShadow: '0 4px 20px rgba(37,211,102,0.35)' }}
            >
              <span className="absolute inset-0 rounded-2xl bg-[#25D366] animate-ping opacity-20 pointer-events-none"></span>
              <MessageCircle size={18} className="relative z-10" />
              <span className="relative z-10">Pedí directo por WhatsApp</span>
            </button>
            <p className="text-gray-500 text-[10px] font-semibold mt-2 ml-1 tracking-wide">Responden en 2 min &middot; 4.9&#9733; en Google (90+ reviews)</p>
            {fallbackUrl && (
              <a
                href={fallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[10px] text-[#25D366] underline mt-1 ml-1 opacity-80"
              >
                ¿No se abrió WhatsApp? Tocá acá
              </a>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>
    </div>
  );
};
