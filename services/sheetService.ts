
import { MenuItem, Testimonial } from '../types';
import { GOOGLE_SHEET_URL, MENU_ITEMS, TESTIMONIALS } from '../constants';

// Caché en el navegador: la planilla se consultaba en vivo en cada visita y con un parámetro
// que anulaba cualquier caché. Ahora se guarda 10 minutos del lado del visitante.
const CACHE_TTL_MS = 10 * 60 * 1000;

const leerCache = <T,>(clave: string): T | null => {
  try {
    const crudo = localStorage.getItem(clave);
    if (!crudo) return null;
    const { t, data } = JSON.parse(crudo);
    if (!t || Date.now() - t > CACHE_TTL_MS) return null;
    return data as T;
  } catch { return null; }
};

const guardarCache = (clave: string, data: unknown) => {
  try { localStorage.setItem(clave, JSON.stringify({ t: Date.now(), data })); } catch { /* modo privado */ }
};

const cleanPrice = (val: any): number => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    // Remove '$', '.', and everything that is not a digit
    const str = String(val).replace(/[^0-9]/g, '');
    return Number(str) || 0;
};

// Helper to remove non-breaking spaces and trim for text
const cleanString = (val: any): string => {
    if (!val) return '';
    return String(val).replace(/\u00A0/g, ' ').trim();
};

// Helper for URLs - removes ALL whitespace to prevent broken links
const cleanImageUrl = (val: any): string => {
    if (!val) return '';
    return String(val).replace(/\s/g, ''); 
};

export const fetchMenuFromSheet = async (): Promise<MenuItem[]> => {
  if (!GOOGLE_SHEET_URL) return MENU_ITEMS;

  const cacheado = leerCache<MenuItem[]>('kayso_menu_v1');
  if (cacheado && cacheado.length) return cacheado;

  try {
    // Standard fetch is often more robust for Google Apps Script redirects than using specific credential modes
    const response = await fetch(`${GOOGLE_SHEET_URL}?type=Menu`);
    
    if (!response.ok) {
        // Silent fallback - no need to alarm the console
        return MENU_ITEMS;
    }
    
    const data = await response.json();
    
    if (!data || data.error || !Array.isArray(data)) {
        return MENU_ITEMS;
    }
    
    // Validate and format data
    const items = data.map((item: any) => ({
        ...item,
        category: cleanString(item.category), // Clean category text
        price: cleanPrice(item.price), // Robust parsing
        image: cleanImageUrl(item.image), // Aggressively clean image URL
        popular: String(item.popular).toLowerCase() === 'true'
    }));
    guardarCache('kayso_menu_v1', items);
    return items;
  } catch (error) {
    // Silent fail to constants - The user sees the site working via fallback
    // console.warn("Using offline menu backup");
    return MENU_ITEMS;
  }
};

export const fetchReviewsFromSheet = async (): Promise<Testimonial[]> => {
    if (!GOOGLE_SHEET_URL) return TESTIMONIALS;
  
    try {
      const cacheadas = leerCache<Testimonial[]>('kayso_reviews_v1');
      if (cacheadas && cacheadas.length) return cacheadas;

      const response = await fetch(`${GOOGLE_SHEET_URL}?type=Reviews`);
      
      if (!response.ok) return TESTIMONIALS;
  
      const data = await response.json();
      
      if (!data || data.error || !Array.isArray(data)) return TESTIMONIALS;

      const reviews = data.map((item: any) => ({
          id: item.id || Math.random().toString(),
          name: item.name || 'Cliente Kayso',
          handle: 'Local Guide', // Google style
          text: item.text,
          avatar: cleanImageUrl(item.image), // Optional avatar cleaned
          stars: Number(item.stars) || 5,
          date: item.date || 'Reciente'
      }));
      guardarCache('kayso_reviews_v1', reviews);
      return reviews;
    } catch (error) {
      return TESTIMONIALS;
    }
  };

export const subscribeToNewsletter = async (email: string): Promise<{success: boolean, message: string}> => {
  if (!GOOGLE_SHEET_URL) {
      // Mock success for development without connection
      return new Promise(resolve => setTimeout(() => resolve({success: true, message: "Suscripto correctamente"}), 1000));
  }

  try {
    // We use no-cors + text/plain to avoid preflight OPTIONS requests that usually fail with Google Scripts
    await fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      mode: 'no-cors', 
      headers: {
        'Content-Type': 'text/plain', 
      },
      body: JSON.stringify({ email }),
    });
    
    return { success: true, message: "¡Gracias por suscribirte!" };
  } catch (error) {
    // Return success to user because no-cors won't let us read the response anyway,
    // and usually if it doesn't throw network error, it went through.
    return { success: true, message: "¡Gracias por suscribirte!" };
  }
};
