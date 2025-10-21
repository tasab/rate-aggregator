import { withTransaction } from '../../middleware/withTransaction.js';
import db from '../../models/index.js';
import { findUserRateById } from '../../query/userRateQueries.js';

export const updateRate = withTransaction(async (req, res) => {
  const {
    id,
    name,
    rateSourceId,
    currencyConfigs,
    isPrivateRate,
    telegramConfig,
    startWorkingTime,
    endWorkingTime,
  } = req.body;
  const transaction = req.transaction;

  if (!id) {
    return res.status(400).json({ error: 'Rate ID is required' });
  }
  const existingRate = await findUserRateById(id, [], transaction);
  const newUpdatedAt = new Date();

  if (!existingRate) {
    return res.status(404).json({ error: 'Rate not found' });
  }

  if (telegramConfig) {
    const {
      chatId,
      botToken,
      notificationsEnabled,
      enableTrend,
      messageHeader,
      messageFooter,
    } = telegramConfig;

    await db.TelegramConfig.destroy({
      where: { rateId: id },
      transaction,
    });

    await db.TelegramConfig.create(
      {
        rateId: id,
        botToken: botToken || '',
        chatId: chatId || '',
        messageHeader: messageHeader || null,
        messageFooter: messageFooter || null,
        notificationsEnabled: notificationsEnabled ?? false,
        enableTrend: enableTrend ?? false,
        isConnected: false,
      },
      { transaction }
    );
  }

  if (currencyConfigs && currencyConfigs.length > 0) {
    await db.RateCurrencyConfig.destroy({
      where: { rateId: id },
      transaction,
    });

    for (const item of currencyConfigs) {
      const {
        id: currencyId,
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

  await existingRate.update(
    {
      name,
      rateSourceId,
      isPrivateRate,
      startWorkingTime,
      endWorkingTime,
      newUpdatedAt,
      prevUpdatedAt: existingRate?.newUpdatedAt,
    },
    { transaction }
  );

  res.status(200).json(existingRate);
});
