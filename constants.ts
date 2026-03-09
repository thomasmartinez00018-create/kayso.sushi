
import { Category, MenuItem, BlogPost, BuilderRollOption, BuilderExtraOption, ComboSize, Testimonial } from './types';

// --- CONFIGURATION ---
// PEGA AQUI EL LINK DE TU LOGO REAL (Ej: "https://i.postimg.cc/abcd/logo.png")
export const LOGO_URL: string = "https://i.postimg.cc/bvS81MjF/Diseno-sin-titulo.png"; 

// --- GOOGLE SHEETS BACKEND ---
// Tu panel de control: https://docs.google.com/spreadsheets/d/1V4msNjxUg5L06Mm97S936d6z7atAixA8DmmTM8e0DU0/edit#gid=471061672
// Recuerda que la pestaña debe llamarse "Menu" (sin tilde)
export const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwyL6GFaL9NKAdQbbuyENSRiqxzfY13cXiclzjykKy2UzhiY9BNv3xu8Kf0GVAfdgPdSg/exec";

export const WHATSAPP_GELLY = "5491150538254";
export const WHATSAPP_PERON = "5491128627514";
// Default number for general CTA
export const WHATSAPP_NUMBER = WHATSAPP_GELLY; 

// Helper to generate AI Image URLs - Optimized for sharpness
const getAIImage = (prompt: string, seed: number) => 
  `https://image.pollinations.ai/prompt/delicious%20sushi%20${encodeURIComponent(prompt)}%20professional%20food%20photography%208k%20cinematic%20lighting?width=1280&height=720&nologo=true&seed=${seed}`;

