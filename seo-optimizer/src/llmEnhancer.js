const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "YOUR_API_KEY_HERE");

async function enhanceArticle(originalArticle, referenceArticles) {
    if (!process.env.GEMINI_API_KEY) {
        console.warn("WARNING: GEMINI_API_KEY not found in .env. Skipping LLM enhancement.");
        return {
            title: `[Optimized] ${originalArticle.title}`,
            content: originalArticle.content + "\n\n<p><em>(Content optimization skipped due to missing API key)</em></p>",
            excerpt: originalArticle.excerpt,
            references: referenceArticles.map(r => ({ title: r.title, url: r.url }))
        };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
    You are an expert SEO content writer. Your task is to rewrite and optimize the following blog article based on two high-ranking reference articles found on Google.
    
    ORIGINAL ARTICLE TITLE: ${originalArticle.title}
    ORIGINAL CONTENT:
    ${originalArticle.content.substring(0, 5000)} ... (truncated)

    REFERENCE ARTICLE 1 (${referenceArticles[0]?.title || 'N/A'}):
    ${referenceArticles[0]?.content?.substring(0, 3000) || 'N/A'}

    REFERENCE ARTICLE 2 (${referenceArticles[1]?.title || 'N/A'}):
    ${referenceArticles[1]?.content?.substring(0, 3000) || 'N/A'}

    INSTRUCTIONS:
    1. Rewrite the original article to be more comprehensive, engaging, and SEO-friendly.
    2. Incorporate key insights and structure from the reference articles, but DO NOT plagiarize.
    3. Maintain the original core message and tone.
    4. Use proper HTML formatting (<h1>, <h2>, <p>, <ul>, etc.).
    5. The output must be the full HTML content of the new article.
    6. At the very end, append a "References" section with links to the reference articles.
    
    OUTPUT FORMAT:
    Return ONLY the HTML content. Do not include markdown code blocks like \`\`\`html.
    `;

    try {
        console.log(`Sending prompt to Gemini for article: ${originalArticle.title}`);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean up markdown code blocks if present
        text = text.replace(/```html/g, '').replace(/```/g, '');

        return {
            title: `[Optimized] ${originalArticle.title}`,
            content: text,
            excerpt: text.substring(0, 200).replace(/<[^>]*>?/gm, '') + '...',
            references: referenceArticles.map(r => ({ title: r.title, url: r.url }))
        };

    } catch (error) {
        console.error("Error calling Gemini API:", error.message);
        return {
            title: `[Optimized] ${originalArticle.title}`,
            content: originalArticle.content + "\n\n<p><em>(Optimization failed: " + error.message + ")</em></p>",
            excerpt: originalArticle.excerpt,
            references: []
        };
    }
}

module.exports = { enhanceArticle };
