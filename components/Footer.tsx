
import React, { useState } from 'react';
import { Instagram, MapPin, Loader2, CheckCircle2, Clock } from 'lucide-react';
import { subscribeToNewsletter } from '../services/sheetService';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!email) return;

      setStatus('LOADING');
      const result = await subscribeToNewsletter(email);
      
      if(result.success) {
          setStatus('SUCCESS');
          setMessage(result.message);
          setEmail('');
      } else {
          setStatus('ERROR');
          setMessage(result.message);
      }
  };

  return (
    <footer className="bg-black border-t border-gray-800 pt-16 pb-8 relative">
      {/* Wave Decoration */}
      <div className="absolute top-0 left-0 right-0 h-3 wave-separator opacity-60"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start text-center md:text-left">
            <BrandLogo variant="footer" className="mb-8 scale-90 origin-left" />
            <p className="text-gray-500 max-w-sm mb-6">
              Sushi delivery con onda en San Miguel. Nos apasiona el detalle, la frescura y que comas rico.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/kayso.sushi" target="_blank" rel="noreferrer" className="bg-gray-900 p-3 rounded-full text-gray-400 hover:text-white hover:bg-kayso-orange transition-all">
                <Instagram size={20} />
              </a>
              <div className="flex flex-col justify-center text-left">
                <p className="text-xs text-gray-500">Seguinos en IG</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 font-display">Contacto</h4>
            <div className="space-y-4 text-gray-500 text-sm">
              <div className="flex gap-2">
                <Clock size={16} className="text-kayso-orange flex-shrink-0 mt-1" />
                <div>
                    <p className="text-white font-bold">Horarios</p>
                    <p>Mar a Dom: 11:30 a 14:30</p>
                    <p>y 19:00 a 23:30</p>
                </div>
              </div>
              <div className="flex gap-2">
                <MapPin size={16} className="text-kayso-orange flex-shrink-0 mt-1" />
                <div>
                    <p className="text-white font-bold">Gelly y Obes</p>
                    <p>Gelly y Obes 2308</p>
                    <p className="text-kayso-orange">11 5053-8254</p>
                </div>
              </div>
              <div className="flex gap-2">
                <MapPin size={16} className="text-kayso-orange flex-shrink-0 mt-1" />
                 <div>
                    <p className="text-white font-bold">Presidente Perón</p>
                    <p>Av. Pte. Perón 1991</p>
                    <p className="text-kayso-orange">11 2862-7514</p>
                </div>
              </div>
            </div>
          </div>

          <div>
             <h4 className="text-white font-bold mb-6 font-display">Newsletter</h4>
             <p className="text-gray-500 text-sm mb-4">Recibí promos exclusivas y cupones de descuento.</p>
             
             {status === 'SUCCESS' ? (
                 <div className="bg-green-900/20 border border-green-900 text-green-500 p-3 rounded-lg flex items-center gap-2 text-sm">
                     <CheckCircle2 size={16} />
                     {message}
                 </div>
             ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                <input 
                    type="email" 
                    placeholder="Tu email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'LOADING'}
                    className="bg-gray-900 border border-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-kayso-orange transition-colors"
                />
                <button 
                    disabled={status === 'LOADING'}
                    className="bg-kayso-orange text-white font-bold py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                    {status === 'LOADING' ? <Loader2 className="animate-spin" size={18} /> : 'Suscribirme'}
                </button>
                {status === 'ERROR' && <p className="text-red-500 text-xs">{message}</p>}
                </form>
             )}
          </div>

        </div>
        
        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Kayso Sushi. Todos los derechos reservados.
          </p>
          <p className="text-gray-700 text-xs">
            Desarrollado con React & Tailwind
          </p>
        </div>
      </div>
    </footer>
  );
};
