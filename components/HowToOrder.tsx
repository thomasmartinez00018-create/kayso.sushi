import React from 'react';
import { MapPin, Clock, UtensilsCrossed, MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../constants';
import { trackAndRedirectToWhatsApp } from '../services/trackingService';

interface HowToOrderProps {
  onRedirect?: (url: string) => void;
}

export const HowToOrder: React.FC<HowToOrderProps> = ({ onRedirect }) => {
  const handleWhatsApp = () => {
    const url = trackAndRedirectToWhatsApp(
      'Hola! Quiero hacer un pedido 🍣',
      WHATSAPP_NUMBER,
      { resumen: 'CTA sección Cómo Pedir' }
    );
    if (onRedirect) onRedirect(url);
  };
  const steps = [
    {
      icon: <UtensilsCrossed className="text-kayso-orange" size={32} />,
      title: "1. Armá tu pedido",
      description: "Usá nuestro Armador de Combos interactivo para elegir cada pieza o seleccioná del menú."
    },
    {
      icon: <MapPin className="text-kayso-orange" size={32} />,
      title: "2. Chequeá zona",
      description: "Llegamos a San Miguel, Muñiz, Bella Vista y J.C. Paz con nuestro delivery propio."
    },
    {
      icon: <Clock className="text-kayso-orange" size={32} />,
      title: "3. Esperá tranqui",
      description: "Preparamos todo en el momento con pesca del día. El tiempo promedio es 45-60 min."
    }
  ];

  return (
    <section className="py-24 bg-kayso-dark border-y border-gray-800/60 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none"></div>
      {/* Subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-[0.04] pointer-events-none" style={{ background: 'radial-gradient(ellipse, #FF2200 0%, transparent 70%)' }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-kayso-orange text-[10px] font-black uppercase tracking-[0.3em] mb-3">— Proceso —</p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-0 font-display">
            ¿Cómo <span className="text-kayso-orange">Pedir?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connecting line on desktop */}
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>

          {steps.map((step, index) => (
            <div key={index} className="relative bg-[#080808] border border-gray-800/80 hover:border-gray-700 rounded-2xl p-8 text-center overflow-hidden transition-all group cursor-default">
              {/* Big decorative step number */}
              <div
                className="absolute -top-3 -right-1 font-black leading-none font-display select-none pointer-events-none"
                style={{ fontSize: '7rem', color: 'rgba(255,34,0,0.055)' }}
                aria-hidden="true"
              >
                0{index + 1}
              </div>
              {/* Icon */}
              <div className="relative bg-kayso-orange/[0.08] border border-kayso-orange/15 group-hover:bg-kayso-orange/15 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors">
                {step.icon}
              </div>
              <p className="text-kayso-orange text-[9px] font-black uppercase tracking-[0.25em] mb-1.5">Paso 0{index + 1}</p>
              <h3 className="text-lg font-black text-white mb-3 font-display">{step.title.replace(/^\d+\.\s/, '')}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-5">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="w-12 h-px bg-gray-800"></div>
            <p className="text-xs font-bold uppercase tracking-widest">¿Listo para pedir?</p>
            <div className="w-12 h-px bg-gray-800"></div>
          </div>
          <button
            onClick={handleWhatsApp}
            className="relative flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-10 py-4 rounded-2xl font-black text-base transition-all hover:scale-105 active:scale-95"
            style={{ boxShadow: '0 4px 32px rgba(37,211,102,0.35), inset 0 1px 0 rgba(255,255,255,0.2)' }}
          >
            <span className="absolute inset-0 rounded-2xl bg-[#25D366] animate-ping opacity-15 pointer-events-none"></span>
            <MessageCircle size={20} className="relative z-10" />
            <span className="relative z-10 font-black tracking-wide">Hacer mi pedido por WhatsApp</span>
          </button>
        </div>
      </div>
    </section>
  );
};