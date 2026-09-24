const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();

    const errors = [];
    page.on('pageerror', (err) => errors.push('PAGEERROR: ' + err.message));
    page.on('console', (msg) => { if (msg.type() === 'error') errors.push('CONSOLE.ERROR: ' + msg.text()); });

    const routes = ['/signin', '/signup', '/dashboard', '/editor-v2', '/editor', '/templates', '/profile', '/my-resumes'];
    for (const route of routes) {
        errors.length = 0;
        await page.goto('http://localhost:5173' + route, { waitUntil: 'networkidle', timeout: 15000 });
        await page.waitForTimeout(800);
        const filename = `debug-${(route.replace(/\//g, '_') || 'home')}.png`;
        await page.screenshot({ path: filename, fullPage: false });
        console.log(`saved ${filename} | errors: ${errors.length}`);
        errors.forEach((e) => console.log('   ', e.slice(0, 200)));
    }

    await browser.close();
})();
