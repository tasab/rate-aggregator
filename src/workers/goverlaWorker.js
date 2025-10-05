import { withBrowser } from '../middleware/withBrowser.js';

const goverlaWorkerCore = async (page, rateSource) => {
  const url = rateSource?.link;

  if (!url) {
    throw new Error('URL is required');
  }

  await page.goto(url, {
    waitUntil: 'networkidle2',
  });

  const pageRate = await page.evaluate(() => {
    const updated = new Date().toISOString();
    const rateContainer = document.querySelector('.container.rates.home__item');
    const rows = rateContainer.querySelectorAll('.rates__rows .row');
    const rates = Array.from(rows).map((row) => {
      const code = row.querySelector('.currency__code')?.textContent.trim();
      const bid = row
        .querySelectorAll('.row__value .value__absolute')[0]
        ?.textContent.trim();
      const sell = row
        .querySelectorAll('.row__value .value__absolute')[1]
        ?.textContent.trim();

      return {
        code,
        bid,
        sell,
        updated,
      };
    });
    return rates;
  });

  if (!pageRate || !Array.isArray(pageRate)) {
    throw new Error('Invalid data structure from Goverla');
  }

  return pageRate;
};

export const goverlaWorker = withBrowser(goverlaWorkerCore);
