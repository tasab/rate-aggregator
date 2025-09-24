import db from '../models/index.js';
import { parseRate } from '../utils/rateUtils.js';
import { LOG_ERROR, LOG_INFO, LOG_SUCCESS, logger } from '../utils/logger.js';

export const processRateSourceUpdate = async (rateSourceInstance, options) => {
  if (
    !rateSourceInstance.changed('lastProcessedAt') ||
    !rateSourceInstance.lastProcessedAt
  ) {
    return;
  }
  const transaction = options.transaction;
  const rateSourceId = rateSourceInstance?.id;
  const rateSourceLastProcessedAt = rateSourceInstance?.lastProcessedAt;

  try {
    const rateSourceData = await db.RateSourceData.findAll({
      where: {
        rateSourceId,
        fetchedAt: rateSourceLastProcessedAt,
      },
      transaction,
    });

    if (rateSourceData.length === 0) {
      logger(
        null,
        `No rate source data found for rate source ${rateSourceId} at ${rateSourceLastProcessedAt}.`,
        LOG_INFO
      );
      return;
    }

    const rates = await db.Rate.findAll({
      where: { rateSourceId },
      include: [
        {
          model: db.RateCurrencyConfig,
          as: 'currencyConfigs',
          include: [
            {
              model: db.Currency,
              as: 'currency',
            },
          ],
        },
      ],
      transaction,
    });

    const calculatedRatesPromises = [];

    for (const rate of rates) {
      for (const config of rate.currencyConfigs) {
        const sourceData = rateSourceData.find(
          (data) =>
            data?.currencyCode?.toLowerCase() ===
            config?.currency?.code?.toLowerCase()
        );

        if (sourceData) {
          const parsedRate = parseRate(
            {
              bid: sourceData.bidRate,
              sell: sourceData.sellRate,
            },
            config
          );

          const calculatedRatePromise = db.CalculatedRate.upsert(
            {
              rateId: rate.id,
              currencyCode: config.currency.code,
              bidRate: parsedRate?.bid,
              sellRate: parsedRate?.sell,
              sourceRateDataId: sourceData.id,
              calculatedAt: new Date(),
            },
            {
              transaction,
            }
          );

          calculatedRatesPromises.push(calculatedRatePromise);
        }
      }
    }

    await Promise.all(calculatedRatesPromises);

    logger(
      null,
      `Processed ${calculatedRatesPromises.length} calculated rates for rate source ${rateSourceInstance.id}`,
      LOG_SUCCESS
    );
  } catch (error) {
    logger(error, `Failed to load processRateSourceUpdate`, LOG_ERROR);
    throw error;
  }
};
