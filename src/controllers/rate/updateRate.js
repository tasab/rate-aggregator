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
    telegram,
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

  if (telegram) {
    const {
      chatId,
      botToken,
      notificationsEnabled,
      messageHeader,
      messageFooter,
    } = telegram;

    const existingTelegramConfig = await db.TelegramConfig.findOne({
      where: { rateId: id },
      transaction,
    });

    if (existingTelegramConfig) {
      // Update existing telegram config
      await existingTelegramConfig.update(
        {
          botToken,
          chatId,
          messageHeader: messageHeader || null,
          messageFooter: messageFooter || null,
          notificationsEnabled: notificationsEnabled ?? false,
        },
        { transaction }
      );
    } else if (chatId && botToken) {
      await db.TelegramConfig.create(
        {
          rateId: id,
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
