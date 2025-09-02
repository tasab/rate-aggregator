import { Op, fn, col, Sequelize } from 'sequelize';
import db from '../../models/index.js';
import { logger } from '../../utils/logger.js';

export const getRateSources = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      location,
      name,
      minCurrencyCount = 1,
      maxCurrencyCount = 100,
    } = req.query;

    const offset = (page - 1) * limit;

    const whereClause = {};
    if (location) {
      whereClause.location = {
        [Op.iLike]: `%${location}%`,
      };
    }
    if (name) {
      whereClause.name = {
        [Op.iLike]: `%${name}%`,
      };
    }

    const currencyCountCol = fn('COUNT', col('currencies.id'));

    let havingClause = {};
    const parsedMinCount = minCurrencyCount ? parseInt(minCurrencyCount) : null;
    const parsedMaxCount = maxCurrencyCount ? parseInt(maxCurrencyCount) : null;

    const isValidMin = !isNaN(parsedMinCount);
    const isValidMax = !isNaN(parsedMaxCount);

    if (isValidMin || isValidMax) {
      if (isValidMin && isValidMax && parsedMinCount === parsedMaxCount) {
        havingClause = Sequelize.where(currencyCountCol, parsedMinCount);
      } else {
        const conditions = [];
        if (isValidMin) {
          conditions.push(
            Sequelize.where(currencyCountCol, { [Op.gte]: parsedMinCount })
          );
        }
        if (isValidMax) {
          conditions.push(
            Sequelize.where(currencyCountCol, { [Op.lte]: parsedMaxCount })
          );
        }
        havingClause =
          conditions.length > 1 ? { [Op.and]: conditions } : conditions[0];
      }
    }

    const results = await db.RateSource.findAll({
      where: whereClause,
      attributes: [
        'id',
        'name',
        'type',
        ['controller_type', 'controllerType'],
        'location',
        'link',
        ['rate_source_order_id', 'rateSourceOrderId'],
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
        [currencyCountCol, 'currencyCount'],
      ],
      include: [
        {
          model: db.Currency,
          as: 'currencies',
          attributes: [],
          through: {
            attributes: [],
          },
        },
      ],
      group: [
        'RateSource.id',
        'RateSource.name',
        'RateSource.type',
        'RateSource.controller_type',
        'RateSource.location',
        'RateSource.link',
        'RateSource.rate_source_order_id',
        'RateSource.created_at',
        'RateSource.updated_at',
      ],
      having: havingClause,
      raw: true,
      order: [['id', 'ASC']],
    });

    const totalItems = results.length;
    const totalPages = Math.ceil(totalItems / limit);
    const paginatedResults = results.slice(offset, offset + parseInt(limit));

    return res.status(200).json({
      data: paginatedResults,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems,
        itemsPerPage: parseInt(limit),
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    logger('Error in getAllRateSources:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
};
