import { getLowerCode } from '../utils/stringUtils.js';
import { withBrowser } from '../middleware/withBrowser.js';
import { getNumber } from '../utils/numberUtils.js';

const privateBankWorkerCore = async (page, rateSource) => {
  const url = rateSource?.link;

  if (!url) throw new Error('URL is required');

  await page.goto(url, { waitUntil: 'networkidle2' });

  const pageRatesRaw = await page.evaluate(() => {
    const currencyBlock = document.querySelector('.courses-currencies');
    if (!currencyBlock) return [];

    const currencyPairs = currencyBlock.querySelectorAll('.currency-pairs');
    const rates = [];

    currencyPairs.forEach((pair) => {
      const nameElement = pair.querySelector('.names span');
      const code = nameElement?.firstChild?.textContent?.trim();

      const bidElement = pair.querySelector('.purchase span');
      const bidRaw = bidElement?.textContent?.trim();

      const sellElement = pair.querySelector('.sale span');
      const sellRaw = sellElement?.textContent?.trim();

      if (code && bidRaw && sellRaw) {
        rates.push({
          code,
          bidRaw,
          sellRaw,
          updated: new Date().toISOString(),
        });
      }
    });

    return rates;
  });

  const pageRates = pageRatesRaw.map((r) => ({
    code: getLowerCode(r.code),
    bid: getNumber(r.bidRaw),
    sell: getNumber(r.sellRaw),
    updated: r.updated,
  }));

  if (!pageRates || !Array.isArray(pageRates)) {
    throw new Error('Invalid data structure from privateBankWorker');
  }

  return pageRates;
};

export const privateBankWorker = withBrowser(privateBankWorkerCore);
