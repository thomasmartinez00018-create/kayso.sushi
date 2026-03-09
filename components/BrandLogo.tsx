import React from 'react';
import { LOGO_URL } from '../constants';

interface BrandLogoProps {
  variant?: 'navbar' | 'footer';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ variant = 'navbar', className = '' }) => {
  // If no logo URL is provided yet, we show a fallback text to avoid broken images
  const hasLogo = LOGO_URL && LOGO_URL.length > 0;

  if (variant === 'footer') {
    return (
      <div className={`flex flex-col items-center select-none ${className}`}>
        {hasLogo ? (
            <img 
                src={LOGO_URL} 
                alt="Kayso Sushi Logo" 
                className="h-32 w-auto object-contain hover:scale-105 transition-transform duration-300"
            />
        ) : (
            // Fallback while waiting for the real logo link
            <div className="text-center">
                 <span className="text-4xl font-bold font-display text-white lowercase tracking-wide">kaysosushi</span>
            </div>
        )}
      </div>
    );
  }

  // Navbar variant (Compact)
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
       {hasLogo ? (
            <img 
                src={LOGO_URL} 
                alt="Kayso Sushi Logo" 
                className="h-12 w-auto object-contain"
            />
        ) : (
             // Fallback while waiting for the real logo link
            <span className="text-2xl font-bold font-display text-white lowercase tracking-tight pt-1">
                kaysosushi
            </span>
        )}
    </div>
  );
};