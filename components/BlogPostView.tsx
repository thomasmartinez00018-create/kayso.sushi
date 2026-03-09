
import React, { useEffect } from 'react';
import { BlogPost } from '../types';
import { ArrowLeft, Calendar } from 'lucide-react';

interface BlogPostViewProps {
  post: BlogPost;
  onBack: () => void;
}

export const BlogPostView: React.FC<BlogPostViewProps> = ({ post, onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-kayso-dark min-h-screen py-20 animate-fade-in">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Volver al Blog
        </button>

        <article>
           {/* Header */}
           <div className="mb-8">
              <span className="bg-kayso-orange/10 text-kayso-orange px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-kayso-orange/20 mb-4 inline-flex items-center gap-2">
                 <Calendar size={12} />
                 {post.date}
              </span>
              <h1 className="text-3xl md:text-5xl font-black font-display text-white leading-tight mb-6">
                {post.title}
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed font-light">
                {post.excerpt}
              </p>
           </div>

           {/* Hero Image */}
           <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-10 border border-gray-800 shadow-2xl">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
           </div>

           {/* Content */}
           <div className="prose prose-invert prose-lg max-w-none">
             <div className="text-gray-300 leading-relaxed whitespace-pre-line">
               {/* 
                  Note: In a real app we might use a markdown renderer. 
                  For now we display the content string which comes from Google Sheets 
               */}
               {post.content || "Contenido completo próximamente..."}
             </div>
           </div>
        </article>

      </div>
    </div>
  );
};
