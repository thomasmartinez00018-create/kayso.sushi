import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    join(__dirname, 'index.html'),
    join(__dirname, 'index.tsx'),
    join(__dirname, 'App.tsx'),
    join(__dirname, 'components', '**', '*.{js,ts,jsx,tsx}'),
    join(__dirname, 'services', '**', '*.{js,ts,jsx,tsx}'),
  ],
  theme: {
    extend: {
      // (29-oct-2026) Tres curvas en toda la web: 0 en fotos, bandas y tarjetas, 4 px en sellos, rótulos, campos y botones
      // chicos, y redondeada entera (rounded-full) en el botón de pedir y los círculos. Antes eran 9 medidas distintas.
      borderRadius: {
        sm: '4px', DEFAULT: '4px', md: '4px', lg: '4px', xl: '4px',
        '2xl': '0', '3xl': '0',
      },
      colors: {
        kayso: {
          orange: '#FF2200',
          // Mismo naranja pero más oscuro, para texto chico en blanco (el #FF2200 da 3.83:1)
          'orange-deep': '#E01E00',
          // Naranja para TEXTO sobre gris/negro (el #FF2200 da 3.83:1 sobre bg-gray-800)
          'orange-text': '#FF5233',
          dark: '#050505',
          gray: '#1f1f1f',
          light: '#f4f4f5',
        },
      },
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'chopsticks': 'chopsticks 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        chopsticks: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px) rotate(1deg)' },
        },
      },
    },
  },
  plugins: [],
}
