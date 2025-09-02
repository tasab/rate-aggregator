import db from '../../models/index.js';
import { LOG_ERROR, logger } from '../../utils/logger.js';

export const getAllCurrencies = async (req, res) => {
  try {
    const currencies = await db.Currency.findAll();
    return res.status(200).json(currencies);
  } catch (error) {
    logger(error, 'Failed to load: getAllCurrencies', LOG_ERROR);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
