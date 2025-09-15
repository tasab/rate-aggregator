import { LOG_ERROR, LOG_INFO, LOG_SUCCESS, logger } from '../utils/logger.js';
import db from '../models/index.js';
import TelegramBot from 'node-telegram-bot-api';
import { getLatestSourceData } from '../helpers/getLatestSourceData.js';
import { parseRate } from '../utils/rateUtils.js';
import RATE_EMOJI from '../constants/rateEmoji.js';

const getCurrencyEmoji = (currencyCode) => {
  return RATE_EMOJI?.[currencyCode?.toLowerCase()] || '💱';
};

export const sendRateMessage = async () => {
  try {
    logger(null, 'Starting telegram rate notifications', LOG_INFO);

    // Fetch all rates with telegram settings enabled
    const rates = await db.Rate.findAll({
      where: {
        telegramBotToken: { [db.Sequelize.Op.ne]: null },
        telegramChatId: { [db.Sequelize.Op.ne]: null },
        telegramNotificationsEnabled: true,
      },
      include: [
        {
          model: db.Currency,
          through: { attributes: [] },
          attributes: ['id', 'code', 'fullName'],
          as: 'currencies',
        },
        {
          model: db.CurrencyRateConfig,
          as: 'currencyConfigs',
          include: [
            {
              model: db.Currency,
              attributes: ['id', 'code'],
              as: 'currency',
            },
          ],
        },
        {
          model: db.RateSource,
          attributes: ['id', 'name', 'type', 'location', 'link'],
          as: 'rateSource',
        },
      ],
    });

    logger(
      null,
      `Found ${rates.length} rates with telegram notifications enabled`,
      LOG_INFO
    );

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

    logger(null, 'Telegram rate notifications completed', LOG_SUCCESS);
  } catch (error) {
    logger(error, 'Fatal error in telegram rate notifications:', LOG_ERROR);
  }
};

const sendSingleRateMessage = async (rate) => {
  const bot = new TelegramBot(rate.telegramBotToken);

  // Get latest source data
  const enrichedRateSourceData = await getLatestSourceData(rate.rateSource?.id);

  if (!enrichedRateSourceData || enrichedRateSourceData.length === 0) {
    throw new Error(
      `No rate data found for rate source ${rate.rateSource?.id}`
    );
  }

  // Calculate rates for each currency
  const rateMessages = [];

  for (const currency of rate.currencies) {
    const rateData = enrichedRateSourceData.find((data) => {
      return (
        data?.currency_code?.toLowerCase() === currency?.code?.toLowerCase()
      );
    });

    const rateConfig = rate.currencyConfigs.find(
      (config) => config.currency.code === currency.code
    );

    if (rateData && rateConfig) {
      const calculatedRate = parseRate(
        {
          bid: rateData.bid_rate,
          sell: rateData.sell_rate,
          updated: rateData.fetched_at,
        },
        rateConfig
      );
      console.log(currency, 'currency1');
      const emojiFlag = getCurrencyEmoji(currency?.code?.toLowerCase());
      const currencyCode = currency.code.toUpperCase();
      const buy = calculatedRate.bid?.toFixed(2) || 'N/A';
      const sell = calculatedRate.sell?.toFixed(2) || 'N/A';

      rateMessages.push(`${emojiFlag} ${currencyCode}: ${buy} - ${sell}`);
    }
  }

  if (rateMessages.length === 0) {
    throw new Error(`No valid rate data found for rate ${rate.id}`);
  }

  // Construct full message
  let message = '';

  if (rate.telegramMessageHeader) {
    message += `${rate.telegramMessageHeader}\n\n`;
  }

  message += rateMessages.join('\n');

  if (rate.telegramMessageFooter) {
    message += `\n\n${rate.telegramMessageFooter}`;
  }

  // Send message
  await bot.sendMessage(rate.telegramChatId, message);

  logger(
    null,
    `Telegram message sent successfully for rate ${rate.id} to chat ${rate.telegramChatId}`,
    LOG_SUCCESS
  );
};
