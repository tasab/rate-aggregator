import db from '../../models/index.js';

export const getAllCurrencies = async (req, res) => {
  try {
    const currencies = await db.Currency.findAll();
    return res.status(200).json(currencies);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
