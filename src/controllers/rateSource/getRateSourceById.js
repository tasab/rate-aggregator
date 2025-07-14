import db from '../../models/index.js';
import { getRateSourceController } from '../../utils/getRateSourceController.js';

export const getRateSourceById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id, 'id1');
    const { includeRate } = req.query;
    let filteredRate = null;
    console.log(includeRate, 'includeRate1');
    // Fetch current source with associated currencies
    const currentSource = await db.RateSource.findByPk(id, {
      include: [
        {
          model: db.Currency,
          through: { attributes: [] }, // Exclude join table attributes
          attributes: ['id', 'code', 'fullName'],
          as: 'currencies', // Alias for related currencies
        },
      ],
    });

    if (!currentSource) {
      return res.status(404).send({ error: 'Rate source not found' });
    }

    if (includeRate) {
      // Get the source controller
      const sourceController = getRateSourceController(
        currentSource.controllerType
      );

      // Call the controller to get rates
      const rate = await sourceController(currentSource);

      // Extract currency codes from currentSource.currencies
      console.log(currentSource.currencies, 'currentSource.currencies1');
      const availableCurrencyCodes = currentSource.currencies.map(
        (currency) => currency.code
      );
      console.log(availableCurrencyCodes, 'availableCurrencyCodes');
      console.log(rate, 'rate1');

      // Filter rate objects based on available currencies
      filteredRate = rate.filter((item) =>
        availableCurrencyCodes.includes(item.code)
      );
    }

    return res.status(200).send({
      rate: filteredRate, // Filtered rates
      currentSource,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Internal server error' });
  }
};
