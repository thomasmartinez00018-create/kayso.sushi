
import React, { useState, useMemo, useEffect } from 'react';
import { WHATSAPP_NUMBER } from '../constants';
import { MenuItem } from '../types';
import { Plus, Flame, UtensilsCrossed, ArrowRight } from 'lucide-react';
import { trackAndRedirectToWhatsApp } from '../services/trackingService';

interface MenuPreviewProps {
  fullMenu?: boolean;
  items: MenuItem[];
  onOpenBuilder?: () => void;
  onRedirect?: (url: string) => void;
  loading?: boolean;
}

export const MenuPreview: React.FC<MenuPreviewProps> = ({ fullMenu = false, items, onOpenBuilder, onRedirect, loading = false }) => {
  // Default state is 'COMBOS'
  const [activeCategory, setActiveCategory] = React.useState<string>('COMBOS');

  // --- CATEGORY ORDERING LOGIC ---
  const categories = useMemo(() => {
    // 1. Get all categories currently present in the items list
    const availableCategories: string[] = Array.from(new Set(items.map(i => i.category)));

    // 2. Define the exact order for Sushi-related items
    const priorityOrder = [
      'Nuestros Rolls',   // Category.ROLLS
      'Rolls Especiales', // Category.SPECIALS
      'Hot Rolls',        // Category.HOT
      'Vegetarianos',     // Category.VEGGIE
      'Entraditas',       // Category.STARTER
      'Ensaladas'         // Category.SALAD
    ];

    // 3. Filter and Sort
    const filteredAndSorted = availableCategories
      .filter((cat: string) => {
         // EXCLUDE individual combo categories from the tabs (they are aggregated in 'COMBOS')
         const lower = cat.toLowerCase();
         return !lower.includes('combinado') && !lower.includes('combo');
      })
      .sort((a: string, b: string) => {
        const indexA = priorityOrder.indexOf(a);
        const indexB = priorityOrder.indexOf(b);
        
        // If both are in the priority list, sort by defined order
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        
        // If only A is in list, it goes first
        if (indexA !== -1) return -1;
        
        // If only B is in list, it goes first
        if (indexB !== -1) return 1;
        
        // If neither, sort alphabetically
        return a.localeCompare(b);
      });

    // 4. Construct final list: COMBOS first, then sorted categories, TODOS last
    return ['COMBOS', ...filteredAndSorted, 'TODOS'];
  }, [items]);


  // --- FILTERING LOGIC ---
  let displayItems: MenuItem[] = [];

  if (activeCategory === 'TODOS') {
    // Logic for TODOS:
    // On Home page (!fullMenu): Show popular items. If none popular, show all.
    // On Full Menu: Show everything.
    const popularItems = items.filter(i => i.popular);
    if (!fullMenu && popularItems.length > 0) {
        displayItems = popularItems;
    } else {
        displayItems = items;
    }
  } else if (activeCategory === 'COMBOS') {
    // Logic for COMBOS:
    // Show ALL items that are combinations, regardless of sub-category (Classic, Premium, etc.)
    displayItems = items.filter(item => {
        const catLower = item.category.toLowerCase();
        return catLower.includes('combinado') || catLower.includes('combo');
    });
  } else {
    // Specific Category Logic:
    // Show all items belonging to that category
    displayItems = items.filter(item => item.category === activeCategory);
  }

  // --- GROUPING LOGIC ---
  // We want to group items ONLY if they belong to specific "Combo" categories.
  const groupedDisplayItems = useMemo(() => {
    const result: (MenuItem | MenuItem[])[] = [];
    const processedComboCategories = new Set<string>();

    // 1. Process items
    displayItems.forEach(item => {
      // Check if this item belongs to a grouping category (Any category with 'Combinado' or 'Combo')
      const catLower = item.category.toLowerCase();
      const isComboCategory = catLower.includes('combinado') || catLower.includes('combo');

      if (isComboCategory) {
        // If we haven't processed this category yet, find ALL items of this category in the current view
        if (!processedComboCategories.has(item.category)) {
            // Find all variants of this specific category (e.g. all "Combinados Premium")
            const variants = displayItems.filter(i => i.category === item.category);
            
            // Sort by price to have ordered sizes (15, 20, 30...)
            variants.sort((a, b) => a.price - b.price);
            
            if (variants.length > 0) {
                result.push(variants);
                processedComboCategories.add(item.category);
            }
        }
      } else {
        // Regular item, just push it
        result.push(item);
      }
    });

    return result;
  }, [displayItems]);

  if (loading) {
    return (
      <section id="menu" className="py-24 bg-[#060606] bg-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-3 bg-gray-800 rounded w-24 mx-auto mb-4 animate-pulse"></div>
            <div className="h-10 bg-gray-800 rounded w-1/3 mx-auto mb-3 animate-pulse"></div>
            <div className="h-4 bg-gray-800 rounded w-1/2 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-[#0c0c0c] rounded-2xl overflow-hidden h-[430px] border border-gray-800 animate-pulse">
                <div className="h-52 bg-gray-900"></div>
                <div className="p-5 flex flex-col h-[calc(100%-13rem)]">
                  <div className="h-5 bg-gray-900 rounded w-2/3 mb-3"></div>
                  <div className="space-y-2 mb-5">
                    <div className="h-3 bg-gray-900 rounded w-full"></div>
                    <div className="h-3 bg-gray-900 rounded w-3/4"></div>
                  </div>
                  <div className="h-11 bg-gray-900 rounded-xl mt-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-24 bg-[#060606] bg-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-kayso-orange text-[10px] font-black uppercase tracking-[0.3em] mb-3">— Menú —</p>
          <h2 className="text-4xl md:text-5xl font-black font-display text-white mb-4 leading-tight">
            Nuestros <span className="text-kayso-orange">Hits</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">
            Desde los clásicos que nunca fallan hasta nuestras creaciones exclusivas.
          </p>
        </div>

        {/* BUILDER BANNER CTA - Only show on Home or top of menu */}
        {!fullMenu && (
          <div 
            onClick={onOpenBuilder}
            className="w-full max-w-4xl mx-auto mb-16 bg-gradient-to-r from-kayso-orange to-red-800 rounded-2xl p-1 cursor-pointer transform transition-transform hover:scale-[1.02] shadow-2xl group"
          >
             <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 h-full w-full">
                <div className="flex items-center gap-6">
                  <div className="bg-white text-kayso-orange p-4 rounded-full shadow-lg group-hover:rotate-12 transition-transform duration-500">
                    <UtensilsCrossed size={32} />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold font-display text-white italic uppercase tracking-wide">
                      ¿No te decidís?
                    </h3>
                    <p className="text-white/90 font-medium">
                      Armá tu propia tabla con los rolls que más te gusten.
                    </p>
                  </div>
                </div>
                <button className="bg-white text-kayso-orange px-6 py-3 rounded-xl font-bold flex items-center gap-2 group-hover:bg-gray-100 transition-colors shadow-lg whitespace-nowrap">
                  Usar Armador <ArrowRight size={20} />
                </button>
             </div>
          </div>
        )}

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                activeCategory === cat
                  ? 'bg-kayso-orange text-white shadow-lg shadow-kayso-orange/20'
                  : 'bg-transparent text-gray-500 border border-gray-800 hover:border-gray-600 hover:text-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {groupedDisplayItems.map((entry) => {
             if (Array.isArray(entry)) {
               // Render Grouped Card (Combos)
               // entry[0] is safe because we check variants.length > 0
               return <GroupedMenuItemCard key={entry[0].category} items={entry} onOpenBuilder={onOpenBuilder} onRedirect={onRedirect} />;
             } else {
               // Render Single Card
               return <MenuItemCard key={entry.id} item={entry} onRedirect={onRedirect} />;
             }
          })}
        </div>
      </div>
    </section>
  );
};

