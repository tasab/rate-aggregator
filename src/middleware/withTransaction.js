import db from '../models/index.js';

export const withTransaction = (handler) => {
  return async (req, res, next) => {
    const transaction = await db.sequelize.transaction();
    req.transaction = transaction;

    try {
      await handler(req, res, next);
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.log('Failed - withTransaction', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};
