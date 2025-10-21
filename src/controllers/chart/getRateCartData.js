import { Op } from 'sequelize';
import db from '../../models/index.js';
import { logger } from '../../utils/logger.js';
import { RATE_SOURCE, USER_RATE } from '../../constants/rateTypes.js';
import { findRateSourceById } from '../../query/rateSourceQueries.js';
import {
  CURRENCY_CONFIGS_INCLUDE,
  CURRENCY_INCLUDE,
} from '../../query/includes.js';
import { findUserRateById } from '../../query/userRateQueries.js';

export const getRateCartData = async (req, res) => {
  try {
    const { period = 'day', rateType = USER_RATE } = req.query;
    const { rateId } = req.params;

    if (!rateId) {
      return res.status(400).json({ error: 'Missing rateId parameter' });
    }

    const now = new Date();
    const fromDate = new Date();

    switch (period) {
      case 'week':
        fromDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        fromDate.setMonth(now.getMonth() - 1);
        break;
      default:
        fromDate.setDate(now.getDate() - 1);
    }

    let rates = null;
    let currencies = null;

    if (rateType === RATE_SOURCE) {
      const rateSource = await findRateSourceById(rateId, [CURRENCY_INCLUDE]);
      currencies = rateSource?.currencies;
      rates = await db.RateSourceData.findAll({
        where: {
          rateSourceId: rateId,
          fetchedAt: { [Op.gte]: fromDate },
        },
        attributes: ['code', 'bid', 'sell', 'fetchedAt'],
        order: [['fetchedAt', 'ASC']],
      });
    } else {
      const userRate = await findUserRateById(rateId, [
        CURRENCY_CONFIGS_INCLUDE,
      ]);
      currencies = userRate?.currencyConfigs.map((config) => config.currency);
      rates = await db.CalculatedRate.findAll({
        where: {
          rateId,
          calculatedAt: { [Op.gte]: fromDate },
        },
        attributes: ['code', 'bid', 'sell', 'calculatedAt'],
        order: [['calculatedAt', 'ASC']],
      });
    }

    res.json({
      rates,
      currencies,
    });
  } catch (error) {
    logger(
      error,
      `Failed to fetch chart data for ${req.query?.rateType ?? USER_RATE}`
    );
    res.status(500).json({
      error: `Failed to fetch chart data for ${req.query?.rateType ?? USER_RATE}`,
    });
  }
};
