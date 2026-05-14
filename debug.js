import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  page.on('requestfailed', request => {
    console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText);
  });

  try {
    console.log("Navigating...");
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    console.log("Done waiting.");
    const bodyHTML = await page.evaluate(() => document.body.innerHTML);
    console.log("Body HTML length:", bodyHTML.length);
  } catch (err) {
    console.log("Navigation error:", err);
  }

  await browser.close();
})();
