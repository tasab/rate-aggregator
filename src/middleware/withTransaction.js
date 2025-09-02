import db from '../models/index.js';
import { LOG_ERROR, logger } from '../utils/logger.js';

export const withTransaction = (handler) => {
  return async (req, res, next) => {
    const transaction = await db.sequelize.transaction();
    req.transaction = transaction;

    try {
      await handler(req, res, next);
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      logger(error, 'Failed to load: withTransaction', LOG_ERROR);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};
