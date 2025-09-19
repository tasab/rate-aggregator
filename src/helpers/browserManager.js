import puppeteer from 'puppeteer';

const browserManager = {
  browser: null,
  isLoading: false,

  puppeteerConfig: {
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu',
      '--disable-extensions',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--max_old_space_size=4096',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
    ],
  },

  async getBrowser() {
    if (!this.browser && !this.isLoading) {
      this.isLoading = true;
      try {
        this.browser = await puppeteer.launch(this.puppeteerConfig);
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        throw error;
      }
    } else if (this.isLoading) {
      while (this.isLoading) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    return this.browser;
  },

  async createPage() {
    const browser = await this.getBrowser();
    return browser.newPage();
  },

  async closePage(page) {
    if (page && !page.isClosed()) {
      await page.close();
    }
  },

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  },

  async isHealthy() {
    if (!this.browser) return false;
    try {
      const pages = await this.browser.pages();
      return this.browser.process() !== null && pages !== null;
    } catch (error) {
      return false;
    }
  },
  async restart() {
    await this.close();
    return this.getBrowser();
  },
};

export default browserManager;
