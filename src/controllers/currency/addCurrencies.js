import db from '../../models/index.js';
import { withTransaction } from '../../middleware/withTransaction.js';

export const addCurrencies = withTransaction(async (req, res) => {
  const { currencies } = req.body;
  const { transaction } = req;

  if (!Array.isArray(currencies) || currencies.length === 0) {
    return res
      .status(400)
      .json({ message: 'An array of currencies is required' });
  }

  const createdCurrencies = [];
  const duplicateCurrencies = [];

  for (const currency of currencies) {
    const { code, fullName } = currency;

    if (!code || !fullName) {
      return res.status(400).json({
        message: 'Each currency must have "code" and "fullName"',
      });
    }

    const existingCurrency = await db.Currency.findOne({
      where: { code },
      transaction,
    });

    if (existingCurrency) {
      duplicateCurrencies.push({ code, fullName });
      continue;
    }

    const newCurrency = await db.Currency.create(
      { code, fullName },
      { transaction }
    );

    createdCurrencies.push(newCurrency);
  }

  if (createdCurrencies.length === 0) {
    return res.status(409).json({
      message: 'No currencies were added due to duplicates',
      duplicates: duplicateCurrencies,
    });
  }

  return res.status(201).json({
    message: `${createdCurrencies.length} currencies added successfully`,
    added: createdCurrencies,
    duplicates: duplicateCurrencies,
  });
});
