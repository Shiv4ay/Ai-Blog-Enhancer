import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const ArticleCard = ({ article }) => {
    // Format date
    const date = new Date(article.created_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <div className="card h-full flex flex-col p-6 relative group cursor-default">
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-[hsl(var(--primary))] bg-[rgba(var(--primary),0.1)] px-3 py-1 rounded-full">
                    {article.is_optimized ? 'AI Enhanced' : 'Original'}
                </span>
                <span className="text-xs text-[hsl(var(--text-muted))]">{date}</span>
            </div>

            <h3 className="text-xl font-bold mb-3 group-hover:text-[hsl(var(--primary))] transition-colors">
                {(article.title || 'Untitled').replace('[Optimized] ', '')}
            </h3>

            <p className="text-[hsl(var(--text-muted))] mb-6 flex-grow line-clamp-3">
                {(article.excerpt || '').replace(/<[^>]*>?/gm, '')}
            </p>

            <Link
                to={`/article/${article.id}`}
                className="flex items-center gap-2 text-sm font-semibold hover:gap-3 transition-all text-white"
            >
                Read & Compare <ArrowRight size={16} className="text-[hsl(var(--primary))]" />
            </Link>

            {/* Decorative gradient blob */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[hsl(var(--primary))] opacity-5 blur-[40px] rounded-full pointer-events-none group-hover:opacity-10 transition-opacity"></div>
        </div>
    );
};

export default ArticleCard;
