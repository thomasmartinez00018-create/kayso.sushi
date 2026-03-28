
import React from 'react';
import { MessageCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface RedirectScreenProps {
  whatsappUrl: string;
}

export const RedirectScreen: React.FC<RedirectScreenProps> = ({ whatsappUrl }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center py-20">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 p-8 md:p-12 rounded-3xl max-w-lg w-full shadow-2xl"
      >
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"
            />
            <div className="bg-green-500 text-white p-5 rounded-full relative z-10">
              <CheckCircle2 size={48} />
            </div>
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 font-display uppercase tracking-tight">
          ¡Pedido <span className="text-kayso-orange">Confirmado</span>!
        </h2>
        
        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
          Estamos intentando abrir WhatsApp para que nos envíes tu pedido.
        </p>

        <div className="space-y-6">
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-full bg-green-600 hover:bg-green-500 text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-green-600/20 group"
          >
            <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
            IR HACIA WHATSAPP
            <ArrowRight size={24} />
          </motion.a>

          <p className="text-gray-500 text-sm font-medium animate-pulse">
            Por favor, toca el botón de arriba para finalizar
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700/50">
          <p className="text-gray-400 text-sm">
            Si ya enviaste el mensaje, podés cerrar esta pestaña.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
