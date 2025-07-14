import db from '../../models/index.js';
import { Op } from 'sequelize';
import { withTransaction } from '../../middleware/withTransaction.js';

export const updateRateSource = withTransaction(async (req, res) => {
  const { rateSourceId } = req.body; // The ID of the RateSource to update

  const {
    name,
    type,
    location,
    link,
    rateSourceOrderId,
    currencyIds, // Array of currencies to associate (optional)
  } = req.body;

  const { transaction } = req; // Transaction object provided by `withTransaction`

  // Find the RateSource by ID within the transaction
  const rateSource = await db.RateSource.findByPk(rateSourceId);

  if (!rateSource) {
    return res.status(404).send({ message: 'RateSource not found' });
  }

  // Update basic fields within the transaction
  if (name !== undefined) rateSource.name = name;
  if (type !== undefined) rateSource.type = type;
  if (location !== undefined) rateSource.location = location;
  if (link !== undefined) rateSource.link = link;
  if (rateSourceOrderId !== undefined)
    rateSource.rateSourceOrderId = rateSourceOrderId;

  // Save the updated RateSource within the transaction
  await rateSource.save({ transaction });

  // Handle the many-to-many association for availableCurrencies
  if (currencyIds && Array.isArray(currencyIds)) {
    console.log(currencyIds, 'currencyIds1');
    // Validate that all provided currencyIds exist within the transaction
    const currencies = await db.Currency.findAll({
      where: { id: { [Op.in]: currencyIds } },
    });

    if (currencies.length !== currencyIds.length) {
      return res
        .status(400)
        .send({ message: 'Some provided currency IDs do not exist' });
    }

    // Update the association between RateSource and Currencies within the transaction
    await rateSource.setCurrencies(currencies, { transaction });
  }

  // Return the updated RateSource, including its associated currencies
  const updatedRateSource = await db.RateSource.findByPk(rateSourceId, {
    include: [
      {
        model: db.Currency,
        through: { attributes: [] }, // виключити join-таблицю
        attributes: ['id', 'code', 'fullName'],
        as: 'currencies',
      },
    ],
  });

  return res.status(200).send(updatedRateSource);
});
