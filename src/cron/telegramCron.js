import cron from 'node-cron';
import { sendRateMessage } from '../helpers/sendRateMessage.js';

export const startSendTelegramMessage = () => {
  const isProd = process.env.NODE_ENV !== 'development';
  const cronTimer = isProd ? '0 * * * *' : '30 */2 * * *';

  cron.schedule(cronTimer, async () => {
    await sendRateMessage();
  });
};
