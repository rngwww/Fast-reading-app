const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const PORT = 8099;

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
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(fullPath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

async function recordScreen({ name, theme = 'obsidian', setupFn, durationMs = 5000 }) {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const outDir = path.join(process.cwd(), 'tachyon-promo', 'public', 'recordings');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await chromium.launch({
    executablePath: edgePath,
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 2,
    recordVideo: {
      dir: outDir,
      size: { width: 860, height: 1864 },
    },
  });

  const page = await context.newPage();

  // Set localStorage settings before navigation
  await page.addInitScript((t) => {
    try {
      localStorage.setItem('tachyon_settings', JSON.stringify({
        wpm: 700,
        masterVolume: 0.3,
        isMuted: false,
        isPro: true,
        soundProfile: 'mechanical',
        colorPalette: 'red',
        activeDocId: null,
        rsvpFont: 'sans',
        fontSize: 'md',
        warmUpMode: false,
        uiSoundsEnabled: true,
        appTheme: t,
        language: 'en'
      }));
    } catch(e) {}
  }, theme);

  await page.goto(`http://localhost:${PORT}/index.html`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);

  if (setupFn) {
    await setupFn(page);
  }

  await page.waitForTimeout(durationMs);

  const video = page.video();
  await context.close();
  await browser.close();

  if (video) {
    const rawPath = await video.path();
    const finalPath = path.join(outDir, `${name}.webm`);
    if (fs.existsSync(finalPath)) fs.unlinkSync(finalPath);
    fs.renameSync(rawPath, finalPath);
    console.log(`Recorded ${name} -> ${finalPath}`);
    return finalPath;
  }
}

async function runAll() {
  server.listen(PORT, async () => {
    console.log(`Server listening on ${PORT}`);
    try {
      // 1. Scene 1: Reader Streaming at 700 WPM
      console.log('Recording 1: Real Reader streaming 700 WPM...');
      await recordScreen({
        name: 'real_reader_700wpm',
        theme: 'obsidian',
        durationMs: 5000,
        setupFn: async (page) => {
          // Select 700 WPM
          await page.evaluate(() => {
            const btn700 = document.querySelector('.speed-preset-btn[data-wpm="700"]');
            if (btn700) btn700.click();
            // Start reading Meditations
            const libBtn = document.querySelector('.nav-tab-btn[data-target="tabLibrary"]');
            if (libBtn) libBtn.click();
          });
          await page.waitForTimeout(400);

          await page.evaluate(() => {
            // Click Meditations (doc1 or first book)
            const cards = document.querySelectorAll('.book-card-item');
            if (cards.length > 0) {
              const c = cards[0].querySelector('.book-card') || cards[0];
              c.click();
            }
          });
          await page.waitForTimeout(400);

          await page.evaluate(() => {
            const launchBtn = document.getElementById('btnLaunchRead');
            if (launchBtn) launchBtn.click();
          });
          await page.waitForTimeout(400);

          // Click Play Hero to start real streaming!
          await page.evaluate(() => {
            const btnPlay = document.getElementById('btnPlayHero');
            if (btnPlay) btnPlay.click();
          });
        }
      });

      // 2. Scene 2: Library Scrolling
      console.log('Recording 2: Real Library scrolling...');
      await recordScreen({
        name: 'real_library_scroll',
        theme: 'obsidian',
        durationMs: 5000,
        setupFn: async (page) => {
          await page.evaluate(() => {
            const libBtn = document.querySelector('.nav-tab-btn[data-target="tabLibrary"]');
            if (libBtn) libBtn.click();
          });
          await page.waitForTimeout(800);

          // Animate smooth scroll on the main scrollable container
          await page.evaluate(async () => {
            const main = document.getElementById('modernApp') || document.scrollingElement || window;
            const start = performance.now();
            const duration = 3800;
            const totalDist = 280;

            function step(now) {
              const elapsed = now - start;
              const progress = Math.min(1, elapsed / duration);
              // Ease in out quad
              const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
              window.scrollTo(0, totalDist * ease);
              if (progress < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
          });
        }
      });

      // 3. Scene 3A: Dark Mode Reading
      console.log('Recording 3A: Real Dark Mode reading...');
      await recordScreen({
        name: 'real_dark_reading',
        theme: 'obsidian',
        durationMs: 5000,
        setupFn: async (page) => {
          await page.evaluate(() => {
            const p500 = document.querySelector('.speed-preset-btn[data-wpm="500"]');
            if (p500) p500.click();
            const btnPlay = document.getElementById('btnPlayHero');
            if (btnPlay) btnPlay.click();
          });
        }
      });

      // 4. Scene 3B: Light Mode Reading (Vellum)
      console.log('Recording 3B: Real Light Mode reading (Vellum)...');
      await recordScreen({
        name: 'real_light_reading',
        theme: 'vellum',
        durationMs: 5000,
        setupFn: async (page) => {
          await page.evaluate(() => {
            document.body.setAttribute('data-theme', 'vellum');
            const wpObs = document.querySelector('.wallpaper-obsidian');
            const wpVel = document.querySelector('.wallpaper-vellum');
            if (wpObs) wpObs.style.opacity = '0';
            if (wpVel) wpVel.style.opacity = '1';

            // Select doc2 (Einstein Relativity)
            const libBtn = document.querySelector('.nav-tab-btn[data-target="tabLibrary"]');
            if (libBtn) libBtn.click();
          });
          await page.waitForTimeout(400);

          await page.evaluate(() => {
            const cards = document.querySelectorAll('.book-card-item');
            if (cards.length > 1) {
              const c = cards[1].querySelector('.book-card') || cards[1];
              c.click();
            }
          });
          await page.waitForTimeout(400);

          await page.evaluate(() => {
            const launchBtn = document.getElementById('btnLaunchRead');
            if (launchBtn) launchBtn.click();
          });
          await page.waitForTimeout(400);

          await page.evaluate(() => {
            const p500 = document.querySelector('.speed-preset-btn[data-wpm="500"]');
            if (p500) p500.click();
            const btnPlay = document.getElementById('btnPlayHero');
            if (btnPlay) btnPlay.click();
          });
        }
      });

      // 5. Scene 4: Real Settings Menu Interaction
      console.log('Recording 4: Real Settings interaction...');
      await recordScreen({
        name: 'real_settings_action',
        theme: 'obsidian',
        durationMs: 5000,
        setupFn: async (page) => {
          await page.evaluate(() => {
            const setBtn = document.querySelector('.nav-tab-btn[data-target="tabSettings"]');
            if (setBtn) setBtn.click();
          });
          await page.waitForTimeout(1000);

          // Click Mechanical sound profile
          await page.evaluate(() => {
            const mech = document.querySelector('.sound-chip[data-profile="mechanical"]');
            if (mech) mech.click();
          });
          await page.waitForTimeout(1000);

          // Click Red focal dot
          await page.evaluate(() => {
            const red = document.querySelector('.accent-dot[data-color="red"]');
            if (red) red.click();
          });
          await page.waitForTimeout(800);

          // Smooth scroll down to show focal colors & appearances
          await page.evaluate(() => {
            window.scrollBy({ top: 160, behavior: 'smooth' });
          });
        }
      });

      console.log('ALL RECORDINGS COMPLETED SUCCESSFULLY!');
    } catch (err) {
      console.error('Recording error:', err);
    } finally {
      server.close();
    }
  });
}

runAll();
