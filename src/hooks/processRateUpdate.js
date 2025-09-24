import { parseRate } from '../utils/rateUtils.js';

export const processRateUpdate = async (rate, options) => {
  // Only trigger if lastUpdatedAt was changed
  if (!rate.changed('lastUpdatedAt')) {
    return;
  }

  const transaction = options.transaction;
  const rateId = rate.id;
  const sequelize = rate.sequelize;
  let hasChanges = false; // Track if any calculated rates changed

  try {
    const {
      Rate,
      RateCurrencyConfig,
      Currency,
      RateSourceData,
      CalculatedRate,
    } = sequelize.models;

    // Get active currency configs for this rate
    const currencyConfigs = await RateCurrencyConfig.findAll({
      where: {
        rateId,
      },
      include: [
        {
          model: Currency,
          as: 'currency',
        },
      ],
      transaction,
    });

    if (!currencyConfigs || currencyConfigs.length === 0) {
      return;
    }

    // Get the rate record to access rateSourceId
    const rateRecord = await Rate.findByPk(rateId, { transaction });
    if (!rateRecord) {
      return;
    }

    // Get the latest source data for each currency
    const latestSourceDataMap = new Map();

    for (const config of currencyConfigs) {
      const latestSourceData = await RateSourceData.findOne({
        where: {
          rateSourceId: rateRecord.rateSourceId,
          currencyCode: config.currency.code,
        },
        order: [['createdAt', 'DESC']],
        transaction,
      });

      if (latestSourceData) {
        latestSourceDataMap.set(config.currency.code, latestSourceData);
      }
    }

    // Process each currency config
    for (const config of currencyConfigs) {
      const currency = config.currency;
      const sourceData = latestSourceDataMap.get(currency.code);

      if (!sourceData) {
        continue;
      }

      // Parse rate using existing utility
      const sourceRate = {
        bid: sourceData.bidRate,
        sell: sourceData.sellRate,
      };

      const calculatedRates = parseRate(sourceRate, config);

      // Check if existing calculated rate is different
      const existingCalculatedRate = await CalculatedRate.findOne({
        where: {
          rateId,
          currencyCode: currency.code,
        },
        transaction,
      });

      const shouldCreate =
        !existingCalculatedRate ||
        parseFloat(existingCalculatedRate.bidRate) !== calculatedRates.bid ||
        parseFloat(existingCalculatedRate.sellRate) !== calculatedRates.sell ||
        existingCalculatedRate.sourceRateDataId !== sourceData.id;

      if (shouldCreate) {
        await CalculatedRate.upsert(
          {
            rateId,
            currencyCode: currency.code,
            bidRate: calculatedRates.bid,
            sellRate: calculatedRates.sell,
            sourceRateDataId: sourceData.id,
            calculatedAt: new Date(),
          },
          {
            transaction,
            conflictFields: ['rate_id', 'currency_code'],
          }
        );

        hasChanges = true; // Mark that we have changes
      }
    }

    // Send notification only if there were actual changes
    if (hasChanges) {
      // Execute after transaction commits to ensure data consistency
      if (transaction) {
        transaction.afterCommit(async () => {
          try {
            console.log(`Sending notification for rate ${rateId}`);
          } catch (error) {
            console.error(
              `Failed to send notification for rate ${rateId}:`,
              error
            );
          }
        });
      } else {
        // If no transaction, send immediately
        console.log(`Sending notification for rate - no trans ${rateId}`);
      }
    }
  } catch (error) {
    console.error(`Failed to recalculate rates for rate ${rateId}:`, error);
    // Don't throw the error to prevent the main update from failing
  }
};
