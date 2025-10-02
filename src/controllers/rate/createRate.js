import { withTransaction } from '../../middleware/withTransaction.js';
import db from '../../models/index.js';
import { processRateCalculations } from '../../utils/rateProcessor.js';
import { findAllRateSourceData } from '../../query/rateSourceDataQueries.js';
import { findRateSourceById } from '../../query/rateSourceQueries.js';
import { sendRateUpdateMessage } from '../../helpers/sendRateMessage.js';
import { findUserRateById } from '../../query/userRateQueries.js';
import { CURRENCY_CONFIGS_INCLUDE } from '../../query/includes.js';

export const createRate = withTransaction(async (req, res) => {
  const transaction = req.transaction;
  const {
    name,
    rateSourceId,
    currencyConfigs,
    isPrivateRate,
    startWorkingTime,
    endWorkingTime,
    telegramConfig,
  } = req.body;
  const processDate = new Date();
  const rateSource = await findRateSourceById(rateSourceId, [], transaction);
  const rateSourceData = await findAllRateSourceData(
    {
      rateSourceId,
      fetchedAt: rateSource?.newUpdatedAt,
    },
    [],
    transaction
  );
  const userId = req?.user?.id;

  const rate = await db.UserRate.create(
    {
      name,
      userId,
      rateSourceId,
      isPrivateRate,
      startWorkingTime,
      endWorkingTime,
      prevUpdatedAt: processDate,
      newUpdatedAt: processDate,
    },
    { transaction }
  );

  if (telegramConfig) {
    const {
      chatId,
      botToken,
      notificationsEnabled,
      messageHeader,
      messageFooter,
    } = telegramConfig;

    if (chatId && botToken) {
      await db.TelegramConfig.create(
        {
          rateId: rate.id,
          botToken,
          chatId,
          messageHeader: messageHeader || null,
          messageFooter: messageFooter || null,
          notificationsEnabled: notificationsEnabled ?? false,
          isConnected: false,
        },
        { transaction }
      );
    }
  }

  for (const item of currencyConfigs) {
    const {
      id,
      bidMargin,
      bidShouldRound,
      bidRoundingDepth,
      bidRoundingType,
      sellMargin,
      sellShouldRound,
      sellRoundingDepth,
      sellRoundingType,
      order,
    } = item;
    await db.RateCurrencyConfig.create(
      {
        rateId: rate.id,
        currencyId: id,
        bidMargin: bidMargin,
        bidShouldRound: bidShouldRound ?? false,
        bidRoundingDepth: bidRoundingDepth ?? null,
        bidRoundingType: bidRoundingType ?? null,
        sellMargin: sellMargin,
        sellShouldRound: sellShouldRound ?? false,
        sellRoundingDepth: sellRoundingDepth ?? null,
        sellRoundingType: sellRoundingType ?? null,
        order: order ?? null,
      },
      { transaction }
    );
  }
  const rateWithConfigs = await findUserRateById(
    rate.id,
    [CURRENCY_CONFIGS_INCLUDE],
    transaction
  );

  const {
    newCalculatedRates,
    previousCalculatedRates,
    calculatedRatesPromises,
  } = await processRateCalculations(
    rateWithConfigs,
    rateSourceData,
    processDate,
    processDate,
    transaction
  );

  await Promise.all([
    ...calculatedRatesPromises,
    sendRateUpdateMessage({
      rate,
      newRate: newCalculatedRates,
      prevRate: previousCalculatedRates,
    }),
  ]);

  res.status(201).json(rate);
});
