import { withTransaction } from '../../middleware/withTransaction.js';
import db from '../../models/index.js';

export const createRate = withTransaction(async (req, res) => {
  const transaction = req.transaction;
  const {
    name,
    rateSourceId,
    currencyConfigs,
    isPrivateRate,
    startWorkingTime,
    endWorkingTime,
    telegram,
  } = req.body;
  const processDate = new Date();
  const userId = req?.user?.id;

  const rate = await db.Rate.create(
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

  if (telegram) {
    const {
      chatId,
      botToken,
      notificationsEnabled,
      messageHeader,
      messageFooter,
    } = telegram;

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

  res.status(201).json(rate);
});
