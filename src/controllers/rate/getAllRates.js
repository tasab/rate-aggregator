import db from '../../models/index.js';
import { LOG_ERROR, logger } from '../../utils/logger.js';

export const getAllRates = async (req, res) => {
  try {
    const userId = req.user?.id || req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const rates = await db.Rate.findAll({
      where: { userId },
      include: [
        {
          model: db.CurrencyRateConfig,
          as: 'currencyConfigs',
          include: [
            {
              model: db.Currency,
              attributes: ['id', 'code'],
              as: 'currency',
            },
          ],
        },
        {
          model: db.RateSource,
          attributes: ['id', 'name', 'type', 'location', 'link'],
          as: 'rateSource',
        },
      ],
      order: [['updatedAt', 'DESC']],
    });

    res.status(200).json(rates);
  } catch (error) {
    logger(error, 'Failed to load: getAllRates', LOG_ERROR);
    res.status(500).json({ message: 'Internal server error' });
  }
};