// --- MENU DATA (RESPALDO) ---
// Estos datos se muestran si falla la conexión con Google Sheets
export const MENU_ITEMS: MenuItem[] = [
  // --- COMBINADOS DE SALMÓN ---
  {
    id: 'cs_15',
    name: 'Combinado Salmón (15 Piezas)',
    description: 'Incluye: New York, Phila, Philadelfia, Niguiris de salmón, Mango roll y Salmón grill.',
    price: 17000,
    category: Category.COMBO_SALMON,
    image: getAIImage('sushi combo salmon 15 pieces orange fresh sashimi nigiri', 1001),
    popular: true
  },
  {
    id: 'cs_20',
    name: 'Combinado Salmón (20 Piezas)',
    description: 'Incluye: New York, Phila, Philadelfia, Niguiris de salmón, Mango roll y Salmón grill.',
    price: 21000,
    category: Category.COMBO_SALMON,
    image: getAIImage('sushi combo salmon 20 pieces orange fresh sashimi nigiri platter', 1002)
  },
  {
    id: 'cs_30',
    name: 'Combinado Salmón (30 Piezas)',
    description: 'Incluye: New York, Phila, Philadelfia, Niguiris de salmón, Mango roll y Salmón grill.',
    price: 32500,
    category: Category.COMBO_SALMON,
    image: getAIImage('sushi combo salmon 30 pieces large platter orange fresh', 1003)
  },
  {
    id: 'cs_45',
    name: 'Combinado Salmón (45 Piezas)',
    description: 'Incluye: New York, Phila, Philadelfia, Niguiris de salmón, Mango roll y Salmón grill.',
    price: 48000,
    category: Category.COMBO_SALMON,
    image: getAIImage('sushi combo salmon 45 pieces huge boat platter', 1004)
  },
  {
    id: 'cs_60',
    name: 'Combinado Salmón (60 Piezas)',
    description: 'Incluye: New York, Phila, Philadelfia, Niguiris de salmón, Mango roll y Salmón grill.',
    price: 63500,
    category: Category.COMBO_SALMON,
    image: getAIImage('sushi combo salmon 60 pieces party size platter', 1005)
  },

  // --- COMBINADOS PREMIUM ---
  {
    id: 'cp_15',
    name: 'Combinado Premium (15 Piezas)',
    description: 'Incluye: Futurama, Teriyaki, Buenos Aires, Mango roll, Katu roll y Alaska.',
    price: 18000,
    category: Category.COMBO_PREMIUM,
    image: getAIImage('premium sushi combo 15 pieces gourmet rolls variety', 2001),
    popular: true
  },
  {
    id: 'cp_20',
    name: 'Combinado Premium (20 Piezas)',
    description: 'Incluye: Futurama, Teriyaki, Buenos Aires, Mango roll, Katu roll y Alaska.',
    price: 22000,
    category: Category.COMBO_PREMIUM,
    image: getAIImage('premium sushi combo 20 pieces gourmet rolls variety', 2002)
  },
  {
    id: 'cp_30',
    name: 'Combinado Premium (30 Piezas)',
    description: 'Incluye: Futurama, Teriyaki, Buenos Aires, Mango roll, Katu roll y Alaska.',
    price: 35000,
    category: Category.COMBO_PREMIUM,
    image: getAIImage('premium sushi combo 30 pieces boat gourmet', 2003)
  },
  {
    id: 'cp_45',
    name: 'Combinado Premium (45 Piezas)',
    description: 'Incluye: Futurama, Teriyaki, Buenos Aires, Mango roll, Katu roll y Alaska.',
    price: 50000,
    category: Category.COMBO_PREMIUM,
    image: getAIImage('premium sushi combo 45 pieces large gourmet platter', 2004)
  },
  {
    id: 'cp_60',
    name: 'Combinado Premium (60 Piezas)',
    description: 'Incluye: Futurama, Teriyaki, Buenos Aires, Mango roll, Katu roll y Alaska.',
    price: 68000,
    category: Category.COMBO_PREMIUM,
    image: getAIImage('premium sushi combo 60 pieces party gourmet', 2005)
  },

  // --- COMBINADOS CLÁSICOS ---
  {
    id: 'cc_15',
    name: 'Combinado Classic (15 Piezas)',
    description: 'Incluye: California, Salmón grill y Vegetarianos.',
    price: 13500,
    category: Category.COMBO_CLASSIC,
    image: getAIImage('classic sushi combo 15 pieces california roll vegetarian', 3001)
  },
  {
    id: 'cc_20',
    name: 'Combinado Classic (20 Piezas)',
    description: 'Incluye: California, Salmón grill y Vegetarianos.',
    price: 18000,
    category: Category.COMBO_CLASSIC,
    image: getAIImage('classic sushi combo 20 pieces california roll vegetarian', 3002)
  },
  {
    id: 'cc_30',
    name: 'Combinado Classic (30 Piezas)',
    description: 'Incluye: California, Salmón grill y Vegetarianos.',
    price: 26000,
    category: Category.COMBO_CLASSIC,
    image: getAIImage('classic sushi combo 30 pieces simple rolls platter', 3003)
  },
  {
    id: 'cc_45',
    name: 'Combinado Classic (45 Piezas)',
    description: 'Incluye: California, Salmón grill y Vegetarianos.',
    price: 39500,
    category: Category.COMBO_CLASSIC,
    image: getAIImage('classic sushi combo 45 pieces simple rolls platter', 3004)
  },
  {
    id: 'cc_60',
    name: 'Combinado Classic (60 Piezas)',
    description: 'Incluye: California, Salmón grill y Vegetarianos.',
    price: 50500,
    category: Category.COMBO_CLASSIC,
    image: getAIImage('classic sushi combo 60 pieces party platter', 3005)
  },

  // --- NUESTROS ROLLS (x10u) ---
  {
    id: 'r_phila',
    name: 'Philadelphia (10u)',
    description: 'Salmón y queso philadelphia.',
    price: 12000,
    category: Category.ROLLS,
    image: getAIImage('sushi roll philadelphia salmon cream cheese white rice', 4001)
  },
  {
    id: 'r_ny',
    name: 'New York Phila (10u)',
    description: 'Salmón, philadelphia y palta.',
    price: 12000,
    category: Category.ROLLS,
    image: getAIImage('sushi roll new york style salmon avocado sesame seeds', 4002)
  },
  {
    id: 'r_ba',
    name: 'Buenos Aires (10u)',
    description: 'Langostino, phila, palta, recubierto en salmón.',
    price: 12000,
    category: Category.ROLLS,
    image: getAIImage('sushi roll buenos aires style salmon topping shrimp filling', 4003),
    popular: true
  },
  {
    id: 'r_cali',
    name: 'California (10u)',
    description: 'Kanikama, queso philadelphia y palta.',
    price: 12000,
    category: Category.ROLLS,
    image: getAIImage('sushi roll california crab stick avocado', 4004)
  },
  {
    id: 'r_grill',
    name: 'Salmón Grill (10u)',
    description: 'Salmón cocido y queso phila.',
    price: 12000,
    category: Category.ROLLS,
    image: getAIImage('sushi roll cooked salmon filling grilled', 4005)
  },
  {
    id: 'r_alaska',
    name: 'Alaska (10u)',
    description: 'Salmón, philadelphia y lluvia de verdeo.',
    price: 12000,
    category: Category.ROLLS,
    image: getAIImage('sushi roll salmon cream cheese green onion chives topping', 4006)
  },
  {
    id: 'r_futurama',
    name: 'Futurama (10u)',
    description: 'Langostinos rebozados y philadelphia.',
    price: 12000,
    category: Category.ROLLS,
    image: getAIImage('sushi roll fried shrimp tempura inside cream cheese', 4007),
    popular: true
  },
  {
    id: 'r_teriyaki',
    name: 'Teriyaki (10u)',
    description: 'Salmón teriyaki y queso philadelphia.',
    price: 12000,
    category: Category.ROLLS,
    image: getAIImage('sushi roll cooked salmon teriyaki sauce glaze', 4008)
  },
  {
    id: 'r_mexican',
    name: 'Mexican (10u)',
    description: 'Salmón marinado, lima, recubierto con salsa guacamole.',
    price: 12000,
    category: Category.ROLLS,
    image: getAIImage('sushi roll guacamole topping mexican fusion green', 4009)
  },
  {
    id: 'r_smoke',
    name: 'Smoke (10u)',
    description: 'Salmón ahumado, philadelphia y tomates secos.',
    price: 12000,
    category: Category.ROLLS,
    image: getAIImage('sushi roll smoked salmon sun dried tomatoes', 4010)
  },
  {
    id: 'r_mango',
    name: 'Mango Roll (10u)',
    description: 'Salmón, phila, mango, almendras.',
    price: 13000,
    category: Category.ROLLS,
    image: getAIImage('sushi roll mango topping almonds tropical', 4011),
    popular: true
  },
  {
    id: 'r_puntacana',
    name: 'Punta Cana (10u)',
    description: 'Palta, phila y salmón ahumado.',
    price: 13000,
    category: Category.ROLLS,
    image: getAIImage('sushi roll smoked salmon topping avocado', 4012)
  },

  // --- HOT ROLLS ---
  {
    id: 'h_10',
    name: 'Rolls Calentitos (10u)',
    description: 'Rebozados. Relleno a elección: Salmón o Langostinos.',
    price: 12000,
    category: Category.HOT,
    image: getAIImage('hot roll fried sushi breaded crispy 10 pieces', 5001),
    popular: true
  },
  {
    id: 'h_5',
    name: 'Rolls Calentitos (5u)',
    description: 'Rebozados. Relleno a elección: Salmón o Langostinos.',
    price: 6500,
    category: Category.HOT,
    image: getAIImage('hot roll fried sushi breaded crispy 5 pieces', 5002)
  },

  // --- ESPECIALES (x6 y piezas) ---
  {
    id: 'sp_nigiri',
    name: 'Niguiri de Salmón (6u)',
    description: 'Bocado de arroz recubierto en salmón.',
    price: 9500,
    category: Category.SPECIALS,
    image: getAIImage('salmon nigiri sushi 6 pieces raw fish rice', 6001)
  },
  {
    id: 'sp_nigiri_f',
    name: 'Niguiri de Salmón Flameado (6u)',
    description: 'Bocado de arroz recubierto en salmón flameado.',
    price: 10000,
    category: Category.SPECIALS,
    image: getAIImage('seared salmon nigiri torched sushi 6 pieces', 6002)
  },
  {
    id: 'sp_geisha',
    name: 'Geishas (6u)',
    description: 'Lámina de salmón, queso philadelphia y palta.',
    price: 10000,
    category: Category.SPECIALS,
    image: getAIImage('salmon geisha sushi cream cheese avocado wrapped in fish', 6003)
  },
  {
    id: 'sp_geisha_a',
    name: 'Geishas Alaska (6u)',
    description: 'Con lluvia de ciboulette.',
    price: 10000,
    category: Category.SPECIALS,
    image: getAIImage('salmon geisha sushi chives topping', 6004)
  },
  {
    id: 'sp_tamago',
    name: 'Tamago (6u)',
    description: 'Salmón, queso philadelphia y verdeo.',
    price: 12000,
    category: Category.SPECIALS,
    image: getAIImage('tamago sushi roll egg wrap salmon green onion', 6005)
  },
  {
    id: 'sp_kayso',
    name: 'Kayso Roll (6u)',
    description: 'Tamago, philadelphia, salmon ahumado, mango y lluvia de batatas fritas.',
    price: 12000,
    category: Category.SPECIALS,
    image: getAIImage('special sushi roll sweet potato chips topping mango smoked salmon', 6006),
    popular: true
  },
  {
    id: 'sp_temaki',
    name: 'Temaki (1u)',
    description: 'Cono de alga nori.',
    price: 8000,
    category: Category.SPECIALS,
    image: getAIImage('temaki hand roll sushi cone', 6007)
  },
  {
    id: 'sp_sashimi',
    name: 'Sashimi de Salmón (5u)',
    description: 'Finas fetas de salmón fresco.',
    price: 11000,
    category: Category.SPECIALS,
    image: getAIImage('salmon sashimi slices raw fish plate 5 pieces', 6008)
  },

  // --- VEGETARIANOS ---
  {
    id: 'v_tomato',
    name: 'Tomato Roll (10u)',
    description: 'Tomates secos, queso philadelphia, zanahoria.',
    price: 11000,
    category: Category.VEGGIE,
    image: getAIImage('vegetarian sushi roll sun dried tomatoes', 7001)
  },
  {
    id: 'v_classic',
    name: 'Veggie Classic (10u)',
    description: 'Phila, zanahoria, pepino.',
    price: 11000,
    category: Category.VEGGIE,
    image: getAIImage('vegetarian sushi roll cucumber carrot cream cheese', 7002)
  },
  {
    id: 'v_mango',
    name: 'Veggie Mango (10u)',
    description: 'Phila, mango, ciboulette.',
    price: 11000,
    category: Category.VEGGIE,
    image: getAIImage('vegetarian sushi roll mango filling', 7003)
  },
  {
    id: 'v_chia',
    name: 'Chia Roll (10u)',
    description: 'Phila, batata, semillas chía.',
    price: 11000,
    category: Category.VEGGIE,
    image: getAIImage('vegetarian sushi roll chia seeds topping sweet potato', 7004)
  },
  {
    id: 'v_cibou',
    name: 'Ciboulette (10u)',
    description: 'Phila, palta, ciboulette.',
    price: 11000,
    category: Category.VEGGIE,
    image: getAIImage('vegetarian sushi roll chives topping avocado', 7005)
  },
  {
    id: 'v_combo',
    name: 'Combinado Vegetariano (20u)',
    description: 'Surtidas.',
    price: 19000,
    category: Category.VEGGIE,
    image: getAIImage('vegetarian sushi combo 20 pieces', 7006)
  },

  // --- ENTRADITAS ---
  {
    id: 'e_langos',
    name: 'Langostinos Rebozados',
    description: 'x7 unid + salsa.',
    price: 11000,
    category: Category.STARTER,
    image: getAIImage('fried breaded shrimp panko appetizer 7 pieces', 8001)
  },
  {
    id: 'e_nuggets',
    name: 'Nuggets de Pollo',
    description: 'x8 unid + salsa.',
    price: 7000,
    category: Category.STARTER,
    image: getAIImage('chicken nuggets fried appetizer 8 pieces', 8002)
  },
  {
    id: 'e_spring3',
    name: 'Spring Rolls (x3)',
    description: 'Carne/cebolla o Verduras.',
    price: 5000,
    category: Category.STARTER,
    image: getAIImage('spring rolls fried 3 pieces', 8003)
  },
  {
    id: 'e_spring5',
    name: 'Spring Rolls (x5)',
    description: 'Carne/cebolla o Verduras.',
    price: 8000,
    category: Category.STARTER,
    image: getAIImage('spring rolls fried 5 pieces', 8004)
  },

  // --- ENSALADAS (CHIRASHI) ---
  {
    id: 's_langos',
    name: 'Chirashi Langostinos Rebozados',
    description: 'Base de arroz, queso philadelphia, palta y semillas.',
    price: 12000,
    category: Category.SALAD,
    image: getAIImage('poke bowl fried shrimp sushi bowl', 9001)
  },
  {
    id: 's_salmonf',
    name: 'Chirashi Salmón Fresco',
    description: 'Base de arroz, queso philadelphia, palta y semillas.',
    price: 12000,
    category: Category.SALAD,
    image: getAIImage('poke bowl fresh salmon sushi bowl', 9002)
  },
  {
    id: 's_salmonr',
    name: 'Chirashi Salmón Rebozado',
    description: 'Base de arroz, queso philadelphia, palta y semillas.',
    price: 12000,
    category: Category.SALAD,
    image: getAIImage('poke bowl fried salmon sushi bowl', 9003)
  },
  {
    id: 's_salmont',
    name: 'Chirashi Salmón Teriyaki',
    description: 'Base de arroz, queso philadelphia, palta y semillas.',
    price: 12000,
    category: Category.SALAD,
    image: getAIImage('poke bowl teriyaki salmon sushi bowl', 9004)
  },
  {
    id: 's_kani',
    name: 'Chirashi Kanikama',
    description: 'Base de arroz, queso philadelphia, palta y semillas.',
    price: 11500,
    category: Category.SALAD,
    image: getAIImage('poke bowl kanikama crab stick sushi bowl', 9005)
  },
  {
    id: 's_chicken',
    name: 'Chirashi Chicken',
    description: 'Base de arroz, queso philadelphia, palta y semillas.',
    price: 11500,
    category: Category.SALAD,
    image: getAIImage('poke bowl chicken sushi bowl', 9006)
  },
  {
    id: 's_veggie',
    name: 'Chirashi Vegetariana',
    description: 'Zanahoria dulce y pepino. Base de arroz, queso, palta.',
    price: 11500,
    category: Category.SALAD,
    image: getAIImage('poke bowl vegetarian vegetable sushi bowl', 9007)
  }
];

