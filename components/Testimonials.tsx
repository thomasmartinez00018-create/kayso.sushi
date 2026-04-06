
import React from 'react';
import { Testimonial } from '../types';
import { Star } from 'lucide-react';

interface TestimonialsProps {
    items: Testimonial[];
}

export const Testimonials: React.FC<TestimonialsProps> = ({ items }) => {
  // If no reviews, don't show section
  if (!items || items.length === 0) return null;

  return (
    <section className="py-24 bg-[#060606] overflow-hidden relative border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
           <div className="flex items-center justify-center gap-2 mb-4">
              <span className="bg-white/[0.06] border border-white/[0.08] p-2 rounded-full">
                {/* Google G Logo SVG */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.68 17.57V20.33H19.24C21.32 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                    <path d="M12 23C14.97 23 17.46 22.01 19.24 20.37L15.68 17.6C14.7 18.26 13.44 18.67 12 18.67C9.13 18.67 6.71 16.73 5.84 14.12H2.16V16.97C3.91 20.45 7.68 22.84 12 23V23Z" fill="#34A853"/>
                    <path d="M5.84 14.12C5.62 13.46 5.5 12.75 5.5 12C5.5 11.25 5.62 10.54 5.84 9.88V7.03H2.16C1.44 8.47 1.03 10.18 1.03 12C1.03 13.82 1.44 15.53 2.16 16.97L5.84 14.12Z" fill="#FBBC05"/>
                    <path d="M12 5.38C13.62 5.38 15.06 5.94 16.2 7.03L19.34 3.89C17.45 2.13 14.97 1.05 12 1.05C7.68 1.05 3.91 3.44 2.16 6.93L5.84 9.78C6.71 7.17 9.13 5.38 12 5.38Z" fill="#EA4335"/>
                </svg>
              </span>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">RESEÑAS VERIFICADAS</p>
           </div>
          <p className="text-[10px] text-gray-600 uppercase tracking-[0.3em] font-black mb-2">— Reseñas verificadas —</p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-0 font-display">
            Lo que dicen en <span className="text-kayso-orange">Google</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.slice(0, 3).map((item) => (
            <div key={item.id} className="relative bg-[#0a0a0a] p-6 rounded-2xl border border-gray-800/80 hover:border-gray-700 transition-colors overflow-hidden group">
              {/* Decorative quotation mark */}
              <div
                className="absolute -top-2 -left-1 font-black leading-none select-none pointer-events-none font-display"
                style={{ fontSize: '6rem', color: 'rgba(255,34,0,0.08)', lineHeight: 1 }}
                aria-hidden="true"
              >"</div>

              <div className="flex gap-1 mb-4 relative z-10">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className={`${i < (item.stars || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700 fill-gray-700'}`} />
                ))}
              </div>

              <p className="text-gray-300 text-sm leading-relaxed mb-5 relative z-10">{item.text}</p>

              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-3">
                  {item.avatar ? (
                    <img src={item.avatar} alt={item.name} className="w-9 h-9 rounded-full border border-gray-700" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-xs border border-blue-500/20">
                      {item.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-white text-sm leading-tight">{item.name}</p>
                    <p className="text-[10px] text-gray-600">{item.date}</p>
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" aria-label="Google" className="opacity-50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.68 17.57V20.33H19.24C21.32 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                    <path d="M12 23C14.97 23 17.46 22.01 19.24 20.37L15.68 17.6C14.7 18.26 13.44 18.67 12 18.67C9.13 18.67 6.71 16.73 5.84 14.12H2.16V16.97C3.91 20.45 7.68 22.84 12 23V23Z" fill="#34A853"/>
                    <path d="M5.84 14.12C5.62 13.46 5.5 12.75 5.5 12C5.5 11.25 5.62 10.54 5.84 9.88V7.03H2.16C1.44 8.47 1.03 10.18 1.03 12C1.03 13.82 1.44 15.53 2.16 16.97L5.84 14.12Z" fill="#FBBC05"/>
                    <path d="M12 5.38C13.62 5.38 15.06 5.94 16.2 7.03L19.34 3.89C17.45 2.13 14.97 1.05 12 1.05C7.68 1.05 3.91 3.44 2.16 6.93L5.84 9.78C6.71 7.17 9.13 5.38 12 5.38Z" fill="#EA4335"/>
                </svg>
              </div>

              {item.product && (
                <div className="mt-4 pt-4 border-t border-gray-800/80 relative z-10">
                  <p className="text-[9px] text-gray-600 uppercase tracking-widest font-black mb-0.5">Pidió:</p>
                  <p className="text-xs text-kayso-orange font-bold">{item.product}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="https://www.google.com/maps/search/kayso+sushi+san+miguel/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-white transition-all text-xs font-bold uppercase tracking-widest border border-gray-800 hover:border-gray-600 px-5 py-2.5 rounded-lg"
          >
            Ver todas las reseñas en Google <Star size={12} />
          </a>
        </div>
      </div>
    </section>
  );
};
