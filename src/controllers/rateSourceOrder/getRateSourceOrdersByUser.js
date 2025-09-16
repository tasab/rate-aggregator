import db from '../../models/index.js';
import { LOG_ERROR, logger } from '../../utils/logger.js';

export const getRateSourceOrdersByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const rateSourceOrders = await db.RateSourceOrder.findAll({
      where: { userId },
      include: [
        {
          association: 'rateSource',
        },
      ],
    });

    return res.status(200).json(rateSourceOrders);
  } catch (error) {
    logger(error, 'Error to load getRateSourceOrdersByUser:', LOG_ERROR);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};