const MenuItemCard: React.FC<{ item: MenuItem; onRedirect?: (url: string) => void }> = ({ item, onRedirect }) => (
  <div className="group card-glow bg-[#0c0c0c] rounded-2xl overflow-hidden border border-gray-800/80 h-full flex flex-col">
    <div className="relative h-52 overflow-hidden flex-shrink-0 img-fade">
      <img
        key={item.image}
        src={item.image}
        alt={item.name}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      {item.popular && (
        <div className="absolute top-3 right-3 z-10 bg-kayso-orange text-white text-[9px] font-black px-2.5 py-1 rounded flex items-center gap-1 shadow-lg uppercase tracking-widest">
          <Flame size={10} /> TOP
        </div>
      )}
      {item.badge && (
        <div className="absolute top-3 left-3 z-10 bg-black/70 backdrop-blur-sm text-kayso-orange border border-kayso-orange/30 text-[9px] font-black px-2.5 py-1 rounded uppercase tracking-widest">
          {item.badge}
        </div>
      )}
      {/* Price in image overlay */}
      <div className="absolute bottom-3 right-3 z-10 bg-black/70 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded-lg">
        <span className="text-white font-black text-base font-display">${item.price.toLocaleString()}</span>
      </div>
    </div>
    <div className="p-5 flex flex-col flex-grow">
      <h3 className="text-lg font-black text-white group-hover:text-kayso-orange transition-colors mb-2 font-display leading-tight">
        {item.name}
      </h3>
      <p className="text-gray-500 text-sm mb-5 flex-grow leading-relaxed">
        {item.description}
      </p>
      <button
        onClick={() => {
          const url = trackAndRedirectToWhatsApp(`Hola! Quiero pedir ${item.name}`, WHATSAPP_NUMBER, { resumen: item.name });
          if (onRedirect) onRedirect(url);
        }}
        className="w-full bg-kayso-orange/10 hover:bg-kayso-orange border border-kayso-orange/25 hover:border-transparent text-kayso-orange hover:text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all mt-auto text-sm"
      >
        <Plus size={16} />
        Agregar al pedido
      </button>
    </div>
  </div>
);

