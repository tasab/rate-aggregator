import db from '../../models/index.js';

export const getRateSourceOrdersByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const rateSourceOrders = await db.RateSourceOrder.findAll({
      where: { userId },
      include: [
        {
          association: 'rateSource', // Include associated RateSource if needed
        },
      ],
    });

    return res.status(200).json(rateSourceOrders);
  } catch (error) {
    console.error('Error fetching RateSourceOrders:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};
