import cron from 'node-cron';
import { fetchRawRatesFromSources } from '../helpers/fetchRates.js';

export const startFetchRateSource = () => {
  const isProd = process.env.NODE_ENV !== 'development';
  const cronTimer = isProd ? '0 * * * *' : '30 */2 * * *';
  // fetchRawRatesFromSources();

  cron.schedule(cronTimer, async () => {
    await fetchRawRatesFromSources();
  });
};
