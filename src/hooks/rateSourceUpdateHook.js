import db from '../models/index.js';
import { LOG_SUCCESS, logger } from '../utils/logger.js';
import { sendRateUpdateMessage } from '../helpers/sendRateMessage.js';
import { processRateCalculations } from '../utils/rateProcessor.js';
import { findAllUserRates } from '../query/userRateQueries.js';
import {
  CURRENCY_CONFIGS_INCLUDE,
  TELEGRAM_INCLUDE,
} from '../query/includes.js';
import { findAllRateSourceData } from '../query/rateSourceDataQueries.js';
import { isWithinWorkingHours } from '../utils/dateUtils.js';

export const rateSourceUpdateHook = async (rateSourceInstance, options) => {
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

  // find all rates related to the updated rate source
  const allRates = await findAllUserRates(
    { rateSourceId },
    [CURRENCY_CONFIGS_INCLUDE, TELEGRAM_INCLUDE],
    transaction
  );

  // filter by working hours
  const ratesInWorkingHours = allRates.filter((rate) => {
    return isWithinWorkingHours(rate.startWorkingTime, rate.endWorkingTime);
  });

  // find last rate source data (last fetched rates)
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

  for (const rate of ratesInWorkingHours) {
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
      return db.UserRate.update(
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
