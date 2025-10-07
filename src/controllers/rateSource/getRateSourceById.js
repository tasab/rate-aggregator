import { LOG_ERROR, logger } from '../../utils/logger.js';
import { getSourceRate } from '../../helpers/getSourceRate.js';

export const getRateSourceById = async (req, res) => {
  try {
    const { id: rateSourceId } = req.params;
    if (!rateSourceId) {
      return res.status(404).send({ error: 'Rate Source ID is required' });
    }
    const { rateInfo, currencyRates } = await getSourceRate(
      rateSourceId,
      req.transaction
    );

    return res.status(200).send({
      rate: currencyRates,
      rateSource: rateInfo,
    });
  } catch (error) {
    logger(error, 'Failed to load: getRateSourceById', LOG_ERROR);
    return res.status(500).send({ error: 'Internal server error' });
  }
};
