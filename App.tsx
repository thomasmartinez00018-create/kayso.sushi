
import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MenuPreview } from './components/MenuPreview';
import { Locations } from './components/Locations';
import { Footer } from './components/Footer';
import { HowToOrder } from './components/HowToOrder';
import { BlogSection } from './components/BlogSection';
import { ComboBuilder } from './components/ComboBuilder';
import { BlogPostView } from './components/BlogPostView';
import { Testimonials } from './components/Testimonials';
import { SushiAssistant } from './components/SushiAssistant';
import { ViewState, MenuItem, BlogPost, Testimonial } from './types';
import { fetchMenuFromSheet, fetchBlogFromSheet, fetchReviewsFromSheet } from './services/sheetService';
import { MENU_ITEMS, BLOG_POSTS, TESTIMONIALS } from './constants';

function App() {
  const [view, setView] = useState<ViewState>('HOME');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(BLOG_POSTS);
  const [reviews, setReviews] = useState<Testimonial[]>(TESTIMONIALS);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  useEffect(() => {
    const loadData = async () => {
        try {
            const [menuData, blogData, reviewsData] = await Promise.all([
                fetchMenuFromSheet(),
                fetchBlogFromSheet(),
                fetchReviewsFromSheet()
            ]);
            setMenuItems(menuData);
            setBlogPosts(blogData);
            setReviews(reviewsData);
        } catch (e) {
            console.error("Using fallback data", e);
        } finally {
            setLoading(false);
        }
    };
    loadData();
  }, []);

  const handleOpenPost = (post: BlogPost) => {
    setSelectedPost(post);
    setView('BLOG_POST');
  };

  return (
    <div className="min-h-screen bg-kayso-dark flex flex-col font-sans selection:bg-kayso-orange selection:text-white">
      <Navbar currentView={view} setView={setView} />
      
      <main className="flex-grow">
        {view === 'HOME' && (
          <>
            <Hero onViewMenu={() => setView('MENU')} onOpenBuilder={() => setView('BUILDER')} />
            <MenuPreview items={menuItems} onOpenBuilder={() => setView('BUILDER')} loading={loading} />
            <HowToOrder />
            <Testimonials items={reviews} />
            <BlogSection posts={blogPosts} onPostClick={handleOpenPost} />
          </>
        )}

        {view === 'MENU' && (
          <div className="pt-10 pb-20 animate-fade-in">
            <div className="text-center mb-10 px-4">
              <h1 className="text-5xl font-black text-white mb-2 font-display uppercase tracking-tighter">Nuestro Menú</h1>
              <p className="text-gray-400 font-light text-xl">Calidad premium en cada pieza</p>
            </div>
            <MenuPreview fullMenu={true} items={menuItems} onOpenBuilder={() => setView('BUILDER')} loading={loading} />
          </div>
        )}

        {view === 'LOCATIONS' && (
          <div className="pt-10 animate-fade-in">
             <Locations />
          </div>
        )}

        {view === 'BLOG' && (
          <div className="pt-10 pb-20 animate-fade-in">
             <div className="text-center mb-10 px-4">
              <h1 className="text-5xl font-black text-white mb-2 font-display uppercase tracking-tighter">Blog Kayso</h1>
              <p className="text-gray-400 font-light text-xl">Noticias, novedades y cultura sushi</p>
            </div>
            <BlogSection posts={blogPosts} onPostClick={handleOpenPost} />
          </div>
        )}

        {view === 'BLOG_POST' && selectedPost && (
          <BlogPostView post={selectedPost} onBack={() => setView('BLOG')} />
        )}

        {view === 'BUILDER' && (
          <ComboBuilder menuItems={menuItems} />
        )}
      </main>

      <SushiAssistant menuItems={menuItems} />
      <Footer />
    </div>
  );
}

export default App;
