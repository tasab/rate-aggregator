import db from '../../models/index.js';
import { withTransaction } from '../../middleware/withTransaction.js';
import { LOG_ERROR, logger } from '../../utils/logger.js';

export const createRateSourceOrder = withTransaction(async (req, res) => {
  const {
    name,
    status = 'PENDING',
    city,
    link,
    phoneNumber,
    description,
  } = req.body;
  const userId = req?.user?.id;

  if (!name || !city || !link) {
    return res.status(400).json({
      error: 'Name, city, link are required',
    });
  }

  const { transaction } = req;

  try {
    const rateSourceOrder = await db.RateSourceOrder.create(
      {
        name,
        status,
        userId,
        city,
        link, // Optional, can be null
        phoneNumber, // Optional, can be null
        description, // Optional, can be null
      },
      { transaction }
    );

    return res.status(201).json({
      message: 'RateSourceOrder created successfully',
      rateSourceOrder,
    });
  } catch (error) {
    logger(error, 'Failed load createRateSourceOrder:', LOG_ERROR);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
