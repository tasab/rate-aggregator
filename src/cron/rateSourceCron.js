import cron from 'node-cron';
import { fetchRawRatesFromSources } from './fetchRates.js';
import { LOG_INFO, logger } from '../utils/logger.js';

export const startFetchRateSource = () => {
  const isProd = process.env.NODE_ENV !== 'development';

  // Запускаємо кожні 30 хвилин
  cron.schedule('30 */2 * * *', async () => {
    logger(null, 'Rate fetching cron job triggered', LOG_INFO);
    await fetchRawRatesFromSources();
  });

  setTimeout(fetchRawRatesFromSources, isProd ? 5000 : 3600000); // через 5 секунд після старту
};
