import { withBrowser } from '../middleware/withBrowser.js';

const nbuWorkerCore = async (page, rateSource) => {
  const url = rateSource?.link;

  if (!url) {
    throw new Error('URL is required');
  }

  await page.goto(url, {
    waitUntil: 'networkidle2',
  });

  const pageRates = await page.evaluate(() => {
    const widget = document.querySelector('.widget-courses-nbu.wr_inner');
    if (!widget) return [];

    const results = [];

    const currencyPairs = widget.querySelectorAll('.currency-pairs');

    currencyPairs.forEach((pair) => {
      const nameElement = pair.querySelector('.names span');
      if (!nameElement) return;

      const code = nameElement.firstChild?.textContent?.trim();
      if (!code) return;

      const saleElement = pair.querySelector('.sale span');
      const rate = saleElement
        ? parseFloat(saleElement.textContent.trim())
        : null;

      results.push({
        code: code.toLowerCase(),
        sell: null,
        bid: rate,
        updated: new Date().toString(),
      });
    });

    return results;
  });

  if (!pageRates || !Array.isArray(pageRates)) {
    throw new Error('Invalid data structure from nbuWorker');
  }

  return pageRates;
};

export const nbuWorker = withBrowser(nbuWorkerCore);
