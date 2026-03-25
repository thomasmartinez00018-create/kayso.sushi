
export enum Category {
  COMBO_CLASSIC = 'Combinados Clásicos',
  COMBO_SALMON = 'Combinados de Salmón',
  COMBO_PREMIUM = 'Combinados Premium',
  VEGGIE = 'Vegetarianos',
  HOT = 'Hot Rolls',
  STARTER = 'Entraditas',
  ROLLS = 'Nuestros Rolls',
  SPECIALS = 'Rolls Especiales',
  SALAD = 'Ensaladas'
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  popular?: boolean;
  badge?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  handle: string;
  text: string;
  avatar: string;
  stars?: number;
  date?: string;
  product?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  content: string;
}

export type ViewState = 'HOME' | 'MENU' | 'LOCATIONS' | 'BLOG' | 'BUILDER' | 'BLOG_POST';

export interface BuilderRollOption {
  id: string;
  name: string;
  description: string;
  isPremium: boolean;
  extraPrice?: number;
  image: string;
}

export interface BuilderExtraOption {
  id: string;
  name: string;
  price: number;
  type: 'STARTER' | 'DRINK' | 'UPSELL';
}

export interface ComboSize {
  id: string;
  pieces: number;
  slots: number; // How many roll varieties to pick
  basePrice: number;
}
