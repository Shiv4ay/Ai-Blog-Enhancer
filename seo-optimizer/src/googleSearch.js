const puppeteer = require('puppeteer');

async function searchGoogle(query) {
    console.log(`Searching Google for: ${query}`);

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

        await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`, { waitUntil: 'networkidle2' });

        const results = await page.evaluate(() => {
            const items = [];
            document.querySelectorAll('.g').forEach(div => {
                const titleEl = div.querySelector('h3');
                const linkEl = div.querySelector('a');

                if (titleEl && linkEl) {
                    const title = titleEl.innerText;
                    const url = linkEl.href;

                    if (url && !url.includes('beyondchats.com') && !url.includes('google.com')) {
                        items.push({ title, url });
                    }
                }
            });
            return items;
        });

        await browser.close();
        return results.slice(0, 2); // Return top 2

    } catch (error) {
        console.error('Error searching Google:', error);
        await browser.close();
        return [];
    }
}

module.exports = { searchGoogle };
