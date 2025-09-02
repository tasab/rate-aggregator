import cron from 'node-cron';
import { fetchRawRatesFromSources } from './fetchRates.js';
import { LOG_INFO, logger } from '../utils/logger.js';

export const startScheduler = () => {
  // Запускаємо кожні 30 хвилин
  cron.schedule('30 */2 * * *', async () => {
    logger(null, 'Rate fetching cron job triggered', LOG_INFO);
    await fetchRawRatesFromSources();
  });

  setTimeout(fetchRawRatesFromSources, 5000); // через 5 секунд після старту
};
