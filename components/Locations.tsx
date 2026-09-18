
import React, { useState } from 'react';
import { MapPin, Phone, Clock, MessageCircle } from 'lucide-react';
import { WHATSAPP_GELLY, WHATSAPP_PERON } from '../constants';
import { trackAndRedirectToWhatsApp } from '../services/trackingService';
import { gellyCerroDefinitivo, gellyDisponibleHoy, ZONA_DELIVERY, ZONA_DETALLE } from '../services/horarios';

/**
 * El mapa embebido de Google baja ~200 KB de JavaScript por sucursal y bloquea la pintura.
 * Se monta recién cuando alguien lo pide.
 */
const MapaSucursal: React.FC<{ consulta: string; titulo: string }> = ({ consulta, titulo }) => {
  const [abierto, setAbierto] = useState(false);

  if (!abierto) {
    return (
      <button
        onClick={() => setAbierto(true)}
        className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gray-700/60 text-gray-200 hover:bg-gray-700 transition-colors"
      >
        <MapPin size={28} className="text-kayso-orange" aria-hidden="true" />
        <span className="font-bold text-sm">Ver el mapa de {titulo}</span>
      </button>
    );
  }

  return (
    <iframe
      src={`https://maps.google.com/maps?q=${consulta}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen={true}
      loading="lazy"
      title={`Mapa de ${titulo}`}
    ></iframe>
  );
};

export const Locations: React.FC = () => {
  const gellyCerro = gellyCerroDefinitivo();
  const gellyHoy = gellyDisponibleHoy();

  return (
    <section id="locations" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Nuestras <span className="text-kayso-orange">Sucursales</span>
          </h2>
          <p className="text-gray-400">Take Away & Delivery Center</p>
        </div>

        <div className={`grid grid-cols-1 gap-12 ${gellyCerro ? 'max-w-2xl mx-auto' : 'lg:grid-cols-2'}`}>
          {/* Sucursal 1 - Gelly y Obes (deja de mostrarse cuando cierra) */}
          {!gellyCerro && (
          <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 flex flex-col">
            <div className="h-64 bg-gray-700 relative">
              <MapaSucursal consulta="Gelly%20y%20Obes%202308%2C%20San%20Miguel" titulo="Gelly y Obes" />
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
                    <span className="text-gray-300">Mié a Dom: 18:00 a 22:30 · Lunes y martes cerrado</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="text-kayso-orange flex-shrink-0" />
                    <span className="text-gray-300">11-5053-8254</span>
                  </div>
                </div>
              </div>
              <button
                data-cta-anchor
                onClick={() => trackAndRedirectToWhatsApp(
                  'Hola! Quiero pedir a la sucursal Gelly y Obes. ¿Cuál es el tiempo de delivery hoy y a qué zonas llegan?',
                  WHATSAPP_GELLY,
                  { resumen: 'Contacto Sucursal Gelly y Obes', zona: 'Gelly y Obes — San Miguel', modalidad: 'A definir' }
                )}
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg w-full"
              >
                <MessageCircle size={20} aria-hidden="true" />
                {gellyHoy ? 'Pedir a Gelly y Obes' : 'Hoy no atiende · escribile igual'}
              </button>
              {!gellyHoy && (
                <p className="text-gray-400 text-xs mt-2 text-center">Hoy Gelly y Obes no atiende. Pte. Perón sí.</p>
              )}
            </div>
          </div>
          )}

          {/* Sucursal 2 - Presidente Perón */}
          <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 flex flex-col">
            <div className="h-64 bg-gray-700 relative">
              <MapaSucursal consulta="Av.%20Pte.%20Per%C3%B3n%201991%2C%20San%20Miguel" titulo="Pte. Perón" />
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
                    <span className="text-gray-300">Mar a Sáb: 11:30 a 14:30 · Mar a Dom: 18:30 a 22:30</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="text-kayso-orange flex-shrink-0" />
                    <span className="text-gray-300">11-2862-7514</span>
                  </div>
                </div>
              </div>
               <button
                data-cta-anchor
                onClick={() => trackAndRedirectToWhatsApp(
                  'Hola! Quiero pedir a la sucursal Pte. Perón. ¿Cuál es el tiempo de delivery hoy y a qué zonas llegan?',
                  WHATSAPP_PERON,
                  { resumen: 'Contacto Sucursal Pte. Perón', zona: 'Pte. Perón — San Miguel', modalidad: 'A definir' }
                )}
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg w-full"
              >
                <MessageCircle size={20} aria-hidden="true" />
                Pedir a Pte. Perón
              </button>
            </div>
          </div>
        </div>

        {/* Envíos por zona + descuentos (datos Gladys 2-jul-2026) */}
        <div className="mt-8 bg-gray-800 rounded-2xl border border-gray-700 p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-3">🛵 Envío a domicilio</h3>
              <p className="text-gray-300 mb-2"><span className="text-kayso-orange-text font-bold">GRATIS</span> en la zona céntrica de San Miguel.</p>
              <p className="text-gray-300 mb-4">Resto de {ZONA_DELIVERY} entre <span className="font-bold text-white">$1.500 y $3.000</span> según tu barrio.</p>
              <p className="text-gray-400 text-sm mb-4">{ZONA_DETALLE}</p>
              <a
                href="https://goo.gl/maps/jgtWdWvo47fQjyYN8"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 text-kayso-orange-text font-bold hover:underline"
              >
                Ver el mapa de zonas y costos →
              </a>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3">💵 Pagando en efectivo</h3>
              <p className="text-gray-300 mb-2"><span className="text-kayso-orange-text font-bold">20% de descuento</span> los miércoles y jueves.</p>
              <p className="text-gray-400 text-sm">En rolls, combos, ensaladas y demás sushi. No incluye bebidas, salsas, postres ni envío.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
