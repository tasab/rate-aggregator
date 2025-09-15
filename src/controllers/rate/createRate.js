import { withTransaction } from '../../middleware/withTransaction.js';
import db from '../../models/index.js';

export const createRate = withTransaction(async (req, res) => {
  const {
    name,
    rateSourceId,
    currencies,
    isPrivateRate,
    telegramChatId,
    telegramBotToken,
    telegramNotificationsEnabled,
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
      telegramNotificationsEnabled,
    },
    { transaction: req.transaction }
  );

  const currencyIds = currencies.map((c) => c.id);

  await rate.addCurrencies(currencyIds, { transaction: req.transaction });
  for (const item of currencies) {
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
    } = item;
    await db.CurrencyRateConfig.create(
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
      },
      { transaction: req.transaction }
    );
  }

  res.status(201).json(rate);
});
