// Landing dedicada de la campaña "Ideal Compositor".
// Aesthetic: marca real Kayso (rojo #FF2200, negro #050505, blanco) — urbana/apetitosa.
// Un solo objetivo: que la Compositora arme su combo y complete el pedido. Sin distracciones.
// Motion: CSS-only (entradas escalonadas + reveal on-scroll por IntersectionObserver) para no
// agregar dependencias y mantener el build liviano.

import React, { useEffect, useRef, useState } from 'react';
import { MenuItem } from '../types';
import { ComboBuilder } from './ComboBuilder';
import { ArrowDown, Clock, MessageCircle, Bike, Star } from 'lucide-react';

interface Props {
  menuItems: MenuItem[];
  onCheckout: () => void;
}

const useReveal = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setShown(true); return; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.18 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, shown };
};

export const ArmaTuComboLanding: React.FC<Props> = ({ menuItems, onCheckout }) => {
  const builderRef = useRef<HTMLDivElement | null>(null);
  const pasos = useReveal();

  const scrollToBuilder = () => {
    builderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-kayso-dark text-white font-sans">
      {/* ============ HERO ============ */}
      <section className="relative min-h-[88vh] flex flex-col justify-center overflow-hidden px-5 sm:px-8">
        {/* Bloque rojo de profundidad, sangrando esquina */}
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 w-[460px] h-[460px] rounded-full bg-kayso-orange/90 blur-[2px] opacity-90"
          style={{ maskImage: 'radial-gradient(circle, black 60%, transparent 72%)' }}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-kayso-dark" />

        <div className="relative max-w-3xl mx-auto w-full text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 mb-7 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.05s', animationFillMode: 'forwards' }}
          >
            <Star size={15} className="text-kayso-orange" fill="currentColor" />
            <span className="text-xs font-bold tracking-wide text-white/90">4.9 ★ en Google · +90 reseñas</span>
          </div>

          <h1
            className="font-display font-black uppercase leading-[0.92] tracking-tight opacity-0 animate-fade-in-up"
            style={{ fontSize: 'clamp(2.6rem, 9vw, 5.2rem)', animationDelay: '0.12s', animationFillMode: 'forwards' }}
          >
            Armá tu combo<br />
            <span className="text-kayso-orange">a tu gusto</span>
          </h1>

          <p
            className="mt-6 text-lg sm:text-xl text-gray-300 font-light max-w-xl mx-auto opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.22s', animationFillMode: 'forwards' }}
          >
            Elegí pieza por pieza lo que más te gusta. Lo armamos fresco y te lo
            llevamos <span className="text-white font-medium">esta noche</span>. Delivery propio en San Miguel y Muñiz.
          </p>

          <div
            className="mt-9 flex flex-col items-center gap-4 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.32s', animationFillMode: 'forwards' }}
          >
            <button
              onClick={scrollToBuilder}
              className="group bg-kayso-orange hover:bg-red-700 text-white font-bold font-display text-lg px-10 py-4 rounded-full shadow-xl shadow-kayso-orange/25 transition-all hover:scale-[1.03] active:scale-[0.98] flex items-center gap-3"
            >
              Empezá a armarlo
              <ArrowDown size={20} className="group-hover:translate-y-1 transition-transform" />
            </button>
            <span className="text-sm text-gray-500">Te confirmamos por WhatsApp en 2 minutos</span>
          </div>
        </div>
      </section>

      {/* ============ CÓMO FUNCIONA (3 pasos) ============ */}
      <section ref={pasos.ref} className="py-16 px-5 sm:px-8 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-kayso-orange font-display font-bold uppercase tracking-widest text-sm mb-10">
            Así de simple
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: <Star size={26} />, t: 'Armás tu combo', d: 'Elegís el tamaño y los rolls que más te gustan. A tu manera.' },
              { icon: <MessageCircle size={26} />, t: 'Confirmamos en 2 min', d: 'Tu pedido llega listo a nuestro WhatsApp. Te respondemos al toque.' },
              { icon: <Bike size={26} />, t: 'Llega en ~30 min', d: 'Delivery propio a San Miguel y Muñiz. Fresco, a tu casa.' },
            ].map((p, i) => (
              <div
                key={i}
                className="bg-kayso-gray/60 border border-white/8 rounded-2xl p-6 text-center transition-all duration-700"
                style={{
                  opacity: pasos.shown ? 1 : 0,
                  transform: pasos.shown ? 'translateY(0)' : 'translateY(28px)',
                  transitionDelay: `${i * 90}ms`,
                }}
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-kayso-orange/15 text-kayso-orange flex items-center justify-center mb-4">
                  {p.icon}
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{p.t}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ EL BUILDER (la acción principal) ============ */}
      <div ref={builderRef} className="scroll-mt-4 border-t border-white/5">
        <div className="text-center pt-12 px-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-kayso-orange/15 border border-kayso-orange/30 mb-3">
            <Clock size={14} className="text-kayso-orange" />
            <span className="text-xs font-bold text-kayso-orange uppercase tracking-wide">El más elegido: combo 30 piezas · ideal para 2-3</span>
          </div>
        </div>
        <ComboBuilder menuItems={menuItems} onAdded={onCheckout} />
      </div>

      {/* ============ FIRMA ============ */}
      <footer className="py-10 text-center border-t border-white/5">
        <p className="font-display font-black text-2xl tracking-tight">KAYSO<span className="text-kayso-orange">.</span></p>
        <p className="text-gray-500 text-sm mt-1">Gelly y Obes 2308 · Pte. Perón 1991 — San Miguel · Noches 18:30 a 22:30</p>
      </footer>
    </div>
  );
};
