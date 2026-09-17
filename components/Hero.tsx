
import React, { useState } from 'react';
import { Star, MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../constants';
import { trackAndRedirectToWhatsApp } from '../services/trackingService';
import { estadoHoy, fraseAtencion, ZONA_DELIVERY, RESENAS_GOOGLE } from '../services/horarios';

interface HeroProps {
  onViewMenu: () => void;
  onOpenBuilder: () => void;
  onRedirect?: (url: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onViewMenu, onOpenBuilder, onRedirect }) => {
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);
  // Horario real de hoy: los lunes no abre ninguna sucursal y Perón abre también al mediodía.
  const hoy = estadoHoy();

  const handleViewPremium = () => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      onViewMenu();
    }
  };

  const handleWhatsAppOrder = () => {
    const url = trackAndRedirectToWhatsApp(
      'Hola! Vi la web de Kayso y quiero hacer un pedido para hoy. ¿Tienen disponibilidad y hacen delivery a San Miguel/Muñiz?',
      WHATSAPP_NUMBER,
      { resumen: 'Contacto desde Hero', zona: ZONA_DELIVERY, modalidad: 'A definir' }
    );
    if (onRedirect) onRedirect(url);
    setFallbackUrl(url);
  };

  // Banner que continúa la promesa del ad de origen (?promo=miercoles|enviogratis). Inerte sin el param.
  const promoMessage = (() => {
    if (typeof window === 'undefined') return null;
    const p = new URLSearchParams(window.location.search).get('promo');
    const PROMOS: Record<string, string> = {
      miercoles: 'Los miércoles: 20% OFF pagando en efectivo',
      enviogratis: 'Envío GRATIS en la zona céntrica de San Miguel',
    };
    return p && PROMOS[p] ? PROMOS[p] : null;
  })();

  return (
    <div className="relative bg-kayso-dark overflow-hidden min-h-[85vh] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source media="(max-width: 767px)" srcSet="/img/hero-portrait.webp" width={750} height={580} />
          <source media="(min-width: 768px)" srcSet="/img/hero-wide.webp" width={1080} height={480} />
          <img
            src="/img/hero-wide.jpg"
            alt=""
            aria-hidden="true"
            width={1080}
            height={480}
            className="w-full h-full object-cover opacity-40"
            decoding="async"
            // @ts-ignore
            fetchpriority="high"
          />
        </picture>
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="md:w-2/3 lg:w-1/2">
          {promoMessage && (
            <div className="mb-5 inline-flex items-center gap-2 bg-kayso-orange-deep text-white px-4 py-2 rounded-full text-xs sm:text-sm font-black uppercase tracking-wide animate-fade-in-up shadow-lg shadow-kayso-orange/30">
              🔥 {promoMessage}
            </div>
          )}

          <div className="flex items-center gap-4 mb-5 sm:mb-8 animate-fade-in-up">
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

          <div className="flex flex-wrap items-stretch gap-2 sm:gap-3 mb-5 sm:mb-8 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <div className="pill-accent bg-black/50 backdrop-blur-md px-4 py-3">
              <p className="text-kayso-orange text-[9px] font-black uppercase tracking-[0.15em] mb-0.5">Combos desde</p>
              <p className="text-white text-xl font-black font-display leading-none">$17.500</p>
              <p className="text-gray-400 text-[9px] font-bold mt-0.5">· 15 PIEZAS</p>
            </div>
            <div className="pill-accent-muted bg-black/50 backdrop-blur-md px-4 py-3">
              <p className="text-gray-400 text-[9px] font-bold uppercase tracking-[0.15em] mb-0.5">{hoy.etiqueta}</p>
              <p className="text-white text-sm font-bold leading-none">{hoy.detalle}</p>
            </div>
            <div className="pill-accent-muted bg-black/50 backdrop-blur-md px-4 py-3">
              <p className="text-gray-400 text-[9px] font-bold uppercase tracking-[0.15em] mb-0.5">Zona de entrega</p>
              <p className="text-white text-xs font-bold leading-none">{ZONA_DELIVERY}</p>
            </div>
            <div className="pill-accent bg-black/50 backdrop-blur-md px-4 py-3">
              <p className="text-kayso-orange text-[9px] font-black uppercase tracking-[0.15em] mb-0.5">Pagando en efectivo</p>
              <p className="text-white text-xs font-bold leading-none">10% OFF · Miérc. 20% OFF</p>
            </div>
          </div>
          
          <p className="hidden sm:block text-xl text-gray-300 mb-10 leading-relaxed font-light max-w-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Calidad premium, ingredientes frescos y la libertad de elegir. Elegí una de nuestras selecciones curadas o armá tu tabla pieza por pieza.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up mt-2 sm:mt-0" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={onOpenBuilder}
              className="group relative overflow-hidden bg-kayso-orange-deep text-white px-10 py-5 rounded-2xl font-black font-display text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-2xl shadow-kayso-orange/30"
              style={{ boxShadow: '0 8px 32px rgba(255,34,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)' }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></span>
              ARMÁ TU COMBO
            </button>
            <button
              onClick={handleViewPremium}
              className="bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-xl border border-white/[0.1] hover:border-white/20 text-white px-10 py-5 rounded-2xl font-black font-display text-lg transition-all flex items-center justify-center gap-2"
            >
              Ver selecciones
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-2 bg-yellow-500/5 border border-yellow-500/15 px-3 py-1.5 rounded-lg">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="currentColor" />)}
              </div>
              <span className="text-yellow-500 text-[10px] font-black uppercase tracking-wider">{RESENAS_GOOGLE}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 tracking-widest uppercase">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              Delivery propio
            </div>
            <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{ZONA_DELIVERY}</span>
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
            <p className="text-gray-400 text-[10px] font-semibold mt-2 ml-1 tracking-wide">{fraseAtencion()}</p>
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
