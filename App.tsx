
import { useState, useEffect, lazy, Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MenuPreview } from './components/MenuPreview';
import { Locations } from './components/Locations';
import { Footer } from './components/Footer';
import { HowToOrder } from './components/HowToOrder';

import { Testimonials } from './components/Testimonials';

import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { CartDrawer } from './components/CartDrawer';
import { CartToast } from './components/CartToast';


import { CartProvider } from './contexts/CartContext';

// Estas pantallas no se ven al entrar: se bajan cuando se abren. Antes viajaban en el
// mismo archivo de 383 KB que bloqueaba la primera pintura.
const ComboBuilder = lazy(() => import('./components/ComboBuilder').then(m => ({ default: m.ComboBuilder })));
const Checkout = lazy(() => import('./components/Checkout').then(m => ({ default: m.Checkout })));
const RedirectScreen = lazy(() => import('./components/RedirectScreen').then(m => ({ default: m.RedirectScreen })));
const ArmaTuComboLanding = lazy(() => import('./components/ArmaTuComboLanding').then(m => ({ default: m.ArmaTuComboLanding })));

const Cargando = () => (
  <div className="min-h-[60vh] flex items-center justify-center text-gray-400 text-sm" role="status" aria-live="polite">
    Cargando…
  </div>
);
import { ViewState, MenuItem, Testimonial } from './types';
import { fetchMenuFromSheet, fetchReviewsFromSheet } from './services/sheetService';
import { MENU_ITEMS, TESTIMONIALS } from './constants';

const getInitialView = (): ViewState => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname.replace(/\/+$/, '').toLowerCase();
    if (path === '/armatucombo') return 'ARMATUCOMBO';
  }
  return 'HOME';
};

function AppInner() {
  const [view, setView] = useState<ViewState>(getInitialView);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [reviews, setReviews] = useState<Testimonial[]>(TESTIMONIALS);
  // El menú de respaldo ya es el de la planilla (snapshot), así que se puede mostrar sin esperar.
  const [loading, setLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string>('');

  const handleRedirect = (url: string) => {
    setRedirectUrl(url);
    setView('REDIRECT');
  };

  const goToCheckout = () => setView('CHECKOUT');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [menuData, reviewsData] = await Promise.all([
          fetchMenuFromSheet(),
          fetchReviewsFromSheet(),
        ]);
        setMenuItems(menuData);
        setReviews(reviewsData);
      } catch (e) {
        console.error('Using fallback data', e);
      } finally {
        setLoading(false);
      }
    };
    loadData();

    // Cuando el navegador queda libre, precargamos el armador y el checkout para que
    // abrirlos sea instantáneo sin costarle nada a la primera pintura.
    const precargar = () => {
      import('./components/ComboBuilder');
      import('./components/Checkout');
      import('./components/RedirectScreen');
    };
    const w = window as any;
    const id = w.requestIdleCallback ? w.requestIdleCallback(precargar, { timeout: 4000 }) : window.setTimeout(precargar, 2500);
    return () => { if (w.cancelIdleCallback) w.cancelIdleCallback(id); else clearTimeout(id); };
  }, []);

  const showCartUI = view !== 'REDIRECT';

  return (
    <div className="min-h-screen bg-kayso-dark flex flex-col font-sans selection:bg-kayso-orange selection:text-white">
      {view !== 'ARMATUCOMBO' && (
        <Navbar currentView={view} setView={setView} onRedirect={handleRedirect} />
      )}

      <main className="flex-grow">
        <Suspense fallback={<Cargando />}>
        {view === 'ARMATUCOMBO' && (
          <ArmaTuComboLanding menuItems={menuItems} onCheckout={goToCheckout} />
        )}

        {view === 'HOME' && (
          <>
            <Hero onViewMenu={() => setView('MENU')} onOpenBuilder={() => setView('BUILDER')} onRedirect={handleRedirect} />
            <MenuPreview items={menuItems} onOpenBuilder={() => setView('BUILDER')} loading={loading} onRedirect={handleRedirect} />
            <HowToOrder onRedirect={handleRedirect} />
            <Locations />
            <Testimonials items={reviews} />
          </>
        )}

        {view === 'MENU' && (
          <div className="pt-10 pb-20 animate-fade-in">
            <div className="text-center mb-10 px-4">
              <h1 className="text-5xl font-black text-white mb-2 font-display uppercase tracking-tighter">Nuestro Menú</h1>
              <p className="text-gray-400 font-light text-xl">Calidad premium en cada pieza</p>
            </div>
            <MenuPreview fullMenu={true} items={menuItems} onOpenBuilder={() => setView('BUILDER')} loading={loading} onRedirect={handleRedirect} />
          </div>
        )}

        {view === 'LOCATIONS' && (
          <div className="pt-10 animate-fade-in">
            <Locations />
          </div>
        )}

        {view === 'BUILDER' && (
          <ComboBuilder menuItems={menuItems} onAdded={() => setView('HOME')} />
        )}

        {view === 'CHECKOUT' && (
          <Checkout onBack={() => setView('HOME')} onComplete={handleRedirect} />
        )}

        {view === 'REDIRECT' && (
          <RedirectScreen whatsappUrl={redirectUrl} />
        )}
        </Suspense>
      </main>

      {view !== 'ARMATUCOMBO' && <Footer />}

      {/* WhatsApp floating CTA — hidden in builder/redirect/checkout/landing */}
      {view !== 'BUILDER' && view !== 'REDIRECT' && view !== 'CHECKOUT' && view !== 'ARMATUCOMBO' && (
        <FloatingWhatsApp onRedirect={handleRedirect} />
      )}

      {/* Cart UI — drawer + toast. Floating cart is unified into FloatingWhatsApp */}
      {showCartUI && (
        <>
          <CartDrawer
            onCheckout={goToCheckout}
            onContinueShopping={() => setView('MENU')}
          />
          <CartToast />
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <AppInner />
    </CartProvider>
  );
}

export default App;
