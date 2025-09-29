import db from '../models/index.js';
import { getRateSourceController } from '../utils/getRateSourceController.js';
import { LOG_ERROR, logger } from '../utils/logger.js';
import { findAllRateSources } from '../query/rateSourceQueries.js';

export const fetchRawRatesFromSources = async () => {
  try {
    const rateSources = await findAllRateSources({
      link: { [db.Sequelize.Op.ne]: null },
    });

    for (const source of rateSources) {
      try {
        await fetchFromSingleSource(source);
      } catch (error) {
        logger(error, `Error fetching from ${source.name}:`, LOG_ERROR);
      }
    }
  } catch (error) {
    logger(error, 'Fatal error in rate fetching job:', LOG_ERROR);
  }
};

const fetchFromSingleSource = async (rateSource) => {
  const transaction = await db.sequelize.transaction();

  try {
    const controller = getRateSourceController(rateSource.controllerType);

    if (!controller) {
      throw new Error(`No controller found for type: ${rateSource.type}`);
    }

    const rates = await controller(rateSource);

    if (!rates || !Array.isArray(rates)) {
      throw new Error('No valid rates array received from controller');
    }

    const processAt = new Date();

    await saveRatesToDatabase(rateSource.id, rates, processAt, transaction);

    await rateSource.update(
      {
        newUpdatedAt: processAt,
        prevUpdatedAt: rateSource.newUpdatedAt,
      },
      { transaction }
    );

    await transaction.commit();
  } catch (error) {
    logger(error, `Failed to load: fetchFromSingleSource`, LOG_ERROR);
    await transaction.rollback();
    throw error;
  }
};

const saveRatesToDatabase = async (
  rateSourceId,
  rates,
  fetchedAt,
  transaction
) => {
  const dataToInsert = [];

  for (const rateData of rates) {
    dataToInsert.push({
      rateSourceId,
      code: rateData.code,
      bid: rateData.bid,
      sell: rateData.sell,
      fetchedAt,
    });
  }

  await db.RateSourceData.bulkCreate(dataToInsert, {
    ignoreDuplicates: true,
    transaction,
  });
};
