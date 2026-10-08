const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const PORT = 8097;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const fullPath = path.join(process.cwd(), reqPath);
  fs.readFile(fullPath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(fullPath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

async function testFastCountdown() {
  server.listen(PORT, async () => {
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const browser = await chromium.launch({ executablePath: edgePath, headless: true });
    const context = await browser.newContext({
      viewport: { width: 430, height: 932 },
      deviceScaleFactor: 2,
      recordVideo: {
        dir: './tachyon-promo/public/recordings',
        size: { width: 860, height: 1864 }
      }
    });

    const page = await context.newPage();
    await page.addInitScript(() => {
      try {
        localStorage.setItem('tachyon_settings', JSON.stringify({
          wpm: 700,
          masterVolume: 0,
          isMuted: true,
          isPro: true,
          soundProfile: 'mechanical',
          colorPalette: 'red',
          activeDocId: null,
          rsvpFont: 'sans',
          fontSize: 'md',
          warmUpMode: false,
          uiSoundsEnabled: false,
          appTheme: 'obsidian',
          language: 'en'
        }));
      } catch(e) {}

      // Fast forward 1000ms countdown interval to 20ms
      const orig = window.setInterval;
      window.setInterval = function(fn, delay, ...args) {
        if (delay === 1000) delay = 30;
        return orig(fn, delay, ...args);
      };
    });

    await page.goto(`http://localhost:${PORT}/index.html`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(300);

    // Click 700 WPM
    await page.evaluate(() => {
      const b700 = document.querySelector('.speed-preset-btn[data-wpm="700"]');
      if (b700) b700.click();
      const p = document.getElementById('btnPlayHero');
      if (p) p.click();
    });

    // Record words streaming for 4.5 seconds
    await page.waitForTimeout(4500);

    const video = page.video();
    await context.close();
    await browser.close();
    server.close();

    if (video) {
      const vPath = await video.path();
      const finalDest = path.join(process.cwd(), 'tachyon-promo/public/recordings/test_stream.webm');
      if (fs.existsSync(finalDest)) fs.unlinkSync(finalDest);
      fs.renameSync(vPath, finalDest);
      console.log('Video saved to:', finalDest);
    }
  });
}

testFastCountdown();
