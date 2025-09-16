import db from '../models/index.js';
import { getRateSourceController } from '../utils/getRateSourceController.js';
import { LOG_ERROR, logger } from '../utils/logger.js';

export const fetchRawRatesFromSources = async () => {
  try {
    const rateSources = await db.RateSource.findAll({
      where: {
        link: { [db.Sequelize.Op.ne]: null },
      },
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
  const controller = getRateSourceController(rateSource.controllerType);

  if (!controller) {
    throw new Error(`No controller found for type: ${rateSource.type}`);
  }

  const rates = await controller(rateSource);

  if (!rates || !Array.isArray(rates)) {
    throw new Error('No valid rates array received from controller');
  }

  await saveRatesToDatabase(rateSource.id, rates);
};

const saveRatesToDatabase = async (rateSourceId, rates) => {
  const fetchedAt = new Date();
  const dataToInsert = [];

  for (const rateData of rates) {
    dataToInsert.push({
      rateSourceId,
      currencyCode: rateData.code,
      bidRate: rateData.bid,
      sellRate: rateData.sell,
      fetchedAt,
      rawData: JSON.stringify(rateData),
      createdAt: fetchedAt,
      updatedAt: fetchedAt,
    });
  }

  await db.RateSourceData.bulkCreate(dataToInsert, {
    ignoreDuplicates: true,
  });
};
