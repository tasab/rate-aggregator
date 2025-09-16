import { parseRate } from '../../utils/rateUtils.js';
import { getLatestRateSourceData } from '../../query/getLatestRateSourceData.js';
import { logger } from '../../utils/logger.js';
import { getRateWithCurrencyConfigs } from '../../query/getRateWithCurrencyConfigs.js';

export const getCalculatedRate = async (req, res) => {
  try {
    const rateId = req.params?.rateId;

    if (!rateId) {
      return res.status(400).json({ message: 'rateId is required' });
    }

    const rate = await getRateWithCurrencyConfigs(rateId);

    if (!rate) {
      return res.status(404).json({ message: 'Rate not found' });
    }

    const rateCurrencies = rate?.currencies;
    const currencyConfigs = rate?.currencyConfigs;

    const enrichedRateSourceData = await getLatestRateSourceData(
      rate.rateSource?.id
    );

    const calculatedRates = rateCurrencies?.map((currency) => {
      const rateData = enrichedRateSourceData?.find((data) => {
        return (
          data?.currency_code?.toLowerCase() === currency?.code?.toLowerCase()
        );
      });

      const rateConfig = currencyConfigs?.find(
        (config) => config?.currency?.code === currency?.code
      );

      if (rateData && rateConfig) {
        const calculatedRate = parseRate(
          {
            bid: rateData.bid_rate,
            sell: rateData.sell_rate,
            updated: rateData.fetched_at,
          },
          rateConfig
        );
        return { currency: currency.code, calculatedRate };
      }

      return {
        currency: currency.code,
        error: 'Missing rate data or configuration',
      };
    });

    return res.status(200).json({
      rate,
      calculatedRates,
    });
  } catch (error) {
    logger(error, 'Failed to load: getCalculatedRate', logger.ERROR);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
