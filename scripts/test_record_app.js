const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const PORT = 8098;

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

server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const browser = await chromium.launch({
      executablePath: edgePath,
      headless: true,
    });

    const context = await browser.newContext({
      viewport: { width: 430, height: 932 },
      deviceScaleFactor: 2,
      recordVideo: {
        dir: './recordings_test',
        size: { width: 860, height: 1864 },
      },
    });

    const page = await context.newPage();
    console.log('Navigating to http://localhost:' + PORT + '/index.html');
    await page.goto(`http://localhost:${PORT}/index.html`);
    await page.waitForTimeout(2000);

    const video = page.video();
    await context.close();
    await browser.close();

    if (video) {
      const vPath = await video.path();
      console.log('SUCCESS! Video recorded to:', vPath);
    }
  } catch (e) {
    console.error('Error during recording:', e);
  } finally {
    server.close();
  }
});
