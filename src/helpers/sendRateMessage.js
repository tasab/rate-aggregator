import { LOG_ERROR, LOG_SUCCESS, logger } from '../utils/logger.js';
import TelegramBot from 'node-telegram-bot-api';
import { parseRate } from '../utils/rateUtils.js';
import RATE_EMOJI from '../constants/rateEmoji.js';
import { findAllRatesToTelegramMessage } from '../query/findAllRatesToTelegramMessage.js';
import { getLatestRateSourceData } from '../query/getLatestRateSourceData.js';

const getCurrencyEmoji = (currencyCode) => {
  return RATE_EMOJI?.[currencyCode?.toLowerCase()] || '💱';
};

export const sendRateMessage = async () => {
  try {
    const rates = await findAllRatesToTelegramMessage();

    for (const rate of rates) {
      try {
        await sendSingleRateMessage(rate);
      } catch (error) {
        logger(
          error,
          `Error sending telegram message for rate ${rate.id}:`,
          LOG_ERROR
        );
      }
    }
  } catch (error) {
    logger(error, 'Fatal error in telegram rate notifications:', LOG_ERROR);
  }
};

const sendSingleRateMessage = async (rate) => {
  const bot = new TelegramBot(rate.telegramBotToken);

  const enrichedRateSourceData = await getLatestRateSourceData(
    rate?.rateSource?.id
  );

  if (!enrichedRateSourceData || enrichedRateSourceData.length === 0) {
    throw new Error(
      `No rate data found for rate source ${rate.rateSource?.id}`
    );
  }

  const rateMessages = [];

  for (const currencyConfig of rate.currencyConfigs) {
    const currency = currencyConfig.currency;

    const rateData = enrichedRateSourceData.find((data) => {
      return (
        data?.currency_code?.toLowerCase() === currency?.code?.toLowerCase()
      );
    });

    if (rateData && currencyConfig) {
      const calculatedRate = parseRate(
        {
          bid: rateData.bid_rate,
          sell: rateData.sell_rate,
          updated: rateData.fetched_at,
        },
        currencyConfig
      );

      const emojiFlag = getCurrencyEmoji(currency?.code?.toLowerCase());
      const currencyCode = currency.code.toUpperCase();
      const buy =
        parseFloat(calculatedRate.bid?.toFixed(2))?.toString() || 'N/A';
      const sell =
        parseFloat(calculatedRate.sell?.toFixed(2))?.toString() || 'N/A';

      rateMessages.push(`${emojiFlag} ${currencyCode}: ${buy} - ${sell}`);
    }
  }

  if (rateMessages.length === 0) {
    throw new Error(`No valid rate data found for rate ${rate.id}`);
  }

  let message = '';

  if (rate.telegramMessageHeader) {
    message += `${rate.telegramMessageHeader}\n\n`;
  }

  message += rateMessages.join('\n');

  if (rate.telegramMessageFooter) {
    message += `\n\n${rate.telegramMessageFooter}`;
  }

  await bot.sendMessage(rate.telegramChatId, message);

  logger(
    null,
    `Telegram message sent successfully for rate ${rate.id} to chat ${rate.telegramChatId}`,
    LOG_SUCCESS
  );
};
