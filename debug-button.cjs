const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();

    await page.goto('http://localhost:5173/signin', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    const btnInfo = await page.evaluate(() => {
        const navbarCta = document.querySelector('header a[href="/create"]');
        if (!navbarCta) return { found: false };
        const computed = getComputedStyle(navbarCta);
        const rect = navbarCta.getBoundingClientRect();
        return {
            found: true,
            text: navbarCta.textContent,
            backgroundColor: computed.backgroundColor,
            color: computed.color,
            width: rect.width,
            height: rect.height,
            className: navbarCta.className,
        };
    });
    console.log('navbar CTA:', JSON.stringify(btnInfo, null, 2));

    const allLinks = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a, button')).slice(0, 10).map((el) => {
            const cs = getComputedStyle(el);
            return {
                tag: el.tagName,
                text: el.textContent.trim().slice(0, 40),
                bg: cs.backgroundColor,
                color: cs.color,
                cls: el.className.slice(0, 80),
            };
        });
    });
    console.log('\nFirst 10 clickables:');
    allLinks.forEach((b, i) => console.log(`${i}:`, JSON.stringify(b)));

    await browser.close();
})();
