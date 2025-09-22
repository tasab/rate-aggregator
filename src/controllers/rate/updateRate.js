import { withTransaction } from '../../middleware/withTransaction.js';
import db from '../../models/index.js';

export const updateRate = withTransaction(async (req, res) => {
  const {
    id,
    name,
    rateSourceId,
    currencyConfigs,
    isPrivateRate,
    telegramChatId,
    telegramBotToken,
    telegramMessageFooter,
    telegramMessageHeader,
    telegramNotificationsEnabled,
    startWorkingTime,
    endWorkingTime,
  } = req.body;
  const transaction = req.transaction;
  const userId = req?.user?.id;

  if (!id) {
    return res.status(400).json({ error: 'Rate ID is required' });
  }

  const existingRate = await db.Rate.findOne({
    where: { id, userId },
    transaction,
  });

  if (!existingRate) {
    return res.status(404).json({ error: 'Rate not found' });
  }

  await existingRate.update(
    {
      name,
      rateSourceId,
      isPrivateRate,
      telegramChatId,
      telegramBotToken,
      telegramMessageFooter,
      telegramMessageHeader,
      telegramNotificationsEnabled,
      startWorkingTime,
      endWorkingTime,
    },
    { transaction }
  );

  if (currencyConfigs && currencyConfigs.length > 0) {
    await db.RateCurrencyConfig.destroy({
      where: { rateId: id },
      transaction,
    });

    for (const item of currencyConfigs) {
      const {
        id: currencyId,
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
          rateId: existingRate.id,
          currencyId,
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
  }

  res.status(200).json(existingRate);
});
