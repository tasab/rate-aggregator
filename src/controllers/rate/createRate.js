import { withTransaction } from '../../middleware/withTransaction.js';
import db from '../../models/index.js';

export const createRate = withTransaction(async (req, res) => {
  const transaction = req.transaction;
  const {
    name,
    rateSourceId,
    currencyConfigs,
    isPrivateRate,
    telegramChatId,
    telegramBotToken,
    telegramNotificationsEnabled,
    telegramMessageHeader,
    telegramMessageFooter,
    startWorkingTime,
    endWorkingTime,
  } = req.body;
  const userId = req?.user?.id;

  const rate = await db.Rate.create(
    {
      name,
      userId,
      rateSourceId,
      isPrivateRate,
      telegramChatId,
      telegramBotToken,
      telegramMessageHeader,
      telegramMessageFooter,
      telegramNotificationsEnabled,
      startWorkingTime,
      endWorkingTime,
    },
    { transaction }
  );

  for (const item of currencyConfigs) {
    const {
      id,
      effectiveFrom,
      effectiveTo,
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
        effectiveFrom: effectiveFrom || new Date().toDateString(),
        effectiveTo: effectiveTo || null,
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

  res.status(201).json(rate);
});
