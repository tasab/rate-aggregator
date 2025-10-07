import { LOG_ERROR, logger } from '../../utils/logger.js';
import { USER_RATE } from '../../constants/rateTypes.js';
import { getUserRate } from '../../helpers/getUserRate.js';
import { getSourceRate } from '../../helpers/getSourceRate.js';

export const getSharedRate = async (req, res) => {
  try {
    const { rateId } = req.params;
    const { rateType } = req.query;

    if (!rateId) {
      return res.status(404).send({ error: 'Rate ID is required' });
    }
    if (!rateType) {
      return res.status(404).send({ error: 'Rate TYPE is required' });
    }
    let rateRes = null;
    if (rateType === USER_RATE) {
      rateRes = await getUserRate(rateId, req.transaction);
    } else {
      rateRes = await getSourceRate(rateId, req.transaction);
    }

    res.json({
      rates: rateRes?.currencyRates,
      rateInfo: {
        name: rateRes?.rateInfo?.name,
        link: rateRes?.rateInfo?.link,
        location: rateRes?.rateInfo?.location,
        newUpdatedAt: rateRes?.rateInfo?.newUpdatedAt,
      },
    });
  } catch (error) {
    logger(error, 'Failed to load: getRateSourceById', LOG_ERROR);
    return res.status(500).send({ error: 'Internal server error' });
  }
};
