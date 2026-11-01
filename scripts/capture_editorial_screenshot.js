const puppeteer = require('puppeteer-core');
const fs = require('fs');

const edgePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
];

const executablePath = edgePaths.find(p => fs.existsSync(p));

(async () => {
  if (!executablePath) {
    console.error('No browser executable found');
    return;
  }
  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  
  const section = await page.$('section[aria-label="Featured Editorial Stories"]');
  if (section) {
    await section.screenshot({ path: 'C:/Users/DELL/.gemini/antigravity-ide/brain/0bc20ef6-ddac-447a-a0f6-8bc5938cded7/featured_editorial_screenshot.png' });
    console.log('Featured section screenshot saved');
  } else {
    console.log('Featured section not found');
  }

  const sponsored = await page.$('section[aria-label="Sponsored and Advertising"]');
  if (sponsored) {
    await sponsored.screenshot({ path: 'C:/Users/DELL/.gemini/antigravity-ide/brain/0bc20ef6-ddac-447a-a0f6-8bc5938cded7/sponsored_screenshot.png' });
    console.log('Sponsored section screenshot saved');
  }

  await browser.close();
})();
