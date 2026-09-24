const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();

    const errors = [];
    page.on('pageerror', (err) => errors.push('PAGEERROR: ' + err.message));
    page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push('CONSOLE.ERROR: ' + msg.text());
        else if (msg.type() === 'warning') errors.push('CONSOLE.WARN: ' + msg.text());
    });

    const routes = ['/', '/create', '/onboarding', '/dashboard', '/editor-v2', '/signin', '/signup'];
    for (const route of routes) {
        errors.length = 0;
        try {
            await page.goto('http://localhost:5173' + route, { waitUntil: 'networkidle', timeout: 15000 });
            await page.waitForTimeout(800);
            const title = await page.title();
            const rootHTML = await page.locator('#root').innerHTML();
            const bodyText = (await page.locator('body').innerText()).slice(0, 300);
            const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
            const color = await page.evaluate(() => getComputedStyle(document.body).color);
            const rootEmpty = rootHTML.trim().length === 0;
            console.log(`\n────── ${route} ──────`);
            console.log('title:', title);
            console.log('root empty:', rootEmpty);
            console.log('root html length:', rootHTML.length);
            console.log('body text:', JSON.stringify(bodyText));
            console.log('body bg:', bg, 'color:', color);
            if (errors.length) {
                console.log('ERRORS:');
                errors.forEach((e) => console.log('  ', e));
            }
        } catch (e) {
            console.log(`\n────── ${route} ──────`);
            console.log('NAV ERROR:', e.message);
            errors.forEach((er) => console.log('  ', er));
        }
    }

    await browser.close();
})();
