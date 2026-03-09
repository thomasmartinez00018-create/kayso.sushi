import React from 'react';
import { MapPin, Clock, UtensilsCrossed } from 'lucide-react';

export const HowToOrder: React.FC = () => {
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
    <section className="py-20 bg-kayso-dark border-y border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            ¿Cómo <span className="text-kayso-orange">Pedir?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 text-center hover:bg-gray-800 transition-colors">
              <div className="bg-gray-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border border-gray-700">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};