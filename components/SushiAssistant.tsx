
import React, { useState, useRef, useEffect } from 'react';
import { getSushiRecommendation } from '../services/geminiService';
import { MessageSquare, Send, Loader2, Sparkles, X } from 'lucide-react';
import { MenuItem } from '../types';

interface SushiAssistantProps {
    menuItems: MenuItem[];
}

export const SushiAssistant: React.FC<SushiAssistantProps> = ({ menuItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [response, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    const userInput = input;
    setInput('');
    
    const result = await getSushiRecommendation(userInput, menuItems);
    
    setResponse(result);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-gray-900 border border-kayso-orange/30 rounded-2xl shadow-2xl mb-4 w-80 md:w-96 overflow-hidden animate-float">
          {/* Header */}
          <div className="bg-gradient-to-r from-kayso-orange to-red-700 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    <Sparkles size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Kayso Sommelier IA</h3>
                  <p className="text-[10px] text-white/80 uppercase font-bold">Online ahora</p>
                </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div ref={scrollRef} className="p-4 max-h-80 overflow-y-auto bg-kayso-dark/50 scrollbar-hide">
            {!response && !isLoading && (
               <div className="bg-gray-800 rounded-xl p-3 border border-gray-700 mb-2">
                 <p className="text-gray-200 text-sm">
                   ¡Hola! 👋 Soy tu guía personal de Kayso. ¿No sabés qué pedir? Decime qué tenés ganas (algo fresco, picante, veggie...) y te armo el pedido ideal.
                 </p>
               </div>
            )}

            {isLoading && (
              <div className="flex items-center gap-2 text-kayso-orange py-4">
                <Loader2 className="animate-spin" size={20} />
                <span className="text-xs font-bold uppercase">Pensando el maridaje...</span>
              </div>
            )}

            {response && (
              <div className="animate-fade-in">
                 <div className="bg-kayso-orange/10 border border-kayso-orange/20 p-4 rounded-xl text-white text-sm leading-relaxed shadow-inner">
                   {response}
                 </div>
                 <button 
                  onClick={() => setResponse(null)}
                  className="mt-3 text-[10px] text-gray-500 hover:text-white uppercase font-bold tracking-widest transition-colors"
                 >
                   Hacer otra pregunta
                 </button>
              </div>
            )}
          </div>

          {/* Footer Input */}
          <form onSubmit={handleSubmit} className="p-4 bg-gray-900 border-t border-gray-800">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ej: Tengo ganas de algo con mango..."
                className="w-full bg-gray-800 text-white rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-kayso-orange border border-gray-700 placeholder:text-gray-500"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-kayso-orange text-white p-2 rounded-lg transition-all disabled:opacity-50 disabled:grayscale"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-gradient-to-br from-kayso-orange to-red-700 text-white p-4 rounded-full shadow-2xl shadow-kayso-orange/40 transition-all transform hover:scale-110 flex items-center gap-3 font-bold border-2 border-white/10 ${isOpen ? 'rotate-90' : ''}`}
      >
        {isOpen ? <X size={24} /> : (
          <>
            <MessageSquare size={24} />
            <span className="hidden md:inline pr-1">¿Qué pido hoy?</span>
          </>
        )}
      </button>
    </div>
  );
};
