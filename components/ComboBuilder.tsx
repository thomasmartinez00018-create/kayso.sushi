
import React, { useState, useMemo, useEffect } from 'react';
import { COMBO_SIZES, BUILDER_UPSELLS } from '../constants';
import { ComboSize, MenuItem, Category } from '../types';
import { Check, ChevronRight, Minus, Plus, ShoppingCart, ArrowLeft, Star, Heart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface ComboBuilderProps {
  menuItems?: MenuItem[];
  onAdded?: () => void;   // called after combo is added to cart (to open drawer / navigate)
}

export const ComboBuilder: React.FC<ComboBuilderProps> = ({ menuItems = [], onAdded }) => {
  const { addItem, openDrawer } = useCart();
  // State
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedSize, setSelectedSize] = useState<ComboSize | null>(null);
  const [selectedRolls, setSelectedRolls] = useState<{ [key: string]: number }>({});
  const [selectedExtras, setSelectedExtras] = useState<{ [key: string]: number }>({});

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // --- DYNAMIC DATA PREPARATION ---
  
  // 1. Filter Rolls for Builder (Exclude Combos, Drinks, etc.)
  const availableRolls = useMemo(() => {
    // STRICT allowed categories (No Specials, No Nigiri, No Geishas)
    // Only 'Nuestros Rolls' (ROLLS) and 'Vegetarianos' (VEGGIE)
    const allowedCategories = [Category.ROLLS, Category.VEGGIE];
    
    // Normalize string for loose comparison (remove accents, lowercase, trim)
    const normalize = (str: string) => str.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const allowedSet = new Set(allowedCategories.map(c => normalize(c)));

    // Sort logic: Alphabetical
    return menuItems
      .filter(item => {
          const itemCat = normalize(item.category);
          const nameLower = normalize(item.name);
          const descLower = normalize(item.description);
          
          // Primary Category Check
          if (!allowedSet.has(itemCat)) return false;

          // Secondary Security Check: Explicitly exclude non-rolls and items of 6 units
          if (
              nameLower.includes('niguiri') || 
              nameLower.includes('geisha') || 
              nameLower.includes('sashimi') || 
              nameLower.includes('temaki') ||
              nameLower.includes('combinado') ||
              nameLower.includes('kayso') ||   // Saca el Kayso Roll
              nameLower.includes('tamago') ||  // Saca el Tamago
              // Exclude anything mentioning 6 units
              nameLower.includes('6u') || 
              nameLower.includes('6 u') || 
              nameLower.includes('6 piezas') || 
              nameLower.includes('6 unidades') ||
              descLower.includes('6u') || 
              descLower.includes('6 u') || 
              descLower.includes('6 piezas') || 
              descLower.includes('6 unidades')
          ) {
            return false;
          }

          return true;
      })
      .map(item => {
        // Clean name: Remove (10u), (x10), etc. to avoid confusion
        const cleanName = item.name.replace(/\s*\(\s*[xX]?\d+\s*[uU]?\s*\)/gi, '').trim();

        return {
          id: item.id,
          name: cleanName,
          description: item.description,
          image: item.image,
          isPremium: false, // Per client request: Standard rolls, price handled by combo base price
          extraPrice: 0
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [menuItems]);

  // 2. Extras are now fixed High-Margin Upsells from constants
  const availableExtras = BUILDER_UPSELLS;


  // Computed Values
  const totalRollsSelected = (Object.values(selectedRolls) as number[]).reduce((a, b) => a + b, 0);
  const isSelectionComplete = selectedSize ? totalRollsSelected >= selectedSize.slots : false;

  const totalPrice = useMemo(() => {
    let total = 0;
    if (selectedSize) total += selectedSize.basePrice;
    
    // Add premium roll costs (if any logic is re-enabled later)
    Object.entries(selectedRolls).forEach(([rollId, count]: [string, number]) => {
      const roll = availableRolls.find(r => String(r.id) === String(rollId));
      if (roll && roll.extraPrice) {
        total += roll.extraPrice * count; 
      }
    });

    // Add extras
    Object.entries(selectedExtras).forEach(([extraId, count]: [string, number]) => {
      const extra = availableExtras.find(e => String(e.id) === String(extraId));
      if (extra) {
        total += extra.price * count;
      }
    });

    return total;
  }, [selectedSize, selectedRolls, selectedExtras, availableRolls, availableExtras]);

  // Handlers
  const handleSelectSize = (size: ComboSize) => {
    setSelectedSize(size);
    setSelectedRolls({}); // Reset rolls on size change
    setStep(2);
  };

  const handleUpdateRoll = (rollId: string, delta: number) => {
    if (!selectedSize) return;
    
    const currentCount = selectedRolls[rollId] || 0;
    const newCount = currentCount + delta;

    if (newCount < 0) return;
    if (delta > 0 && totalRollsSelected >= selectedSize.slots) return; // Limit reached

    const newSelection = { ...selectedRolls };
    if (newCount === 0) {
      delete newSelection[rollId];
    } else {
      newSelection[rollId] = newCount;
    }
    setSelectedRolls(newSelection);
  };

  const handleUpdateExtra = (extraId: string, delta: number) => {
    const currentCount = selectedExtras[extraId] || 0;
    const newCount = currentCount + delta;

    if (newCount < 0) return;

    const newSelection = { ...selectedExtras };
    if (newCount === 0) {
      delete newSelection[extraId];
    } else {
      newSelection[extraId] = newCount;
    }
    setSelectedExtras(newSelection);
  };

  const buildRollsSummary = (): string => {
    const parts = Object.entries(selectedRolls)
      .map(([rollId, count]: [string, number]) => {
        const roll = availableRolls.find(r => String(r.id) === String(rollId));
        return roll ? `${count}x ${roll.name}` : '';
      })
      .filter(Boolean);
    return parts.join(', ');
  };

  const handleAddComboToCart = () => {
    if (!selectedSize) return;

    // 1) Add the combo base + chosen rolls as a single line item
    const rollsSummary = buildRollsSummary();
    addItem({
      productId: `custom-combo-${selectedSize.pieces}`,
      name: `Combo personalizado ${selectedSize.pieces} piezas`,
      price: selectedSize.basePrice,
      details: rollsSummary ? `Rolls: ${rollsSummary}` : undefined,
    });

    // 2) Add each selected extra as its own cart line
    Object.entries(selectedExtras).forEach(([extraId, count]: [string, number]) => {
      const extra = availableExtras.find(e => String(e.id) === String(extraId));
      if (!extra) return;
      addItem({
        productId: `extra-${extra.id}`,
        name: extra.name,
        price: extra.price,
        quantity: count,
      });
    });

    openDrawer();
    onAdded?.();
  };

  // Render Functions
  const renderStep1 = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      {COMBO_SIZES.map(size => (
        <button
          key={size.id}
          onClick={() => handleSelectSize(size)}
          className="group bg-gray-800 border-2 border-gray-700 hover:border-kayso-orange rounded-2xl p-8 transition-all text-left relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-gray-700 text-gray-400 text-xs font-bold px-3 py-1 rounded-bl-xl group-hover:bg-kayso-orange group-hover:text-white transition-colors">
            {size.slots} Gustos
          </div>
          <h3 className="text-3xl font-bold font-display text-white mb-2">{size.pieces} <span className="text-xl font-normal font-sans text-gray-400">Piezas</span></h3>
          <p className="text-kayso-orange font-bold font-display text-2xl mb-4">${size.basePrice.toLocaleString()}</p>
          <p className="text-gray-400 text-sm">Ideal para {Math.round((size.pieces as number) / 15)} personas aprox.</p>
        </button>
      ))}
    </div>
  );

  const renderStep2 = () => (
    <div className="animate-fade-in">
      <div className="bg-gray-800/80 border border-kayso-orange/30 rounded-xl p-3 md:p-4 mb-6 flex justify-between items-center sticky top-2 z-30 backdrop-blur-md shadow-lg">
        <div>
          <p className="text-gray-400 text-[10px] md:text-sm uppercase font-bold tracking-wider">Elegí tus rolls</p>
          <p className="text-white text-sm md:text-base font-bold font-display">
            {totalRollsSelected} / {selectedSize?.slots} Seleccionados
          </p>
        </div>
        <div className="h-1.5 md:h-2 w-24 md:w-32 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${isSelectionComplete ? 'bg-green-500' : 'bg-kayso-orange'}`}
            style={{ width: `${selectedSize ? (totalRollsSelected / selectedSize.slots) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableRolls.map(roll => {
           const count = selectedRolls[roll.id] || 0;
           const isMaxed = totalRollsSelected >= (selectedSize?.slots || 0);

           return (
            <div key={roll.id} className={`bg-gray-800 rounded-xl p-4 border ${count > 0 ? 'border-kayso-orange' : 'border-gray-700'} flex gap-4 transition-all`}>
              <img 
                src={roll.image} 
                alt={roll.name} 
                loading="lazy" 
                decoding="async"
                className="w-20 h-20 rounded-lg object-cover bg-gray-700" 
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold font-display text-white text-sm">{roll.name}</h4>
                    {roll.isPremium && <span className="text-xs text-yellow-500 font-bold border border-yellow-500/30 px-1 rounded">+${roll.extraPrice}</span>}
                  </div>
                  
                  {/* Badge for 5 units */}
                  <div className="mt-1 mb-1">
                    <span className="bg-gray-700/50 text-gray-300 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-gray-600/50">
                      5 Unidades
                    </span>
                  </div>

                  <p className="text-gray-400 text-xs line-clamp-2">{roll.description}</p>
                </div>
                
                <div className="flex items-center justify-end gap-3 mt-2">
                  {count > 0 && (
                    <>
                       <button onClick={() => handleUpdateRoll(roll.id, -1)} className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600"><Minus size={14} /></button>
                       <span className="font-bold text-white">{count}</span>
                    </>
                  )}
                  <button 
                    onClick={() => handleUpdateRoll(roll.id, 1)} 
                    disabled={isMaxed}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isMaxed ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-kayso-orange text-white hover:bg-orange-600'}`}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Spacer for bottom bar */}
      <div className="h-24"></div>
    </div>
  );

  const renderStep3 = () => (
    <div className="animate-fade-in">
       <div className="max-w-2xl mx-auto">
          
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star size={24} className="text-kayso-orange" fill="currentColor" />
              <h3 className="text-2xl font-bold font-display text-white">Adicionales</h3>
            </div>
            <p className="text-gray-400">Completá tu pedido con estos extras.</p>
          </div>

          <div className="space-y-4">
            {availableExtras.map(item => (
              <div key={item.id} className="flex justify-between items-center bg-gray-800 p-5 rounded-xl border border-gray-700 hover:border-kayso-orange/50 transition-colors">
                <div className="flex items-center gap-4">
                  {item.name.toLowerCase().includes('salsa') ? <Heart className="text-red-500" size={20} /> : <Star className="text-yellow-500" size={20} />}
                  <div>
                    <p className="text-white font-bold">{item.name}</p>
                    <p className="text-kayso-orange text-sm font-bold">+${item.price}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                    {selectedExtras[item.id] > 0 && (
                      <button onClick={() => handleUpdateExtra(item.id, -1)} className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600"><Minus size={14} /></button>
                    )}
                    <span className={`font-bold w-6 text-center ${selectedExtras[item.id] > 0 ? 'text-white' : 'text-gray-600'}`}>{selectedExtras[item.id] || 0}</span>
                    <button onClick={() => handleUpdateExtra(item.id, 1)} className="w-8 h-8 rounded-full bg-kayso-orange text-white flex items-center justify-center hover:bg-orange-600"><Plus size={14} /></button>
                </div>
              </div>
            ))}
          </div>
          
           {/* Spacer for bottom bar */}
           <div className="h-24"></div>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-kayso-dark pt-8 pb-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
            <button 
              onClick={() => {
                if(step === 1) return; 
                setStep(step === 3 ? 2 : 1);
              }}
              className={`flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors ${step === 1 ? 'invisible' : ''}`}
            >
              <ArrowLeft size={16} /> Volver
            </button>
            <h1 className="text-4xl font-bold font-display text-white mb-2">
              Armá tu <span className="text-kayso-orange">Combo</span>
            </h1>
            <p className="text-gray-400">Diseñá tu tabla perfecta en 3 pasos.</p>
        </div>

        {/* Steps Progress */}
        <div className="flex items-center mb-8 md:mb-12">
          {[1, 2, 3].map((s) => (
             <div key={s} className="flex items-center flex-1 last:flex-none">
               <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-bold font-display border-2 transition-all ${
                 step >= s 
                  ? 'bg-kayso-orange border-kayso-orange text-white' 
                  : 'bg-transparent border-gray-700 text-gray-700'
               }`}>
                 {step > s ? <Check size={16} /> : s}
               </div>
               {s < 3 && (
                 <div className={`flex-1 h-0.5 md:h-1 mx-2 md:mx-4 rounded-full transition-all ${
                    step > s ? 'bg-kayso-orange' : 'bg-gray-800'
                 }`} />
               )}
             </div>
          ))}
        </div>

        {/* Content */}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

      </div>

      {/* Bottom Bar / Footer Summary */}
      {step > 1 && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 z-40 shadow-2xl pb-safe">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
              <div>
                <p className="text-gray-400 text-xs uppercase">Total Estimado</p>
                <p className="text-3xl font-bold font-display text-white">${totalPrice.toLocaleString()}</p>
              </div>
              <div className="text-right sm:text-left">
                 <p className="text-gray-400 text-xs uppercase">Detalle</p>
                 <p className="text-sm text-white">{selectedSize?.pieces} Piezas + {(Object.values(selectedExtras) as number[]).reduce((a, b)=>a+b,0)} Extras</p>
              </div>
            </div>
            
            {/* Action Buttons in Footer */}
            <div className="w-full sm:w-auto">
                {step === 2 && isSelectionComplete && (
                   <button
                     onClick={() => setStep(3)}
                     className="w-full sm:w-auto bg-kayso-orange hover:bg-red-600 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg animate-pulse"
                   >
                     Siguiente Paso <ChevronRight size={20} />
                   </button>
                )}

                {step === 3 && (
                  <button
                    onClick={handleAddComboToCart}
                    className="w-full sm:w-auto bg-kayso-orange hover:bg-red-700 text-white px-8 py-3 rounded-xl font-black font-display flex items-center justify-center gap-3 transition-transform hover:scale-105 shadow-lg shadow-kayso-orange/25"
                  >
                    <ShoppingCart size={18} className="flex-shrink-0" />
                    <span className="text-sm">Agregar al pedido</span>
                  </button>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
