import db from '../models/index.js';
import { sendRateUpdateMessage } from '../helpers/sendRateMessage.js';
import { processRateCalculations } from '../utils/rateProcessor.js';
import { findUserRateById } from '../query/userRateQueries.js';
import {
  CURRENCY_CONFIGS_INCLUDE,
  TELEGRAM_INCLUDE,
} from '../query/includes.js';
import { LOG_ERROR, logger } from '../utils/logger.js';
import { findRateSourceById } from '../query/rateSourceQueries.js';
import { findAllRateSourceData } from '../query/rateSourceDataQueries.js';

export const userRateUpdateHook = async (rateInstance, options) => {
  try {
    const transaction = options.transaction;
    const rateId = rateInstance.id;
    const rateSourceId = rateInstance.rateSourceId;

    const rateSource = await findRateSourceById(rateSourceId, [], transaction);

    const rate = await findUserRateById(
      rateId,
      [CURRENCY_CONFIGS_INCLUDE, TELEGRAM_INCLUDE],
      transaction
    );

    const prevUpdatedAt = rate.prevUpdatedAt;
    const newUpdatedAt = rate.newUpdatedAt;

    const rateSourceData = await findAllRateSourceData(
      {
        rateSourceId,
        fetchedAt: rateSource?.newUpdatedAt,
      },
      [],
      transaction
    );

    if (rateSourceData.length === 0) {
      return;
    }

    const {
      rateHasChanges,
      newCalculatedRates,
      previousCalculatedRates,
      calculatedRatesPromises,
    } = await processRateCalculations(
      rate,
      rateSourceData,
      prevUpdatedAt,
      newUpdatedAt,
      transaction
    );

    if (rateHasChanges) {
      const rateData = {
        rate,
        newRate: newCalculatedRates,
        prevRate: previousCalculatedRates,
      };

      await db.UserRate.update(
        { newUpdatedAt },
        {
          where: {
            id: rateId,
          },
          transaction,
        }
      );
      await Promise.all([
        ...calculatedRatesPromises,
        sendRateUpdateMessage(rateData),
      ]);
    }
  } catch (error) {
    logger(error, 'Failed to load: processRateUpdateHook', LOG_ERROR);
  }
};
