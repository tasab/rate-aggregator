import puppeteer from 'puppeteer';
import { customPuppeteer } from '../puppeteer/customPuppeteer.js';

export const nbuWorker = async (rateSource) => {
  const url = rateSource?.link;

  if (!url) {
    throw new Error('URL is required');
  }
  const browser = await customPuppeteer();
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: 'networkidle2',
  });

  const pageRates = await page.evaluate(() => {
    const widget = document.querySelector('.widget-courses-nbu.wr_inner');
    if (!widget) return [];

    const results = [];
    const updated = new Date().toString();

    const currencyPairs = widget.querySelectorAll('.currency-pairs');

    currencyPairs.forEach((pair) => {
      const nameElement = pair.querySelector('.names span');
      if (!nameElement) return;

      const currencyCode = nameElement.firstChild?.textContent?.trim();
      if (!currencyCode) return;

      const saleElement = pair.querySelector('.sale span');
      const rate = saleElement
        ? parseFloat(saleElement.textContent.trim())
        : null;

      results.push({
        code: currencyCode.toLowerCase(),
        sell: null,
        bid: rate,
        updated: updated,
      });
    });

    return results;
  });

  await browser.close();

  if (!pageRates || !Array.isArray(pageRates)) {
    throw new Error('Invalid data structure from nbuWorker');
  }
  return pageRates;
};
