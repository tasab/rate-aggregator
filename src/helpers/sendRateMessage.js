import { LOG_ERROR, LOG_INFO, LOG_SUCCESS, logger } from '../utils/logger.js';
import {
  getCurrencyEmoji,
  getLowerCode,
  getString,
  getTrendIcon,
  getUpperCode,
} from '../utils/rateUtils.js';
import TelegramBot from 'node-telegram-bot-api';
import {
  getCurrentUkraineTime,
  isWithinWorkingHours,
} from '../utils/dateUtils.js';

export const sendRateUpdateMessage = async (rateData) => {
  const { rate, newRate, prevRate } = rateData;
  console.log(rate?.telegramConfig, 'rate.telegramConfig');
  try {
    if (
      !rate?.telegramConfig?.botToken ||
      !rate?.telegramConfig?.chatId ||
      !rate?.telegramConfig?.notificationsEnabled
    ) {
      logger(
        null,
        `Rate ${rate.id} doesn't have telegram configuration, skipping`,
        LOG_INFO
      );
      return;
    }

    if (!isWithinWorkingHours(rate.startWorkingTime, rate.endWorkingTime)) {
      const currentTime = getCurrentUkraineTime();
      logger(
        null,
        `Rate ${rate.id} is outside working hours. Current Ukraine time: ${currentTime}, Working hours: ${rate.startWorkingTime} - ${rate.endWorkingTime}`,
        LOG_INFO
      );
      return;
    }

    const bot = new TelegramBot(rate.telegramConfig.botToken);
    const rateMessages = [];

    for (const newRateItem of newRate) {
      const prevRateItem = prevRate.find(
        (prev) => getLowerCode(prev?.code) === getLowerCode(newRateItem?.code)
      );

      const newRateCode = getUpperCode(newRateItem?.code);

      const emojiFlag = getCurrencyEmoji(newRateCode);
      const newBid = getString(newRateItem?.bid) || 'N/A';
      const newSell = getString(newRateItem?.sell) || 'N/A';

      // const prevBuy = getString(prevRateItem?.bid) || 'N/A';
      // const prevSell = getString(prevRateItem?.sell) || 'N/A';

      const bidTrend = getTrendIcon(newRateItem?.bid, prevRateItem?.bid);
      const sellTrend = getTrendIcon(newRateItem?.sell, prevRateItem?.sell);

      let message = `${emojiFlag} ${newRateCode}: ${newBid} ${bidTrend} - ${newSell} ${sellTrend}`;
      // message += `\n   Previous: ${prevBuy} - ${prevSell}`;

      rateMessages.push(message);
    }

    if (rateMessages.length === 0) {
      throw new Error(`No valid rate data found for rate ${rate.id}`);
    }

    let finalMessage = '';

    if (rate?.telegramConfig?.messageHeader) {
      finalMessage += `${rate.telegramConfig.messageHeader}\n`;
    }

    finalMessage += rateMessages.join('\n');

    if (rate?.telegramConfig?.messageFooter) {
      finalMessage += `\n${rate?.telegramConfig?.messageFooter}`;
    }

    await bot.sendMessage(rate.telegramConfig?.chatId, finalMessage);

    logger(
      null,
      `Rate update telegram message sent successfully for rate ${rate.id}`,
      LOG_SUCCESS
    );
  } catch (error) {
    logger(
      error,
      `Error sending rate update telegram message for rate ${rate.id}:`,
      LOG_ERROR
    );
    throw error;
  }
};
