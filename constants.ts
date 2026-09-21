
import { MenuItem, BlogPost, BuilderRollOption, BuilderExtraOption, ComboSize, Testimonial } from './types';
import menuSnapshot from './data/menu-snapshot.json';

// --- CONFIGURATION ---
// PEGA AQUI EL LINK DE TU LOGO REAL (Ej: "https://i.postimg.cc/abcd/logo.png")
export const LOGO_URL: string = "/img/logo.webp"; // local: antes eran 101 KB de PNG desde postimg

// --- GOOGLE SHEETS BACKEND ---
// Tu panel de control: https://docs.google.com/spreadsheets/d/1V4msNjxUg5L06Mm97S936d6z7atAixA8DmmTM8e0DU0/edit#gid=471061672
// Recuerda que la pestaña debe llamarse "Menu" (sin tilde)
export const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwyL6GFaL9NKAdQbbuyENSRiqxzfY13cXiclzjykKy2UzhiY9BNv3xu8Kf0GVAfdgPdSg/exec";

export const WHATSAPP_GELLY = "5491150538254";
export const WHATSAPP_PERON = "5491128627514";
// Default number for general CTA
export const WHATSAPP_NUMBER = WHATSAPP_PERON;

// --- DESCUENTO EN EFECTIVO (fuente única: checkout + mensaje de WhatsApp) ---
// Regla escrita por Gladys el 21-sep-2026, pagando en efectivo:
//   lunes, martes, viernes, sábado y domingo: 10% · miércoles y jueves: 20%.
// En ambos NO se aplica a: salsas, bebidas, spring rolls, langostinos rebozados y Franui.
// Con otro medio de pago no hay descuento.
export const CASH_DISCOUNT_BASE = 0.10;
export const CASH_DISCOUNT_PROMO = 0.20;
export const CASH_DISCOUNT_DAYS = [3, 4]; // 3 = miércoles, 4 = jueves (hora argentina)

/** Texto corto de lo que no lleva descuento, igual en toda la web. */
export const NO_DISCOUNT_TEXT = 'salsas, bebidas, spring rolls, langostinos rebozados ni Franui';

/** Extras del armador que no llevan descuento (la lista de Gladys). */
export const NO_DISCOUNT_EXTRAS = [
  'u_soja', 'u_ba', 'u_teri', 'u_mara', // salsas
  'u_coca', 'u_coca_zero', 'u_agua',    // bebidas
  'u_langostinos',                      // langostinos rebozados
  'u_franui',                           // Franui
];

/** Productos del menú sin descuento, por nombre (los ids de la planilla pueden cambiar). */
// Anclado al inicio: la "Chirashi Salad Langostinos Rebozados" es ensalada y SÍ lleva descuento.
const NO_DISCOUNT_NAMES = /^(spring\s*rolls?|langostinos\s+rebozados|franui|salsa|coca-cola|agua)/i;

/** ¿Este producto del carrito entra en el descuento en efectivo? */
export const isDiscountable = (productId: string | number, name = ''): boolean => {
  const pid = String(productId); // los ids de la planilla llegan como número
  if (NO_DISCOUNT_EXTRAS.some(id => pid === `extra-${id}` || pid === id)) return false;
  return !NO_DISCOUNT_NAMES.test(name);
};

/** Tasa de descuento vigente pagando en efectivo según el día (0 si no es efectivo). */
export const getCashDiscountRate = (payment?: string | null): number => {
  if (payment !== 'efectivo') return 0;
  const dia = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short' })
    .format(new Date());
  const idx = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(dia);
  return CASH_DISCOUNT_DAYS.includes(idx) ? CASH_DISCOUNT_PROMO : CASH_DISCOUNT_BASE;
};

/** Monto del descuento en efectivo: solo sobre los productos que lo llevan. */
export const getCashDiscount = (
  items: Array<{ productId: string | number; price: number; quantity: number; name?: string }>,
  payment?: string | null,
): number => {
  const rate = getCashDiscountRate(payment);
  if (rate === 0) return 0;
  const base = items.filter(i => isDiscountable(i.productId, i.name)).reduce((n, i) => n + i.price * i.quantity, 0);
  return Math.round(base * rate);
};

