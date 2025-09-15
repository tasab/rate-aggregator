import { customPuppeteer } from '../puppeteer/customPuppeteer.js';

export const privateBankWorker = async (rateSource) => {
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
    const currencyBlock = document.querySelector('.courses-currencies');
    const currencyPairs = currencyBlock.querySelectorAll('.currency-pairs');

    const rates = [];

    currencyPairs.forEach((pair) => {
      // Get currency name (first text node, excluding the compare currency)
      const nameElement = pair.querySelector('.names span');
      const currencyName = nameElement.firstChild.textContent.trim();

      // Get purchase (bid) rate
      const bidElement = pair.querySelector('.purchase span');
      const bid = parseFloat(bidElement.textContent.trim());

      // Get sale (sell) rate
      const sellElement = pair.querySelector('.sale span');
      const sell = parseFloat(sellElement.textContent.trim());

      rates.push({
        code: currencyName?.toLowerCase(),
        bid: bid,
        sell: sell,
      });
    });

    return rates;
  });

  await browser.close();

  if (!pageRates || !Array.isArray(pageRates)) {
    throw new Error('Invalid data structure from privateBankWorker');
  }
  return pageRates;
};
