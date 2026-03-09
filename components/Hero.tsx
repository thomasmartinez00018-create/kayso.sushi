
import React from 'react';
import { ChevronRight, Star, UtensilsCrossed } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../constants';

interface HeroProps {
  onViewMenu: () => void;
  onOpenBuilder?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onViewMenu, onOpenBuilder }) => {
  return (
    <div className="relative bg-kayso-dark overflow-hidden min-h-[85vh] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1553621042-f6e147245754?q=90&w=2500&auto=format&fit=crop" 
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

      {/* Floating Thematic Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden hidden lg:block">
        <div className="absolute top-[15%] right-[15%] animate-float opacity-20 transform rotate-12">
           <div className="text-[12rem] filter blur-[2px]">🍣</div>
        </div>
        <div className="absolute bottom-[10%] left-[5%] animate-float-delayed opacity-10 transform -rotate-45">
           <div className="text-[10rem]">🥢</div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="md:w-2/3 lg:w-1/2">
          <div className="flex items-center gap-3 mb-8 animate-fade-in-up">
            <span className="bg-kayso-orange text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-kayso-orange/20">
              San Miguel & Muñiz
            </span>
            <div className="flex text-yellow-500 gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black font-display text-white leading-[0.9] mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            PASIÓN POR EL <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-kayso-orange via-red-500 to-orange-400">
               BUEN SUSHI
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-10 leading-relaxed font-light max-w-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Rolls premium, ingredientes frescos y la libertad de elegir. Diseñá tu tabla pieza por pieza con nuestro armador interactivo.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <button 
              onClick={onOpenBuilder}
              className="group bg-kayso-orange hover:bg-red-700 text-white px-10 py-5 rounded-2xl font-black font-display text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-2xl shadow-kayso-orange/40 ring-4 ring-kayso-orange/10"
            >
              <UtensilsCrossed size={22} className="group-hover:rotate-12 transition-transform" />
              ARMÁ TU COMBO
            </button>
            <button 
              onClick={onViewMenu}
              className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 text-white px-10 py-5 rounded-2xl font-black font-display text-lg transition-all flex items-center justify-center gap-2 hover:border-white/20"
            >
              Ver Carta
            </button>
          </div>

          <div className="mt-12 flex items-center gap-4 text-xs font-bold text-gray-500 tracking-widest uppercase animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('hola vengo de la web')}`} target="_blank" rel="noreferrer" className="hover:text-kayso-orange transition-colors flex items-center gap-2 group">
              O pedí por WhatsApp <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
      
      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>
    </div>
  );
};
