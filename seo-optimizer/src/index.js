const { fetchUnoptimizedArticles, publishArticle, updateArticle } = require('./articleFetcher');
const { searchGoogle } = require('./googleSearch');
const { scrapeContent } = require('./webScraper');
const { enhanceArticle } = require('./llmEnhancer');
require('dotenv').config();

async function main() {
    console.log("Starting SEO Optimization Process...");

    if (!process.env.GEMINI_API_KEY) {
        console.error("ERROR: GEMINI_API_KEY is missing in .env file.");
        console.error("Please create a .env file with GEMINI_API_KEY=your_key");
        // We continue to demonstrate the flow even without key (fallback logic in enhancer)
    }

    // 1. Fetch articles
    const articles = await fetchUnoptimizedArticles();
    console.log(`Found ${articles.length} articles to optimize.`);

    for (const article of articles) {
        console.log(`\nProcessing: "${article.title}" (ID: ${article.id})`);

        // 2. Search Google
        const searchResults = await searchGoogle(article.title);
        console.log(`Found ${searchResults.length} reference articles.`);

        const referenceArticles = [];

        // 3. Scrape References
        for (const result of searchResults) {
            const content = await scrapeContent(result.url);
            if (content) {
                referenceArticles.push({
                    title: result.title,
                    url: result.url,
                    content: content
                });
            }
        }

        // 4. Enhance Content
        const optimizedData = await enhanceArticle(article, referenceArticles);

        // 5. Publish New Article
        const newArticleData = {
            title: optimizedData.title,
            content: optimizedData.content,
            excerpt: optimizedData.excerpt,
            author: article.author || 'AI Optimizer',
            is_optimized: true,
            original_article_id: article.id,
            source_url: article.source_url,
            references: optimizedData.references
        };

        try {
            const result = await publishArticle(newArticleData);
            console.log(`Successfully published optimized article ID: ${result.id}`);

            // Mark original as optimized so we don't process it again next time
            await updateArticle(article.id, { is_optimized: true });
            console.log(`Marked original article ${article.id} as optimized.`);

        } catch (err) {
            console.error("Failed to publish optimized article.", err.message);
        }
    }

    console.log("\nProcess Completed.");
}

main();
