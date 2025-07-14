import db from '../../models/index.js';
import { withTransaction } from '../../middleware/withTransaction.js';

export const createRateSourceOrder = withTransaction(async (req, res) => {
  const {
    name,
    status = 'PENDING', // Default status
    city,
    link,
    phoneNumber,
    description,
  } = req.body;
  const userId = req?.user?.id;

  // Input validation
  if (!name || !city || !link) {
    return res.status(400).json({
      error: 'Name, city, link are required',
    });
  }

  const { transaction } = req;

  try {
    // Create a new RateSourceOrder with the provided data
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
    console.error('Failed to create RateSourceOrder:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
