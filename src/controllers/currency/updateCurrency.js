import db from '../../models/index.js';
import { withTransaction } from '../../middleware/withTransaction.js';

export const updateCurrency = withTransaction(async (req, res) => {
  const { id } = req.params;
  const { code, fullName } = req.body;
  const { transaction } = req;

  if (!code && !fullName) {
    return res
      .status(400)
      .json({ message: 'code or fullName must be provided to update' });
  }

  const currency = await db.Currency.findByPk(id, { transaction });

  if (!currency) {
    return res.status(404).json({ message: 'Currency not found' });
  }

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

  if (code) currency.code = code;
  if (fullName) currency.fullName = fullName;

  await currency.save({ transaction });

  return res.status(200).json(currency);
});
