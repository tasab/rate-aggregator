import { withBrowser } from '../middleware/withBrowser.js';
import { getNumber } from '../utils/numberUtils.js';

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

    const rawData = [];

    rows.forEach((row) => {
      const codeEl = row.querySelector('td[data-label="Letter code"]');
      const rateEl = row.querySelector('td[data-label="UAH"]');

      if (!codeEl || !rateEl) return;

      const code = codeEl.textContent.trim().toLowerCase();
      const rate = rateEl.textContent.trim().replace(',', '.');

      rawData.push({ code, rate });
    });

    return {
      rawData,
      updated: new Date().toISOString(), // return raw timestamp for formatting in Node
    };
  });

  if (!pageRates?.rawData || !Array.isArray(pageRates.rawData)) {
    throw new Error('Invalid data structure from nbuWorker');
  }

  const formattedRate = pageRates.rawData
    .map(({ code, rate }) => {
      const bid = getNumber(rate);
      if (isNaN(bid)) return null;

      return {
        code,
        sell: null,
        bid,
        updated: new Date().toISOString(),
      };
    })
    .filter(Boolean);

  return formattedRate;
};

export const nbuWorker = withBrowser(nbuWorkerCore);
