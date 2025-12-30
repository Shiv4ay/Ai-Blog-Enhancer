import React from 'react';
import ArticleList from '../components/ArticleList';
import { Sparkles, Bot } from 'lucide-react';

const Home = () => {
    return (
        <div>
            <div className="glass-header">
                <div className="container flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl text-white">
                        BeyondChats <span className="text-[hsl(var(--primary))]">SEO</span>
                    </div>
                    <a
                        href="https:beyondchats.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-[hsl(var(--text-muted))] hover:text-white transition-colors"
                    >
                        Official Site
                    </a>
                </div>
            </div>

            <div className="container py-12">
                <header className="mb-12 text-center max-w-2xl mx-auto animate-fade-in">
                    <h1 className="mb-4">
                        AI-Enhanced <span className="text-[hsl(var(--primary))]">Blog Engine</span>
                    </h1>
                    <p className="text-lg">
                        Discover how we transform existing content into SEO-optimized masterpieces using advanced AI and real-time Google Search data.
                    </p>
                </header>

                <ArticleList />
            </div>
        </div>
    );
};

export default Home;
