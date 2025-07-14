import cron from 'node-cron';
import { fetchRawRatesFromSources } from './fetchRates.js';

export function startScheduler() {
  // Запускаємо кожні 30 хвилин
  cron.schedule('*/30 * * * *', async () => {
    console.log('⏰ Rate fetching cron job triggered');
    await fetchRawRatesFromSources();
  });

  // Запускаємо один раз при старті сервера
  console.log('🎯 Running initial rate fetch...');
  setTimeout(fetchRawRatesFromSources, 5000); // через 5 секунд після старту
}
