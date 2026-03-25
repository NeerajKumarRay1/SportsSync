const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  let logs = [];
  page.on('console', msg => logs.push('CONSOLE: ' + msg.text()));
  page.on('pageerror', error => logs.push('ERROR: ' + error.message));
  page.on('requestfailed', request => logs.push('FAILED: ' + request.url()));

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  } catch (err) {
    logs.push('CATCH: ' + err.message);
  } finally {
    fs.writeFileSync('browser_errors.txt', logs.join('\n'));
    await browser.close();
  }
})();
