import React, { useState } from 'react';
import { ViewState } from '../types';
import { Menu, X, MessageCircle } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { WHATSAPP_NUMBER } from '../constants';
import { trackAndRedirectToWhatsApp } from '../services/trackingService';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  onRedirect?: (url: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView, onRedirect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsApp = () => {
    const url = trackAndRedirectToWhatsApp(
      'Hola! Quiero hacer un pedido 🍣',
      WHATSAPP_NUMBER,
      { resumen: 'CTA Navbar WhatsApp' }
    );
    if (onRedirect) onRedirect(url);
    setIsOpen(false);
  };

  const navItems: { label: string; value: ViewState }[] = [
    { label: 'Inicio', value: 'HOME' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-900 relative" style={{ boxShadow: '0 1px 0 rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.6)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setView('HOME')}>
            <BrandLogo variant="navbar" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setView(item.value)}
                  className={`px-3 py-2 rounded-md text-sm font-bold transition-colors font-display ${
                    currentView === item.value
                      ? 'text-kayso-orange'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => setView('BUILDER')}
                className="bg-kayso-orange hover:bg-red-700 text-white px-4 py-2 rounded-full font-bold font-display text-sm transition-transform hover:scale-105 shadow-lg shadow-kayso-orange/20"
              >
                Armá tu Combo
              </button>
              <button
                onClick={handleWhatsApp}
                className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-4 py-2 rounded-full font-bold font-display text-sm transition-transform hover:scale-105 shadow-lg"
              >
                <MessageCircle size={15} />
                WhatsApp
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => {
                  setView(item.value);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-3 py-3 rounded-md text-base font-bold ${
                  currentView === item.value
                    ? 'text-kayso-orange bg-gray-800'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                {item.label}
              </button>
            ))}
              <button
                onClick={() => {
                  setView('BUILDER');
                  setIsOpen(false);
                }}
                className="w-full mt-4 bg-kayso-orange text-white px-3 py-3 rounded-md font-bold font-display text-base text-center"
              >
                Armá tu Combo
              </button>
              <button
                onClick={handleWhatsApp}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-3 py-3 rounded-md font-bold font-display text-base"
              >
                <MessageCircle size={18} />
                Pedí por WhatsApp
              </button>
          </div>
        </div>
      )}
    </nav>
  );
};