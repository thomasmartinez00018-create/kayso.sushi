import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export const CartToast: React.FC = () => {
  const { toast, openDrawer } = useCart();

  return (
    <div
      className={`fixed top-24 left-1/2 -translate-x-1/2 z-[70] transition-all duration-300 ${
        toast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
    >
      {toast && (
        <button
          onClick={openDrawer}
          className="flex items-center gap-2.5 bg-[#0a0a0a] border border-green-500/40 text-white px-4 py-3 rounded-xl shadow-2xl"
          style={{ boxShadow: '0 8px 32px rgba(34,197,94,0.25)' }}
        >
          <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
          <span className="text-sm font-bold">{toast}</span>
          <span className="text-kayso-orange text-[10px] font-black uppercase tracking-widest ml-2">Ver pedido →</span>
        </button>
      )}
    </div>
  );
};
