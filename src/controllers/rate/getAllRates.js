import { LOG_ERROR, logger } from '../../utils/logger.js';
import { findAllUserRates } from '../../query/userRateQueries.js';
import {
  CURRENCY_CONFIGS_INCLUDE,
  RATE_SOURCE_INCLUDE,
} from '../../query/includes.js';

export const getAllRates = async (req, res) => {
  try {
    const userId = req.user?.id || req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const rates = await findAllUserRates({ userId }, [
      CURRENCY_CONFIGS_INCLUDE,
      RATE_SOURCE_INCLUDE,
    ]);

    res.status(200).json(rates);
  } catch (error) {
    logger(error, 'Failed to load: getAllRates', LOG_ERROR);
    res.status(500).json({ message: 'Internal server error' });
  }
};
