import db from '../../models/index.js';
import { withTransaction } from '../../middleware/withTransaction.js';

export const updateCurrency = withTransaction(async (req, res) => {
  const { id } = req.params; // Currency ID from the URL
  const { code, fullName } = req.body; // Fields to update
  const { transaction } = req; // Transaction object from middleware

  if (!code && !fullName) {
    return res
      .status(400)
      .json({ message: 'code or fullName must be provided to update' });
  }

  // Find the currency by ID
  const currency = await db.Currency.findByPk(id, { transaction });

  if (!currency) {
    return res.status(404).json({ message: 'Currency not found' });
  }

  // Check if the code is being updated and already exists in another record
  if (code && code !== currency.code) {
    const existingCurrency = await db.Currency.findOne({
      where: { code },
      transaction,
    });

    if (existingCurrency) {
      return res
        .status(409)
        .json({ message: 'A currency with this code already exists' });
    }
  }

  // Update the currency fields
  if (code) currency.code = code;
  if (fullName) currency.fullName = fullName;

  // Save the updated currency
  await currency.save({ transaction });

  return res.status(200).json(currency); // Return the updated currency
});
