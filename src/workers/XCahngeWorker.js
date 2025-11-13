import { withBrowser } from '../middleware/withBrowser.js';
import { getNumber } from '../utils/numberUtils.js';

const CURRENCY_CODE_MAP = {
  840: 'USD', // US Dollar
  978: 'EUR', // Euro
  985: 'PLN', // Polish Zloty
  826: 'GBP', // British Pound
  756: 'CHF', // Swiss Franc
  124: 'CAD', // Canadian Dollar
  752: 'SEK', // Swedish Krona
  203: 'CZK', // Czech Koruna
  208: 'DKK', // Danish Krone
  578: 'NOK', // Norwegian Krone
  980: 'UAH', // Ukrainian Hryvnia
};

const XChangeWorkerCore = async (page, rateSource) => {
  const url = rateSource?.link;

  if (!url) {
    throw new Error('URL is required');
  }

  await page.goto(url, {
    waitUntil: 'networkidle2',
  });

  const pageRates = await page.evaluate(() => {
    // First, try to get data from the hidden JSON input
    const exchangeRatesInput = document.querySelector(
      'input[name="exchange_rates"]'
    );

    if (exchangeRatesInput && exchangeRatesInput.value) {
      try {
        const jsonData = JSON.parse(
          exchangeRatesInput.value.replace(/&quot;/g, '"')
        );
        return {
          rawData: jsonData,
          source: 'json',
          updated: new Date().toISOString(),
        };
      } catch (error) {
        console.warn(
          'Failed to parse JSON data, falling back to table parsing'
        );
      }
    }

    // Fallback: parse table rows
    const rows = document.querySelectorAll('.exchange__widget-inner tbody tr');
    const rawData = [];

    rows.forEach((row) => {
      const currencyEl = row.querySelector('td strong');
      const bidEl = row.querySelector('td:nth-child(2)');
      const sellEl = row.querySelector('td:nth-child(3)');

      if (!currencyEl || !bidEl || !sellEl) return;

      const currencyPair = currencyEl.textContent.trim();
      const bid = bidEl.textContent.trim();
      const sell = sellEl.textContent.trim();

      // Extract currency code (e.g., "USD" from "USD/UAH")
      const match = currencyPair.match(/^([A-Z]{3})\//);
      if (match) {
        rawData.push({
          code: match[1].toLowerCase(),
          bid: bid.replace(',', '.'),
          sell: sell.replace(',', '.'),
        });
      }
    });

    return {
      rawData,
      source: 'table',
      updated: new Date().toISOString(),
    };
  });

  if (!pageRates?.rawData || !Array.isArray(pageRates.rawData)) {
    throw new Error('Invalid data structure from XChange worker');
  }

  let formattedRate;

  if (pageRates.source === 'json') {
    // Process JSON data
    formattedRate = pageRates.rawData
      .map((item) => {
        const { code_currency, buy, sell } = item;

        // Skip UAH pairs and unsupported currencies
        if (code_currency === '980' || !CURRENCY_CODE_MAP[code_currency]) {
          return null;
        }

        const currencyCode = CURRENCY_CODE_MAP[code_currency];
        const bidValue = getNumber(buy);
        const sellValue = getNumber(sell);

        if (isNaN(bidValue) || isNaN(sellValue)) {
          return null;
        }

        return {
          code: currencyCode.toLowerCase(),
          bid: bidValue,
          sell: sellValue,
          updated: new Date().toISOString(),
        };
      })
      .filter(Boolean);
  } else {
    // Process table data
    formattedRate = pageRates.rawData
      .map(({ code, bid, sell }) => {
        const bidValue = getNumber(bid);
        const sellValue = getNumber(sell);

        if (isNaN(bidValue) || isNaN(sellValue)) {
          return null;
        }

        return {
          code: code.toLowerCase(),
          bid: bidValue,
          sell: sellValue,
          updated: new Date().toISOString(),
        };
      })
      .filter(Boolean);
  }

  return formattedRate;
};

export const xchangeWorker = withBrowser(XChangeWorkerCore);
