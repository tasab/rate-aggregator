import { LOG_ERROR, logger } from '../../utils/logger.js';
import { getRateSourceController } from '../../utils/getRateSourceController.js';
import { findRateSourceById } from '../../query/rateSourceQueries.js';

export const getWorkerRate = async (req, res) => {
  try {
    const rateSourceId = req.query?.rateSourceId;

    const rateSource = await findRateSourceById(rateSourceId);
    console.log(rateSource, 'rateSource1');
    if (!rateSource) {
      return res.status(400).json({ error: 'Rate Source not found' });
    }
    const controller = getRateSourceController(rateSource.controllerType);

    if (!controller) {
      return res
        .status(400)
        .json({ error: 'Rate Source controller not found' });
    }
    const rate = await controller(rateSource);

    res.status(200).json(rate);
  } catch (error) {
    logger(error, `Failed to load: getWorkerRate`, LOG_ERROR);
    return res
      .status(500)
      .json({ error: 'Failed to fetch rates from getWorkerRate' });
  }
};
