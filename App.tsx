
import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MenuPreview } from './components/MenuPreview';
import { Locations } from './components/Locations';
import { Footer } from './components/Footer';
import { HowToOrder } from './components/HowToOrder';
import { ComboBuilder } from './components/ComboBuilder';
import { Testimonials } from './components/Testimonials';
import { RedirectScreen } from './components/RedirectScreen';
import { ViewState, MenuItem, Testimonial } from './types';
import { fetchMenuFromSheet, fetchReviewsFromSheet } from './services/sheetService';
import { MENU_ITEMS, TESTIMONIALS } from './constants';

function App() {
  const [view, setView] = useState<ViewState>('HOME');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [reviews, setReviews] = useState<Testimonial[]>(TESTIMONIALS);
  const [loading, setLoading] = useState(true);
  const [redirectUrl, setRedirectUrl] = useState<string>('');

  const handleRedirect = (url: string) => {
    setRedirectUrl(url);
    setView('REDIRECT');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  useEffect(() => {
    const loadData = async () => {
        try {
            const [menuData, reviewsData] = await Promise.all([
                fetchMenuFromSheet(),
                fetchReviewsFromSheet()
            ]);
            setMenuItems(menuData);
            setReviews(reviewsData);
        } catch (e) {
            console.error("Using fallback data", e);
        } finally {
            setLoading(false);
        }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-kayso-dark flex flex-col font-sans selection:bg-kayso-orange selection:text-white">
      <Navbar currentView={view} setView={setView} />
      
      <main className="flex-grow">
        {view === 'HOME' && (
          <>
            <Hero onViewMenu={() => setView('MENU')} onOpenBuilder={() => setView('BUILDER')} onRedirect={handleRedirect} />
            <MenuPreview items={menuItems} onOpenBuilder={() => setView('BUILDER')} loading={loading} onRedirect={handleRedirect} />
            <HowToOrder />
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
          <ComboBuilder menuItems={menuItems} onComplete={handleRedirect} />
        )}

        {view === 'REDIRECT' && (
          <RedirectScreen whatsappUrl={redirectUrl} />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
