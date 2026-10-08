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

async function recordAppClip({ name, theme = 'obsidian', setupFn, durationMs = 5000 }) {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const outDir = path.join(process.cwd(), 'tachyon-promo', 'public', 'recordings');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--window-size=430,932']
  });

  const context = await browser.newContext({
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 2,
    recordVideo: {
      dir: outDir,
      size: { width: 430, height: 932 }
    }
  });

  const page = await context.newPage();

  await page.addInitScript((t) => {
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
        appTheme: t,
        language: 'en'
      }));
    } catch(e) {}

    // Fast-forward 1000ms countdown interval to 25ms so reading begins immediately
    const orig = window.setInterval;
    window.setInterval = function(fn, delay, ...args) {
      if (delay === 1000) delay = 25;
      return orig(fn, delay, ...args);
    };
  }, theme);

  await page.goto(`http://localhost:${PORT}/index.html`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(400);

  if (setupFn) {
    await setupFn(page);
  }

  await page.waitForTimeout(durationMs);

  const video = page.video();
  await context.close();
  await browser.close();

  if (video) {
    const rawPath = await video.path();
    const finalWebm = path.join(outDir, `${name}.webm`);
    if (fs.existsSync(finalWebm)) fs.unlinkSync(finalWebm);
    fs.renameSync(rawPath, finalWebm);
    console.log(`Saved ${name}.webm`);
    return finalWebm;
  }
}

async function recordAll() {
  server.listen(PORT, async () => {
    console.log(`Server started on ${PORT}`);
    try {
      // 1. Reader 700 WPM
      console.log('Recording: real_reader...');
      await recordAppClip({
        name: 'real_reader',
        theme: 'obsidian',
        durationMs: 5000,
        setupFn: async (page) => {
          await page.evaluate(() => {
            const b700 = document.querySelector('.speed-preset-btn[data-wpm="700"]');
            if (b700) b700.click();
            const p = document.getElementById('btnPlayHero');
            if (p) p.click();
          });
        }
      });

      // 2. Library Scroll
      console.log('Recording: real_library...');
      await recordAppClip({
        name: 'real_library',
        theme: 'obsidian',
        durationMs: 5000,
        setupFn: async (page) => {
          await page.evaluate(() => {
            const lib = document.querySelector('.nav-tab-btn[data-target="tabLibrary"]');
            if (lib) lib.click();
          });
          await page.waitForTimeout(600);
          await page.evaluate(() => {
            const start = performance.now();
            const duration = 3800;
            const dist = 320;
            function step(now) {
              const el = now - start;
              const p = Math.min(1, el / duration);
              const ease = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
              window.scrollTo(0, dist * ease);
              if (p < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
          });
        }
      });

      // 3. Dark Mode Reading
      console.log('Recording: real_dark...');
      await recordAppClip({
        name: 'real_dark',
        theme: 'obsidian',
        durationMs: 5000,
        setupFn: async (page) => {
          await page.evaluate(() => {
            const b500 = document.querySelector('.speed-preset-btn[data-wpm="500"]');
            if (b500) b500.click();
            const p = document.getElementById('btnPlayHero');
            if (p) p.click();
          });
        }
      });

      // 4. Light Mode Reading (Vellum)
      console.log('Recording: real_light...');
      await recordAppClip({
        name: 'real_light',
        theme: 'vellum',
        durationMs: 5000,
        setupFn: async (page) => {
          await page.evaluate(() => {
            // Apply fast countdown
            const orig = window.setInterval;
            window.setInterval = function(fn, delay, ...args) {
              if (delay === 1000) delay = 25;
              return orig(fn, delay, ...args);
            };

            document.body.setAttribute('data-theme', 'vellum');
            const wpObs = document.querySelector('.wallpaper-obsidian');
            const wpVel = document.querySelector('.wallpaper-vellum');
            if (wpObs) wpObs.style.opacity = '0';
            if (wpVel) wpVel.style.opacity = '1';

            const b500 = document.querySelector('.speed-preset-btn[data-wpm="500"]');
            if (b500) b500.click();
            const p = document.getElementById('btnPlayHero');
            if (p) p.click();
          });
        }
      });

      // 5. Settings Interaction
      console.log('Recording: real_settings...');
      await recordAppClip({
        name: 'real_settings',
        theme: 'obsidian',
        durationMs: 5000,
        setupFn: async (page) => {
          await page.evaluate(() => {
            const setBtn = document.querySelector('.nav-tab-btn[data-target="tabSettings"]');
            if (setBtn) setBtn.click();
          });
          await page.waitForTimeout(800);

          await page.evaluate(() => {
            const mech = document.querySelector('.sound-chip[data-profile="mechanical"]');
            if (mech) mech.click();
          });
          await page.waitForTimeout(800);

          await page.evaluate(() => {
            const red = document.querySelector('.accent-dot[data-color="red"]');
            if (red) red.click();
          });
          await page.waitForTimeout(600);

          await page.evaluate(() => {
            window.scrollBy({ top: 180, behavior: 'smooth' });
          });
        }
      });

      console.log('All 5 authentic app recordings finished!');
    } catch(e) {
      console.error('Error:', e);
    } finally {
      server.close();
    }
  });
}

recordAll();