// New Component for Grouped Variants (Combos)
const GroupedMenuItemCard: React.FC<{ items: MenuItem[]; onOpenBuilder?: () => void; onRedirect?: (url: string) => void }> = ({ items, onOpenBuilder, onRedirect }) => {
  // Items are already sorted by price
  const [selectedItem, setSelectedItem] = useState(items[0]);


  // Update state when items prop changes (e.g. when real data loads from Sheet)
  useEffect(() => {
    if (items.length > 0) {
      setSelectedItem(items[0]);
    }
  }, [items]);

  // Helper to extract piece count number from name (e.g. "Combinado (15 Piezas)" -> 15)
  const getPieces = (name: string) => {
    const match = name.match(/(\d+)/);
    return match ? match[0] : '?';
  };

  // Clean name for title (remove the parenthesis part)
  const cleanTitle = items[0].category; // Use the category name as title for combos

  // Logic to find the best image:
  // 1. Try the image of the currently selected variant.
  // 2. If empty, find the first variant in the group that HAS an image.
  // 3. Fallback to empty string.
  const getValidImage = (img: string | undefined) => {
      if (!img) return false;
      return img.trim().length > 0;
  };

  const currentImage = selectedItem.image;
  // Fallback Logic: Check entire group for image if missing
  const displayImage = getValidImage(currentImage) 
    ? currentImage 
    : (items.find(i => getValidImage(i.image))?.image || '');

  return (
    <div className="group card-glow bg-[#0c0c0c] rounded-2xl overflow-hidden border border-gray-800/80 h-full flex flex-col">
      <div className="relative h-52 overflow-hidden flex-shrink-0 img-fade">
        <img
          key={displayImage}
          src={displayImage}
          alt={selectedItem.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 z-10 bg-kayso-orange text-white text-[9px] font-black px-2.5 py-1 rounded uppercase tracking-widest shadow-lg">
          COMBOS
        </div>
        {/* Price in overlay */}
        <div className="absolute bottom-3 right-3 z-10 bg-black/70 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded-lg">
          <span className="text-white font-black text-base font-display">${selectedItem.price.toLocaleString()}</span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-black text-white group-hover:text-kayso-orange transition-colors font-display leading-tight mb-3">
          {cleanTitle}
        </h3>

        {/* Size Selectors */}
        <div className="mb-4">
          <p className="text-[9px] text-gray-600 mb-2 uppercase font-black tracking-[0.2em]">Elegí el tamaño:</p>
          <div className="flex flex-wrap gap-2">
            {items.map(variant => {
              const pieces = getPieces(variant.name);
              const isSelected = selectedItem.id === variant.id;
              return (
                <button
                  key={variant.id}
                  onClick={() => setSelectedItem(variant)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-black transition-all ${
                    isSelected
                      ? 'bg-kayso-orange text-white shadow-md shadow-kayso-orange/20'
                      : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-600 hover:text-gray-200'
                  }`}
                >
                  {pieces} p.
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-5 flex-grow leading-relaxed">
          {selectedItem.description}
        </p>

        <div className="flex flex-col gap-2.5 mt-auto">
          <button
            onClick={() => {
              const url = trackAndRedirectToWhatsApp(`Hola! Quiero pedir ${selectedItem.name}`, WHATSAPP_NUMBER, { resumen: selectedItem.name });
              if (onRedirect) onRedirect(url);
            }}
            className="w-full bg-kayso-orange hover:bg-red-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm shadow-lg shadow-kayso-orange/15"
          >
            <Plus size={16} />
            Pedir este combo
          </button>
          <button
            onClick={onOpenBuilder}
            className="w-full bg-transparent hover:bg-white/5 text-gray-500 hover:text-gray-300 border border-gray-800 hover:border-gray-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm"
          >
            <UtensilsCrossed size={15} />
            Personalizar
          </button>
        </div>
      </div>
    </div>
  );
};
