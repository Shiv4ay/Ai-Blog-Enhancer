const puppeteer = require('puppeteer');
const { convert } = require('html-to-text');

async function scrapeContent(url) {
    console.log(`Scraping content from: ${url}`);

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        // Try to identify main content
        const content = await page.evaluate(() => {
            // Common selectors for article content
            const selectors = ['article', '.entry-content', '.post-content', '.content', 'main', 'body'];
            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element && element.innerText.length > 500) {
                    return element.innerHTML;
                }
            }
            return document.body.innerHTML;
        });

        await browser.close();

        // Convert HTML to text
        const text = convert(content, {
            wordwrap: 130,
            selectors: [
                { selector: 'img', format: 'skip' },
                { selector: 'a', options: { ignoreHref: true } }
            ]
        });

        return text.substring(0, 8000); // Limit length for LLM context

    } catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
        await browser.close();
        return "";
    }
}

module.exports = { scrapeContent };
