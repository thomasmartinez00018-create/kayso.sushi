
import React from 'react';
import { Instagram, MapPin, Clock, Star, MessageCircle } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { RESENAS_GOOGLE, ZONA_DELIVERY, gellyCerroDefinitivo } from '../services/horarios';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#030303] border-t border-gray-900 pt-16 pb-8 relative">
      {/* Wave Decoration */}
      <div className="absolute top-0 left-0 right-0 h-3 wave-separator opacity-60"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start text-center md:text-left">
            <BrandLogo variant="footer" className="mb-8 scale-90 origin-left" />
            <p className="text-gray-400 max-w-sm mb-6">
              Sushi delivery con onda en San Miguel. Nos apasiona el detalle, la frescura y que comas rico.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/kayso.sushi" target="_blank" rel="noreferrer" aria-label="Kayso Sushi en Instagram" className="bg-gray-900 p-3 rounded-full text-gray-400 hover:text-white hover:bg-kayso-orange transition-all">
                <Instagram size={20} aria-hidden="true" />
              </a>
              <div className="flex flex-col justify-center text-left">
                <p className="text-xs text-gray-400">Seguinos en IG</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-white font-bold mb-6 font-display text-lg">Contacto</h2>
            <div className="space-y-4 text-gray-400 text-sm">
              <div className="flex gap-2">
                <Clock size={16} className="text-kayso-orange flex-shrink-0 mt-1" />
                <div>
                    <p className="text-white font-bold">Horarios</p>
                    <p>Mediodía (Perón): Mar a Sáb 11:30 a 14:30</p>
                    <p>Noche: Mar a Dom 18:30 a 22:30</p>
                </div>
              </div>
              {!gellyCerroDefinitivo() && (
                <div className="flex gap-2">
                  <MapPin size={16} className="text-kayso-orange flex-shrink-0 mt-1" />
                  <div>
                      <p className="text-white font-bold">Gelly y Obes</p>
                      <p>Gelly y Obes 2308 · Mié a Dom 18:00 a 22:30</p>
                      <a href="https://wa.me/5491150538254" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[#25D366] hover:text-green-400 transition-colors font-bold">
                        <MessageCircle size={13} aria-hidden="true" /> 11 5053-8254
                      </a>
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <MapPin size={16} className="text-kayso-orange flex-shrink-0 mt-1" />
                 <div>
                    <p className="text-white font-bold">Presidente Perón</p>
                    <p>Av. Pte. Perón 1991</p>
                    <a href="https://wa.me/5491128627514" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[#25D366] hover:text-green-400 transition-colors font-bold">
                      <MessageCircle size={13} /> 11 2862-7514
                    </a>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
             <h2 className="text-white font-bold mb-6 font-display text-lg">Nuestra Propuesta</h2>
             <p className="text-gray-400 text-sm mb-4">
               En Kayso Sushi nos enfocamos en brindarte la mejor experiencia de delivery. 
               Productos frescos, delivery propio en {ZONA_DELIVERY} y atención personalizada por WhatsApp.
             </p>
             <div className="flex items-center gap-2 text-kayso-orange font-bold text-sm">
               <Star size={16} fill="currentColor" />
               <span>{RESENAS_GOOGLE}</span>
             </div>
          </div>

        </div>
        
        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Kayso Sushi. Todos los derechos reservados.
          </p>
          <p className="text-gray-400 text-xs">
            Desarrollado con React & Tailwind
          </p>
        </div>
      </div>
    </footer>
  );
};
