import cron from 'node-cron';
import { fetchRawRatesFromSources } from './fetchRates.js';
import { LOG_INFO, logger } from '../utils/logger.js';
import { sendRateMessage } from './sendRateMessage.js';

export const startSendTelegramMessage = () => {
  const isProd = process.env.NODE_ENV !== 'development';

  // Development environment
  cron.schedule('30 */2 * * *', async () => {
    logger(null, 'Rate fetching cron job triggered (dev)', LOG_INFO);
    await fetchRawRatesFromSources();
    await sendRateMessage();
  });

  setTimeout(
    async () => {
      await sendRateMessage();
    },
    isProd ? 5000 : 3600000
  ); // 1 hour
};
