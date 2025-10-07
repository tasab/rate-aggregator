import { logger } from '../../utils/logger.js';
import { getUserRate } from '../../helpers/getUserRate.js';

export const getCalculatedRate = async (req, res) => {
  try {
    const rateId = req.params?.rateId;
    const transaction = req.transaction;

    if (!rateId) {
      return res.status(400).json({ message: 'rateId is required' });
    }
    const rateRes = await getUserRate(rateId, transaction);
    const { rateInfo, currencyRates } = rateRes;

    return res.status(200).json({
      rate: rateInfo,
      calculatedRates: currencyRates,
    });
  } catch (error) {
    logger(error, 'Failed to load: getCalculatedRate', logger.ERROR);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