// --- MENU DATA (RESPALDO) ---
// Snapshot de la planilla (17-sep-2026). Se muestra al instante y se pisa con la planilla
// cuando responde. Antes eran imágenes generadas por IA: 218 KB por visita que nadie veía.
// Para refrescarlo: curl "$GOOGLE_SHEET_URL?type=Menu" y regenerar data/menu-snapshot.json.

export const MENU_ITEMS: MenuItem[] = menuSnapshot as MenuItem[];

// --- BLOG DATA ---
export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: '5 Beneficios de comer Sushi',
    excerpt: 'Descubrí por qué el sushi no solo es rico, sino también un aliado para tu salud gracias al Omega 3.',
    date: '12 OCT 2023',
    image: '',
    content: '...'
  },
  {
    id: '2',
    title: '¿Cómo usar los palitos correctamente?',
    excerpt: 'Guía rápida para no pasar vergüenza en tu próxima cita. ¡Es más fácil de lo que parece!',
    date: '05 NOV 2023',
    image: '',
    content: '...'
  },
  {
    id: '3',
    title: 'Maridajes: ¿Qué tomar con Sushi?',
    excerpt: 'Vino blanco, cerveza o té verde. Te contamos cuál es la mejor bebida para acompañar tus rolls.',
    date: '20 NOV 2023',
    image: '',
    content: '...'
  }
];

// --- TESTIMONIALS ---
export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Brenda Camaño',
    handle: '@brendac',
    text: 'El Buenos Aires es adictivo, realmente muy fresco todo. El mejor sushi de San Miguel.',
    avatar: '',
    stars: 5,
    date: 'Hace 2 semanas',
    product: 'Buenos Aires Roll'
  },
  {
    id: '2',
    name: 'Agostina Hellner',
    handle: '@agostina',
    text: 'Excelente relación precio-calidad. Los combos premium son increíbles.',
    avatar: '',
    stars: 5,
    date: 'Hace 1 mes',
    product: 'Combinado Premium'
  },
  {
    id: '3',
    name: 'Mauro Benitez',
    handle: '@mauro',
    text: 'Llegó súper rápido y la presentación es de 10. Muy recomendable.',
    avatar: '',
    stars: 5,
    date: 'Hace 3 días',
    product: 'Combinado Salmón'
  }
];

// --- BUILDER CONFIGURATION ---

export const COMBO_SIZES: ComboSize[] = [
  { id: 's15', pieces: 15, slots: 3, basePrice: 21000 },
  { id: 's30', pieces: 30, slots: 6, basePrice: 41000 },
  { id: 's50', pieces: 50, slots: 10, basePrice: 68000 },
];

export const BUILDER_UPSELLS: BuilderExtraOption[] = [
  // Cross-sell de comida de alto valor primero (sube el ticket mucho más que la bebida)
  { id: 'u_burger', name: 'Sushi Burger (salmón fresco)', price: 18000, type: 'UPSELL' },
  { id: 'u_pancho', name: 'Pancho Sushi (salmón fresco)', price: 16000, type: 'UPSELL' },
  { id: 'u_langostinos', name: 'Langostinos Rebozados (x7)', price: 14000, type: 'UPSELL' },
  { id: 'u_palitos', name: 'Palitos Extra', price: 500, type: 'UPSELL' },
  { id: 'u_soja', name: 'Salsa de Soja Extra', price: 1000, type: 'UPSELL' },
  { id: 'u_ba', name: 'Salsa Buenos Aires', price: 1500, type: 'UPSELL' },
  { id: 'u_teri', name: 'Salsa Teriyaki', price: 1500, type: 'UPSELL' },
  { id: 'u_mara', name: 'Salsa Maracuyá', price: 1500, type: 'UPSELL' },
  { id: 'u_wasabi', name: 'Wasabi Extra', price: 1000, type: 'UPSELL' },
  { id: 'u_jengibre', name: 'Jengibre', price: 1000, type: 'UPSELL' },
  { id: 'u_coca', name: 'Coca-Cola 500ml', price: 3000, type: 'UPSELL' },
  { id: 'u_coca_zero', name: 'Coca-Cola Zero 500ml', price: 3000, type: 'UPSELL' },
  { id: 'u_agua', name: 'Agua Mineral 500ml', price: 2000, type: 'UPSELL' },
  { id: 'u_franui', name: 'Franui', price: 9000, type: 'UPSELL' },
];

export const BUILDER_ROLLS: BuilderRollOption[] = [];

export const BUILDER_EXTRAS: BuilderExtraOption[] = [];
