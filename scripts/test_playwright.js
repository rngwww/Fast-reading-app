const { chromium } = require('playwright-core');
const fs = require('fs');

async function testPlaywrightRecord() {
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
      size: { width: 430, height: 932 }
    }
  });

  const page = await context.newPage();
  console.log('Navigating to http://localhost:8095/index.html...');
  await page.goto('http://localhost:8095/index.html');
  await page.waitForTimeout(2000);

  const video = page.video();
  await context.close();
  await browser.close();

  if (video) {
    const videoPath = await video.path();
    console.log('Video saved to:', videoPath);
  }
}

testPlaywrightRecord().catch(console.error);
