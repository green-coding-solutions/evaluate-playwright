const { firefox } = require("playwright");

const HEADLESS = process.env.HEADLESS === 'true'; // toggle via env variable

function logNote(message) {
  const timestamp = String(BigInt(Date.now()) * 1000000n).slice(0, 16);
  console.log(`${timestamp} ${message}`);
}

async function main() {
  logNote("Launch browser Firefox");
  const browser = await firefox.launch({ headless: HEADLESS });

  logNote("Creating new context");
  const context = await browser.newContext({
      ignoreHTTPSErrors: true,
      viewport: { width: 1280, height: 720 },
  });

  logNote("Creating new page");
  const page = await context.newPage();

  logNote("Visiting http://ngnix");

  const response = await page.goto('http://ngnix', {
    waitUntil: 'domcontentloaded',
    timeout: 5000,
  });

  if (!response || !response.ok()) {
    throw new Error(`Unexpected response: ${response ? response.status() : "no response"}`);
  }

  logNote("Idling for 5s");
  await page.waitForTimeout(5000);

  logNote("Closing Browser");
  await browser.close();

  logNote("End");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});