import React, { useState } from 'react';
import { ViewState } from '../types';
import { Menu, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const SushiMascot = () => (
  // Positioned absolutely relative to Navbar. 
  // Centered on the bottom edge (translate-y-1/2) and shifted left (right-16) to avoid mobile menu overlap.
  <div className="absolute bottom-0 translate-y-1/2 right-16 md:right-24 z-50 pointer-events-none select-none">
    <div className="relative w-20 h-20 md:w-24 md:h-24 drop-shadow-2xl pointer-events-auto hover:scale-110 transition-transform cursor-pointer group">
       <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" xmlns="http://www.w3.org/2000/svg">
         {/* Group for the Roll to allow independent hover effect */}
         <g className="origin-center transition-transform duration-300">
            {/* Main Sushi Roll Body */}
            <circle cx="50" cy="50" r="38" fill="#1a1a1a" stroke="#2d2d2d" strokeWidth="2" className="drop-shadow-lg" /> {/* Nori */}
            <circle cx="50" cy="50" r="30" fill="#f4f4f5" /> {/* Rice */}
            <circle cx="50" cy="50" r="18" fill="#FF2200" /> {/* Salmon Core (Brand Red) */}
            
            {/* Details */}
            <circle cx="56" cy="45" r="6" fill="#4ade80" opacity="0.9" /> {/* Avocado */}
            <path d="M 40 50 Q 50 60 60 50" stroke="#ff9f43" strokeWidth="2" fill="none" opacity="0.6" />
         </g>
         
         {/* Animated Chopsticks */}
         <g className="animate-chopsticks origin-center">
            {/* Left Chopstick */}
            <rect x="20" y="-20" width="6" height="100" rx="3" fill="#d4a373" transform="rotate(-25 50 50)" stroke="#8d6e63" strokeWidth="1" />
            {/* Right Chopstick */}
            <rect x="74" y="-20" width="6" height="100" rx="3" fill="#eebb99" transform="rotate(25 50 50)" stroke="#8d6e63" strokeWidth="1" />
         </g>
         
         {/* Speech Bubble on Hover */}
         <div className="absolute -top-10 right-0 bg-white text-kayso-dark text-xs font-bold px-3 py-1 rounded-xl rounded-br-none opacity-0 group-hover:opacity-100 transition-opacity shadow-lg w-32 text-center font-display">
            ¡Armá tu Combo!
         </div>
       </svg>
    </div>
  </div>
);

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems: { label: string; value: ViewState }[] = [
    { label: 'Inicio', value: 'HOME' },
    { label: 'Menú', value: 'MENU' },
    { label: 'Sucursales', value: 'LOCATIONS' },
    { label: 'Blog', value: 'BLOG' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-kayso-dark/95 backdrop-blur-sm border-b border-gray-800 relative shadow-2xl">
      {/* The Mascot that rests on the border */}
      <SushiMascot />

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
          </div>
        </div>
      )}
    </nav>
  );
};