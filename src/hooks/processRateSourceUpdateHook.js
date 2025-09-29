import db from '../models/index.js';
import { LOG_SUCCESS, logger } from '../utils/logger.js';
import { sendRateUpdateMessage } from '../helpers/sendRateMessage.js';
import { processRateCalculations } from '../utils/rateProcessor.js';
import { findAllRates } from '../query/rateQueries.js';
import { CURRENCY_CONFIGS_INCLUDE } from '../query/includes.js';
import { findAllRateSourceData } from '../query/rateSourceDataQueries.js';

export const processRateSourceUpdateHook = async (
  rateSourceInstance,
  options
) => {
  if (
    !rateSourceInstance.changed('newUpdatedAt') ||
    !rateSourceInstance.newUpdatedAt
  ) {
    return;
  }

  const transaction = options.transaction;
  const rateSourceId = rateSourceInstance?.id;
  const processRatesAt = new Date();
  const rateSourceUpdatedAt = rateSourceInstance?.newUpdatedAt;

  const rates = await findAllRates(
    { rateSourceId },
    [CURRENCY_CONFIGS_INCLUDE],
    transaction
  );

  const rateSourceData = await findAllRateSourceData(
    {
      rateSourceId,
      fetchedAt: rateSourceUpdatedAt,
    },
    [],
    transaction
  );

  if (rateSourceData.length === 0) {
    return;
  }

  const allCalculatedRatesPromises = [];
  const ratesToUpdate = new Map();
  const ratesData = [];

  for (const rate of rates) {
    const {
      rateHasChanges,
      newCalculatedRates,
      previousCalculatedRates,
      calculatedRatesPromises,
    } = await processRateCalculations(
      rate,
      rateSourceData,
      rate.newUpdatedAt,
      processRatesAt,
      transaction
    );

    if (rateHasChanges) {
      ratesToUpdate.set(rate.id, rate.newUpdatedAt);
      allCalculatedRatesPromises.push(...calculatedRatesPromises);

      ratesData.push({
        rate,
        newRate: newCalculatedRates,
        prevRate: previousCalculatedRates,
      });
    }
  }

  const sendTgMessagePromises = ratesData.map((rateConfig) =>
    sendRateUpdateMessage(rateConfig)
  );
  const ratesToUpdatePromises = Array.from(ratesToUpdate).map(
    ([rateId, prevUpdatedAt]) => {
      return db.Rate.update(
        {
          newUpdatedAt: processRatesAt,
          prevUpdatedAt,
        },
        {
          where: {
            id: rateId,
          },
          transaction,
        }
      );
    }
  );

  await Promise.all(allCalculatedRatesPromises);
  await Promise.all(sendTgMessagePromises);
  await Promise.all(ratesToUpdatePromises);

  logger(
    null,
    `Processed ${allCalculatedRatesPromises.length} calculated rates for rate source ${rateSourceInstance.id}`,
    LOG_SUCCESS
  );
};
