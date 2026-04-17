import React, { useEffect } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface CartDrawerProps {
  onCheckout: () => void;
  onContinueShopping?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout, onContinueShopping }) => {
  const { items, subtotal, drawerOpen, closeDrawer, removeItem, updateQuantity } = useCart();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  // ESC to close
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen, closeDrawer]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeDrawer}
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#0a0a0a] border-l border-gray-800 z-[61] shadow-2xl transition-transform duration-300 flex flex-col ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Tu pedido"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-kayso-orange/15 border border-kayso-orange/30 flex items-center justify-center">
              <ShoppingBag size={18} className="text-kayso-orange" />
            </div>
            <div>
              <h2 className="text-white font-black font-display text-lg leading-none">Tu Pedido</h2>
              <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-1">
                {items.length} {items.length === 1 ? 'producto' : 'productos'}
              </p>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            className="w-9 h-9 rounded-full bg-gray-900 hover:bg-gray-800 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Empty state */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center mb-5">
              <ShoppingBag size={30} className="text-gray-700" />
            </div>
            <h3 className="text-white font-black font-display text-xl mb-2">Tu pedido está vacío</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Agregá productos del menú para empezar a armar tu pedido.
            </p>
            <button
              onClick={() => {
                closeDrawer();
                onContinueShopping?.();
              }}
              className="bg-kayso-orange hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-kayso-orange/20"
            >
              Ver menú
            </button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.map(item => (
                <div
                  key={item.id}
                  className="bg-[#111] border border-gray-800 rounded-xl p-3 flex gap-3"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-gray-900"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
                      <ShoppingBag size={22} className="text-gray-700" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-white font-bold text-sm leading-tight line-clamp-2">{item.name}</h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-600 hover:text-red-500 transition-colors flex-shrink-0"
                        aria-label={`Eliminar ${item.name}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {item.details && (
                      <p className="text-gray-600 text-[11px] mt-0.5 line-clamp-2">{item.details}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
                          aria-label="Disminuir cantidad"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-white font-bold text-sm w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-kayso-orange/15 hover:bg-kayso-orange border border-kayso-orange/30 hover:border-kayso-orange text-kayso-orange hover:text-white flex items-center justify-center transition-all"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <p className="text-white font-black font-display">
                        ${(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-800 px-5 py-4 bg-black/40 backdrop-blur-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500 text-xs uppercase tracking-widest font-bold">Subtotal</span>
                <span className="text-white font-black font-display text-2xl">${subtotal.toLocaleString()}</span>
              </div>
              <p className="text-gray-600 text-[11px] mb-3 leading-relaxed">
                Envío y forma de pago se coordinan en el siguiente paso.
              </p>
              <button
                onClick={() => {
                  closeDrawer();
                  onCheckout();
                }}
                className="w-full bg-kayso-orange hover:bg-red-700 text-white py-3.5 rounded-xl font-black font-display text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-kayso-orange/25"
              >
                Finalizar pedido <ArrowRight size={16} />
              </button>
              <button
                onClick={() => {
                  closeDrawer();
                  onContinueShopping?.();
                }}
                className="w-full mt-2 text-gray-500 hover:text-gray-300 text-xs py-2 transition-colors"
              >
                Seguir agregando productos
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
};
