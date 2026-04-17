import React, { useState, useMemo } from 'react';
import { ArrowLeft, MapPin, Truck, Store, Banknote, CreditCard, Smartphone, FileText, User, Check, ShoppingCart, AlertCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { DeliveryMode, PaymentMethod, Branch, CheckoutData } from '../types';
import { trackAndRedirectFromCheckout } from '../services/trackingService';

interface CheckoutProps {
  onBack: () => void;
  onComplete: (url: string) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ onBack, onComplete }) => {
  const { items, subtotal, clear } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [branch, setBranch] = useState<Branch | null>(null);
  const [mode, setMode] = useState<DeliveryMode | null>(null);
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState<PaymentMethod | null>(null);
  const [notes, setNotes] = useState('');

  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const errors = useMemo(() => {
    const e: { [k: string]: string } = {};
    if (!branch) e.branch = 'Elegí una sucursal.';
    if (!mode) e.mode = 'Indicá si es delivery o retiro.';
    if (mode === 'delivery' && address.trim().length < 6) e.address = 'Ingresá una dirección válida.';
    if (!payment) e.payment = 'Elegí la forma de pago.';
    return e;
  }, [branch, mode, address, payment]);

  const canSubmit = Object.keys(errors).length === 0 && items.length > 0 && !submitting;

  const handleSubmit = () => {
    setAttemptedSubmit(true);
    if (!canSubmit) return;
    setSubmitting(true);

    const data: CheckoutData = {
      branch: branch as Branch,
      mode: mode as DeliveryMode,
      address: mode === 'delivery' ? address.trim() : undefined,
      payment: payment as PaymentMethod,
      notes: notes.trim() || undefined,
      customerName: customerName.trim() || undefined,
    };

    const url = trackAndRedirectFromCheckout(items, data, subtotal);
    clear();
    onComplete(url);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-kayso-dark pt-10 pb-20 px-4 flex flex-col items-center justify-center">
        <div className="max-w-md w-full text-center">
          <ShoppingCart size={48} className="text-gray-700 mx-auto mb-4" />
          <h2 className="text-white font-black font-display text-2xl mb-2">Tu pedido está vacío</h2>
          <p className="text-gray-500 text-sm mb-6">Agregá productos desde el menú antes de continuar.</p>
          <button
            onClick={onBack}
            className="bg-kayso-orange hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-sm"
          >
            Volver al menú
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kayso-dark pt-6 pb-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-5 transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Volver
        </button>

        <div className="mb-8">
          <p className="text-kayso-orange text-[10px] font-black uppercase tracking-[0.3em] mb-2">— Finalizar pedido —</p>
          <h1 className="text-4xl font-black font-display text-white mb-2">
            Último <span className="text-kayso-orange">paso</span>
          </h1>
          <p className="text-gray-400 text-sm">Completá los datos para que preparemos tu pedido sin demoras.</p>
        </div>

        {/* Order Summary */}
        <section className="bg-[#0c0c0c] border border-gray-800 rounded-2xl p-5 mb-6">
          <h2 className="text-white font-black font-display text-lg mb-4 flex items-center gap-2">
            <ShoppingCart size={18} className="text-kayso-orange" /> Tu pedido
          </h2>
          <div className="space-y-2 mb-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-start gap-3 text-sm">
                <span className="text-gray-300 flex-1">
                  <span className="text-white font-bold">{item.quantity}x</span> {item.name}
                  {item.details && <span className="block text-gray-600 text-[11px] mt-0.5">{item.details}</span>}
                </span>
                <span className="text-white font-black font-display whitespace-nowrap">
                  ${(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-3 flex justify-between items-center">
            <span className="text-gray-500 text-xs uppercase tracking-widest font-bold">Total</span>
            <span className="text-kayso-orange font-black font-display text-2xl">${subtotal.toLocaleString()}</span>
          </div>
        </section>

        {/* Customer Name */}
        <section className="mb-6">
          <label className="block text-white font-bold text-sm mb-2 flex items-center gap-2">
            <User size={15} className="text-kayso-orange" /> Tu nombre <span className="text-gray-600 text-xs font-normal">(opcional)</span>
          </label>
          <input
            type="text"
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            placeholder="Para saludarte al confirmar"
            className="w-full bg-[#0c0c0c] border border-gray-800 focus:border-kayso-orange text-white rounded-xl px-4 py-3 text-sm outline-none transition-colors placeholder:text-gray-700"
          />
        </section>

        {/* Branch */}
        <section className="mb-6">
          <label className="block text-white font-bold text-sm mb-3 flex items-center gap-2">
            <MapPin size={15} className="text-kayso-orange" /> Sucursal
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <BranchOption selected={branch === 'gelly'} onClick={() => setBranch('gelly')} title="Gelly y Obes" subtitle="San Miguel" />
            <BranchOption selected={branch === 'peron'} onClick={() => setBranch('peron')} title="Pte. Perón" subtitle="San Miguel" />
          </div>
          {attemptedSubmit && errors.branch && <FieldError message={errors.branch} />}
        </section>

        {/* Delivery mode */}
        <section className="mb-6">
          <label className="block text-white font-bold text-sm mb-3">Modalidad</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ModeOption
              selected={mode === 'retiro'}
              onClick={() => setMode('retiro')}
              icon={<Store size={20} />}
              title="Retiro en sucursal"
              subtitle="Sin costo adicional"
            />
            <ModeOption
              selected={mode === 'delivery'}
              onClick={() => setMode('delivery')}
              icon={<Truck size={20} />}
              title="Delivery"
              subtitle="A tu domicilio"
            />
          </div>
          {attemptedSubmit && errors.mode && <FieldError message={errors.mode} />}

          {mode === 'delivery' && (
            <div className="mt-4 animate-fade-in">
              <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">
                Dirección completa
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Calle, altura, piso/depto, entre calles"
                className="w-full bg-[#0c0c0c] border border-gray-800 focus:border-kayso-orange text-white rounded-xl px-4 py-3 text-sm outline-none transition-colors placeholder:text-gray-700"
              />
              {attemptedSubmit && errors.address && <FieldError message={errors.address} />}
            </div>
          )}
        </section>

        {/* Payment */}
        <section className="mb-6">
          <label className="block text-white font-bold text-sm mb-3">Forma de pago</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <PaymentOption selected={payment === 'efectivo'} onClick={() => setPayment('efectivo')} icon={<Banknote size={20} />} title="Efectivo" />
            <PaymentOption selected={payment === 'transferencia'} onClick={() => setPayment('transferencia')} icon={<CreditCard size={20} />} title="Transferencia" />
            <PaymentOption selected={payment === 'mercadopago'} onClick={() => setPayment('mercadopago')} icon={<Smartphone size={20} />} title="Mercado Pago" />
          </div>
          {attemptedSubmit && errors.payment && <FieldError message={errors.payment} />}
        </section>

        {/* Notes */}
        <section className="mb-6">
          <label className="block text-white font-bold text-sm mb-2 flex items-center gap-2">
            <FileText size={15} className="text-kayso-orange" /> Notas adicionales <span className="text-gray-600 text-xs font-normal">(opcional)</span>
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Alergias, preferencias, algún detalle para el pedido..."
            rows={3}
            className="w-full bg-[#0c0c0c] border border-gray-800 focus:border-kayso-orange text-white rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none placeholder:text-gray-700"
          />
        </section>

        {/* Submit button — sticky */}
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-gray-800 p-4 z-40 pb-safe">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <div className="flex-1 w-full sm:w-auto">
              <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Total</p>
              <p className="text-white font-black font-display text-2xl">${subtotal.toLocaleString()}</p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={items.length === 0}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black font-display text-sm transition-all shadow-lg ${
                canSubmit
                  ? 'bg-[#25D366] hover:bg-[#1ebe5d] text-white shadow-[#25D366]/30 hover:scale-105'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Check size={18} /> Enviar pedido por WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BranchOption: React.FC<{ selected: boolean; onClick: () => void; title: string; subtitle: string }> = ({ selected, onClick, title, subtitle }) => (
  <button
    onClick={onClick}
    className={`relative text-left p-4 rounded-xl border-2 transition-all ${
      selected
        ? 'border-kayso-orange bg-kayso-orange/10'
        : 'border-gray-800 bg-[#0c0c0c] hover:border-gray-600'
    }`}
  >
    {selected && (
      <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-kayso-orange flex items-center justify-center">
        <Check size={12} className="text-white" />
      </span>
    )}
    <div className="flex items-center gap-2 mb-1">
      <MapPin size={16} className={selected ? 'text-kayso-orange' : 'text-gray-500'} />
      <h3 className="text-white font-black font-display text-base">{title}</h3>
    </div>
    <p className="text-gray-500 text-xs">{subtitle}</p>
  </button>
);

const ModeOption: React.FC<{ selected: boolean; onClick: () => void; icon: React.ReactNode; title: string; subtitle: string }> = ({ selected, onClick, icon, title, subtitle }) => (
  <button
    onClick={onClick}
    className={`relative text-left p-4 rounded-xl border-2 transition-all ${
      selected
        ? 'border-kayso-orange bg-kayso-orange/10'
        : 'border-gray-800 bg-[#0c0c0c] hover:border-gray-600'
    }`}
  >
    {selected && (
      <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-kayso-orange flex items-center justify-center">
        <Check size={12} className="text-white" />
      </span>
    )}
    <div className={`mb-2 ${selected ? 'text-kayso-orange' : 'text-gray-500'}`}>{icon}</div>
    <h3 className="text-white font-black font-display text-base mb-0.5">{title}</h3>
    <p className="text-gray-500 text-xs">{subtitle}</p>
  </button>
);

const PaymentOption: React.FC<{ selected: boolean; onClick: () => void; icon: React.ReactNode; title: string }> = ({ selected, onClick, icon, title }) => (
  <button
    onClick={onClick}
    className={`relative p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-center ${
      selected
        ? 'border-kayso-orange bg-kayso-orange/10'
        : 'border-gray-800 bg-[#0c0c0c] hover:border-gray-600'
    }`}
  >
    {selected && (
      <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-kayso-orange flex items-center justify-center">
        <Check size={12} className="text-white" />
      </span>
    )}
    <div className={selected ? 'text-kayso-orange' : 'text-gray-500'}>{icon}</div>
    <h3 className="text-white font-bold text-sm">{title}</h3>
  </button>
);

const FieldError: React.FC<{ message: string }> = ({ message }) => (
  <p className="flex items-center gap-1.5 text-red-500 text-xs mt-2 animate-fade-in">
    <AlertCircle size={12} /> {message}
  </p>
);
