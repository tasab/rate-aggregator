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
      '--single-process', // Add this - important for resource management
      '--disable-gpu',
      '--disable-extensions',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--max_old_space_size=4096', // Increase memory limit
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
    ],
  };

  return puppeteer.launch(puppeteerConfig);
};
