import { withTransaction } from '../../middleware/withTransaction.js';
import db from '../../models/index.js';

export const updateRate = withTransaction(async (req, res) => {
  const { id, name, rateSourceId, currencies } = req.body;
  const userId = req?.user?.id;

  if (!id) {
    return res.status(400).json({ error: 'Rate ID is required' });
  }

  // Find existing rate
  const existingRate = await db.Rate.findOne({
    where: { id, userId },
    transaction: req.transaction,
  });

  if (!existingRate) {
    return res.status(404).json({ error: 'Rate not found' });
  }

  // Update rate basic info
  await existingRate.update(
    { name, rateSourceId },
    { transaction: req.transaction }
  );

  if (currencies && currencies.length > 0) {
    // Remove existing currency associations and configs
    await db.CurrencyRateConfig.destroy({
      where: { rateId: id },
      transaction: req.transaction,
    });

    // Remove currency associations
    await existingRate.setCurrencies([], { transaction: req.transaction });

    // Add new currency associations
    const currencyIds = currencies.map((c) => c.id);
    await existingRate.addCurrencies(currencyIds, {
      transaction: req.transaction,
    });

    // Create new currency rate configs
    for (const item of currencies) {
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
      } = item;

      await db.CurrencyRateConfig.create(
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
        },
        { transaction: req.transaction }
      );
    }
  }

  res.status(200).json(existingRate);
});
