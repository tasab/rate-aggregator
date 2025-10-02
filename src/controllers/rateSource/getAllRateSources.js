import { Op } from 'sequelize';
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

    // Add currency count filtering using the physical field
    const parsedMinCount = minCurrencyCount ? parseInt(minCurrencyCount) : null;
    const parsedMaxCount = maxCurrencyCount ? parseInt(maxCurrencyCount) : null;

    if (!isNaN(parsedMinCount)) {
      whereClause.currencyCount = { [Op.gte]: parsedMinCount };
    }
    if (!isNaN(parsedMaxCount)) {
      if (whereClause.currencyCount) {
        whereClause.currencyCount[Op.lte] = parsedMaxCount;
      } else {
        whereClause.currencyCount = { [Op.lte]: parsedMaxCount };
      }
    }

    const { count, rows } = await db.RateSource.findAndCountAll({
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
        ['currency_count', 'currencyCount'], // Use the physical field
      ],
      include: [
        {
          model: db.Currency,
          as: 'currencies',
          attributes: ['id', 'code', 'fullName', 'createdAt', 'updatedAt'],
          through: {
            attributes: [],
          },
        },
      ],
      limit: parseInt(limit),
      offset,
      order: [['id', 'ASC']],
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      data: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
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
