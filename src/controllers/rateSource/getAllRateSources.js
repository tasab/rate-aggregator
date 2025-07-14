import db from '../../models/index.js';

export const getAllRateSources = async (req, res) => {
  try {
    const rateSources = await db.RateSource.findAll({
      include: [
        {
          model: db.Currency,
          through: { attributes: [] }, // виключити join-таблицю
          attributes: ['id', 'code', 'fullName'],
          as: 'currencies',
        },
      ],
    });
    return res.status(200).send(rateSources);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'Internal server error' });
  }
};
