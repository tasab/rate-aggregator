import { logger } from '../../utils/logger.js';
import { findUserRateById } from '../../query/userRateQueries.js';
import { findAllCalculatedRates } from '../../query/calculatedRateQueries.js';

export const getCalculatedRate = async (req, res) => {
  try {
    const rateId = req.params?.rateId;
    const transaction = req.transaction;

    if (!rateId) {
      return res.status(400).json({ message: 'rateId is required' });
    }

    const rate = await findUserRateById(rateId, [], transaction);

    const prevRatesInstances = await findAllCalculatedRates(
      { calculatedAt: rate?.prevUpdatedAt },
      [],
      transaction
    );
    // console.log(prevRatesInstances, 'prevRatesInstances1');

    const newRatesInstances = await findAllCalculatedRates(
      { calculatedAt: rate?.newUpdatedAt },
      [],
      transaction
    );

    const prevRates = prevRatesInstances.map((rate) => rate.toJSON());
    const newRates = newRatesInstances.map((rate) => rate.toJSON());

    if (!newRates.length) {
      return res.status(404).json({ message: 'Current rates not found' });
    }

    if (!rate) {
      return res.status(404).json({ message: 'Rate not found' });
    }

    const calculatedRates = newRates.map((item) => ({
      ...item,
      prev: prevRates.length
        ? prevRates.find((prevItem) => prevItem.code === item.code)
        : null,
    }));

    return res.status(200).json({
      rate,
      calculatedRates,
    });
  } catch (error) {
    logger(error, 'Failed to load: getCalculatedRate', logger.ERROR);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
