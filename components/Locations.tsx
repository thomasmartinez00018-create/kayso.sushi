
import React from 'react';
import { MapPin, Phone, Clock, MessageCircle } from 'lucide-react';
import { WHATSAPP_GELLY, WHATSAPP_PERON } from '../constants';

export const Locations: React.FC = () => {
  return (
    <section id="locations" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Nuestras <span className="text-kayso-orange">Sucursales</span>
          </h2>
          <p className="text-gray-400">Take Away & Delivery Center</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Sucursal 1 - Gelly y Obes */}
          <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 flex flex-col">
            <div className="h-64 bg-gray-700 relative">
              <iframe 
                src="https://maps.google.com/maps?q=Gelly%20y%20Obes%202308%2C%20San%20Miguel&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%" 
                height="100%" 
                style={{border:0}} 
                allowFullScreen={true} 
                loading="lazy"
                title="Gelly y Obes Map"
              ></iframe>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Sucursal Gelly y Obes</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-kayso-orange flex-shrink-0" />
                    <span className="text-gray-300">Gelly y Obes 2308, San Miguel</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="text-kayso-orange flex-shrink-0" />
                    <span className="text-gray-300">Mar a Dom: 11:30 a 14:30 y 19:00 a 23:30</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="text-kayso-orange flex-shrink-0" />
                    <span className="text-gray-300">11-5053-8254</span>
                  </div>
                </div>
              </div>
              <a 
                href={`https://wa.me/${WHATSAPP_GELLY}?text=${encodeURIComponent('hola vengo de la web')}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <MessageCircle size={20} />
                Pedir a Gelly y Obes
              </a>
            </div>
          </div>

          {/* Sucursal 2 - Presidente Perón */}
          <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 flex flex-col">
            <div className="h-64 bg-gray-700 relative">
              <iframe 
                src="https://maps.google.com/maps?q=Av.%20Pte.%20Per%C3%B3n%201991%2C%20San%20Miguel&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%" 
                height="100%" 
                style={{border:0}} 
                allowFullScreen={true} 
                loading="lazy"
                 title="Peron Map"
              ></iframe>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Sucursal Presidente Perón</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-kayso-orange flex-shrink-0" />
                    <span className="text-gray-300">Av. Pte. Perón 1991, San Miguel</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="text-kayso-orange flex-shrink-0" />
                    <span className="text-gray-300">Mar a Dom: 11:30 a 14:30 y 19:00 a 23:30</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="text-kayso-orange flex-shrink-0" />
                    <span className="text-gray-300">11-2862-7514</span>
                  </div>
                </div>
              </div>
               <a 
                href={`https://wa.me/${WHATSAPP_PERON}?text=${encodeURIComponent('hola vengo de la web')}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <MessageCircle size={20} />
                Pedir a Pte. Perón
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
