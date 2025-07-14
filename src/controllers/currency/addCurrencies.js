import db from '../../models/index.js';
import { withTransaction } from '../../middleware/withTransaction.js';

export const addCurrencies = withTransaction(async (req, res) => {
  const { currencies } = req.body; // Expecting an array of currency objects
  const { transaction } = req; // Transaction object provided by `withTransaction`

  if (!Array.isArray(currencies) || currencies.length === 0) {
    return res
      .status(400)
      .json({ message: 'An array of currencies is required' });
  }

  const createdCurrencies = [];
  const duplicateCurrencies = []; // To track duplicate entries

  // Iterate through the array of currencies
  for (const currency of currencies) {
    const { code, fullName } = currency;

    // Validate each currency object
    if (!code || !fullName) {
      return res.status(400).json({
        message: 'Each currency must have "code" and "fullName"',
      });
    }

    // Check if a currency with the same code already exists
    const existingCurrency = await db.Currency.findOne({
      where: { code },
      transaction,
    });

    if (existingCurrency) {
      duplicateCurrencies.push({ code, fullName });
      continue; // Skip this currency but process the others
    }

    // Create the currency within the transaction
    const newCurrency = await db.Currency.create(
      { code, fullName },
      { transaction }
    );
    createdCurrencies.push(newCurrency);
  }

  // If no currencies were created, return a conflict response
  if (createdCurrencies.length === 0) {
    return res.status(409).json({
      message: 'No currencies were added due to duplicates',
      duplicates: duplicateCurrencies,
    });
  }

  // Return created currencies and duplicates (if any)
  return res.status(201).json({
    message: `${createdCurrencies.length} currencies added successfully`,
    added: createdCurrencies,
    duplicates: duplicateCurrencies,
  });
});
