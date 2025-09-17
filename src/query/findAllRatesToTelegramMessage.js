import db from '../models/index.js';

export const findAllRatesToTelegramMessage = () => {
  const currentTime = new Date().toTimeString().slice(0, 8); // Gets "HH:MM:SS" format

  return db.Rate.findAll({
    where: {
      telegramBotToken: { [db.Sequelize.Op.ne]: null },
      telegramChatId: { [db.Sequelize.Op.ne]: null },
      telegramNotificationsEnabled: true,
      [db.Sequelize.Op.or]: [
        // Include rates without working time restrictions
        {
          startWorkingTime: null,
          endWorkingTime: null,
        },
        // Include rates where current time is within working hours
        {
          startWorkingTime: { [db.Sequelize.Op.lte]: currentTime },
          endWorkingTime: { [db.Sequelize.Op.gte]: currentTime },
        },
      ],
    },
    include: [
      {
        model: db.Currency,
        through: { attributes: [] },
        attributes: ['id', 'code', 'fullName'],
        as: 'currencies',
      },
      {
        model: db.CurrencyRateConfig,
        as: 'currencyConfigs',
        include: [
          {
            model: db.Currency,
            attributes: ['id', 'code'],
            as: 'currency',
          },
        ],
      },
      {
        model: db.RateSource,
        attributes: ['id', 'name', 'type', 'location', 'link'],
        as: 'rateSource',
      },
    ],
  });
};
