import cron from 'node-cron';
import { fetchRawRatesFromSources } from '../helpers/fetchRates.js';

export const startFetchRateSource = () => {
  const isProd = process.env.NODE_ENV !== 'development';
  // jus for testing set '*/5 * * * *, prev was 0 * * * *
  const cronTimer = isProd ? '*/5 * * * *' : '30 */2 * * *';

  cron.schedule(cronTimer, async () => {
    await fetchRawRatesFromSources();
  });
};