// --- BLOG DATA ---
export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: '5 Beneficios de comer Sushi',
    excerpt: 'Descubrí por qué el sushi no solo es rico, sino también un aliado para tu salud gracias al Omega 3.',
    date: '12 OCT 2023',
    image: getAIImage('fresh raw salmon steak omega 3 healthy food concept', 9901),
    content: '...'
  },
  {
    id: '2',
    title: '¿Cómo usar los palitos correctamente?',
    excerpt: 'Guía rápida para no pasar vergüenza en tu próxima cita. ¡Es más fácil de lo que parece!',
    date: '05 NOV 2023',
    image: getAIImage('hands holding wooden chopsticks picking up sushi roll close up', 9902),
    content: '...'
  },
  {
    id: '3',
    title: 'Maridajes: ¿Qué tomar con Sushi?',
    excerpt: 'Vino blanco, cerveza o té verde. Te contamos cuál es la mejor bebida para acompañar tus rolls.',
    date: '20 NOV 2023',
    image: getAIImage('white wine glass and beer glass next to sushi platter pairing', 9903),
    content: '...'
  }
];

// --- TESTIMONIALS (Empty as requested) ---
export const TESTIMONIALS: Testimonial[] = [];

// --- BUILDER CONFIGURATION ---

export const COMBO_SIZES: ComboSize[] = [
  { id: 's15', pieces: 15, slots: 3, basePrice: 19000 },
  { id: 's30', pieces: 30, slots: 6, basePrice: 39000 },
  { id: 's50', pieces: 50, slots: 10, basePrice: 65000 },
];

export const BUILDER_UPSELLS: BuilderExtraOption[] = [
  { id: 'u_palitos', name: 'Palitos Extra', price: 500, type: 'UPSELL' },
  { id: 'u_soja', name: 'Salsa de Soja Extra', price: 1000, type: 'UPSELL' },
  { id: 'u_ba', name: 'Salsa Buenos Aires', price: 1500, type: 'UPSELL' },
  { id: 'u_teri', name: 'Salsa Teriyaki', price: 1500, type: 'UPSELL' },
  { id: 'u_mara', name: 'Salsa Maracuyá', price: 1500, type: 'UPSELL' },
  { id: 'u_wasabi', name: 'Wasabi Extra', price: 1000, type: 'UPSELL' },
  { id: 'u_jengibre', name: 'Jengibre', price: 1000, type: 'UPSELL' },
];

export const BUILDER_ROLLS: BuilderRollOption[] = [];

export const BUILDER_EXTRAS: BuilderExtraOption[] = [];
