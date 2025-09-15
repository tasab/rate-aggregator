import puppeteer from 'puppeteer';

export const customPuppeteer = () => {
  const puppeteerConfig = {
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--disable-extensions',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
    ],
  };

  if (process.env.NODE_ENV === 'production') {
    puppeteerConfig.executablePath = '/usr/bin/chromium-browser';
  }

  return puppeteer.launch(puppeteerConfig); // return замість export
};
