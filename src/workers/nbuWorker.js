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
    const rows = document.querySelectorAll('#exchangeRates tbody tr');
    const result = [];

    rows.forEach((row) => {
      const codeEl = row.querySelector('td[data-label="Letter code"]');
      const rateEl = row.querySelector('td[data-label="UAH"]');

      if (!codeEl || !rateEl) return;

      const code = codeEl.textContent.trim().toLowerCase();
      const rate = parseFloat(rateEl.textContent.trim().replace(',', '.'));

      if (!isNaN(rate)) {
        result.push({
          code,
          sell: null,
          bid: rate,
          updated: new Date().toString(),
        });
      }
    });

    return result;
  });

  if (!pageRates || !Array.isArray(pageRates)) {
    throw new Error('Invalid data structure from nbuWorker');
  }

  return pageRates;
};

export const nbuWorker = withBrowser(nbuWorkerCore);
