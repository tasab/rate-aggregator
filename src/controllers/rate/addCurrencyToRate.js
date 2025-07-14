import db from '../../models/index.js';

export const addCurrencyToRate = async (req, res) => {
  try {
    const { rateId, currencyIds } = req.body;
    if (!currencyIds?.length) {
      return res.status(404).json({ message: 'Provide currency ids' });
    }

    const rate = await db.Rate.findOne({
      where: { id: rateId },
      include: [
        {
          model: db.Currency,
          as: 'currencies',
          through: { attributes: [] },
        },
      ],
    });
    if (!rate) {
      return res.status(404).json({ message: 'Rate not found' });
    }
    const addedCurrencies = await rate.addCurrencies(currencyIds);
    res.status(201).json(addedCurrencies);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
