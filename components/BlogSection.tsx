
import React from 'react';
import { BlogPost } from '../types';
import { ArrowRight } from 'lucide-react';

interface BlogSectionProps {
    posts: BlogPost[];
    onPostClick?: (post: BlogPost) => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ posts, onPostClick }) => {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
             <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
              Kayso <span className="text-kayso-orange">Blog</span>
            </h2>
            <p className="text-gray-400">Curiosidades y tips para sushi lovers.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article 
              key={post.id} 
              onClick={() => onPostClick && onPostClick(post)}
              className="bg-kayso-dark rounded-2xl overflow-hidden shadow-lg group cursor-pointer border border-gray-800 hover:border-kayso-orange/50 transition-colors h-full flex flex-col"
            >
              <div className="h-48 overflow-hidden flex-shrink-0">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-kayso-orange text-xs font-bold uppercase tracking-wider">{post.date}</span>
                <h3 className="text-xl font-bold text-white mt-2 mb-3 group-hover:text-kayso-orange transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-white font-bold text-sm group-hover:translate-x-2 transition-transform mt-auto">
                  Leer más <ArrowRight size={16} className="ml-2" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
