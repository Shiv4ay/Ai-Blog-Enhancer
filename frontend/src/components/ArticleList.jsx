import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ArticleCard from './ArticleCard';
import { Loader2 } from 'lucide-react';

const ArticleList = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                // Fetch only optimized articles to show the "Product"
                const response = await axios.get('/api/articles?is_optimized=true');
                setArticles(response.data.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch articles", err);
                setError("Failed to load articles. Please check backend connection.");
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-[hsl(var(--primary))]" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 text-red-400">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {articles.map(article => (
                <ArticleCard key={article.id} article={article} />
            ))}
        </div>
    );
};

export default ArticleList;
