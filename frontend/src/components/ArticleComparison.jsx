import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ExternalLink, Loader2, Sparkles, FileText } from 'lucide-react';

const ArticleComparison = () => {
    const { id } = useParams();
    const [optimized, setOptimized] = useState(null);
    const [original, setOriginal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('optimized'); // For mobile view

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // 1. Fetch the requested article (should be the optimized one)
                const optResponse = await axios.get(`/api/articles/${id}`);
                setOptimized(optResponse.data);

                // 2. Fetch the original article if it exists
                if (optResponse.data.original_article_id) {
                    const origResponse = await axios.get(`/api/articles/${optResponse.data.original_article_id}`);
                    setOriginal(origResponse.data);
                } else {
                    // Fallback: If we somehow opened an original article, check if it is optimized
                    // Actually the logic implies we list optimized articles.
                    // If this IS an original article (not optimized), treat it as original
                    if (!optResponse.data.is_optimized) {
                        setOriginal(optResponse.data);
                        setOptimized(null); // No optimized version found via this route
                    }
                }
            } catch (err) {
                console.error("Error fetching details", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return (
        <div className="loading-container">
            <Loader2 className="spinner" size={48} />
        </div>
    );

    if (!optimized && !original) return <div className="error-container">Article not found</div>;

    return (
        <div className="container animate-fade-in">
            <Link to="/" className="btn-link" style={{ marginBottom: '2rem' }}>
                <ArrowLeft size={20} /> Back to Articles
            </Link>

            <div className="mobile-toggle">
                <button
                    className={`toggle-btn ${activeTab === 'original' ? 'active' : ''}`}
                    onClick={() => setActiveTab('original')}
                >
                    Original
                </button>
                <button
                    className={`toggle-btn ${activeTab === 'optimized' ? 'active' : ''}`}
                    onClick={() => setActiveTab('optimized')}
                >
                    <Sparkles size={16} style={{ display: 'inline', marginRight: '4px' }} /> AI Enhanced
                </button>
            </div>

            <div className="comparison-container">
                {/* Original Column */}
                <div
                    className="article-column prose"
                    style={{ display: (activeTab === 'original' || window.innerWidth >= 1024) ? 'block' : 'none' }}
                >
                    <div className="column-header">
                        <div className="column-title">
                            <FileText size={24} className="text-[hsl(var(--text-muted))]" />
                            Original Article
                            <span className="column-badge badge-original">Unoptimized</span>
                        </div>
                        {original ? (
                            <h2>{original.title}</h2>
                        ) : (
                            <p>Original article content unavailable.</p>
                        )}
                    </div>

                    {original && <div dangerouslySetInnerHTML={{ __html: original.content }} />}
                </div>

                {/* Optimized Column */}
                <div
                    className="article-column prose"
                    style={{
                        background: 'rgba(var(--primary), 0.02)',
                        display: (activeTab === 'optimized' || window.innerWidth >= 1024) ? 'block' : 'none'
                    }}
                >
                    <div className="column-header">
                        <div className="column-title" style={{ color: 'hsl(var(--primary))' }}>
                            <Sparkles size={24} />
                            AI Enhanced
                            <span className="column-badge badge-optimized">SEO Ready</span>
                        </div>
                        {optimized ? (
                            <h2>{optimized.title.replace('[Optimized] ', '')}</h2>
                        ) : (
                            <p>Optimized version unavailable.</p>
                        )}
                    </div>

                    {optimized && <div dangerouslySetInnerHTML={{ __html: optimized.content }} />}

                    {optimized && optimized.references && (
                        <div className="references-section">
                            <h3 className="references-title">References & Sources</h3>
                            <ul className="reference-list">
                                {optimized.references.map((ref, idx) => (
                                    <li key={idx} className="reference-item">
                                        <a href={ref.url} target="_blank" rel="noopener noreferrer" className="reference-link">
                                            <ExternalLink size={14} />
                                            {ref.title || ref.url}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArticleComparison;
