import { LOG_ERROR, LOG_INFO, LOG_SUCCESS, logger } from '../utils/logger.js';
import RATE_EMOJI from '../constants/rateEmoji.js';
import { getLowerCode, getString, getUpperCode } from '../utils/rateUtils.js';
import TelegramBot from 'node-telegram-bot-api';

const getCurrencyEmoji = (code) => {
  return RATE_EMOJI?.[code?.toLowerCase()] || '💱';
};

const getTrendIcon = (newPrice, prevPrice) => {
  if (newPrice > prevPrice) {
    return '🟩';
  } else if (newPrice < prevPrice) {
    return '🟥';
  }
  return '';
};

export const sendRateUpdateMessage = async (rateData) => {
  const { rate, newRate, prevRate } = rateData;

  try {
    if (!rate?.telegram?.botToken || !rate?.telegram?.chatId) {
      logger(
        null,
        `Rate ${rate.id} doesn't have telegram configuration, skipping`,
        LOG_INFO
      );
      return;
    }

    const bot = new TelegramBot(rate.telegramBotToken);
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

    if (rate?.telegram?.messageHeader) {
      finalMessage += `${rate.telegram.messageHeader}\n`;
    }

    finalMessage += rateMessages.join('\n');

    if (rate?.telegram?.messageFooter) {
      finalMessage += `\n${rate?.telegram?.messageFooter}`;
    }

    await bot.sendMessage(rate.telegramChatId, finalMessage);

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
