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
        // Normal time range (same day): start <= current <= end
        {
          startWorkingTime: {
            [db.Sequelize.Op.lte]: db.Sequelize.col('end_working_time'),
          },
          [db.Sequelize.Op.and]: [
            { startWorkingTime: { [db.Sequelize.Op.lte]: currentTime } },
            { endWorkingTime: { [db.Sequelize.Op.gte]: currentTime } },
          ],
        },
        // Overnight range (crosses midnight): start > end
        {
          startWorkingTime: {
            [db.Sequelize.Op.gt]: db.Sequelize.col('end_working_time'),
          },
          [db.Sequelize.Op.or]: [
            // Current time is after start time (same day)
            { startWorkingTime: { [db.Sequelize.Op.lte]: currentTime } },
            // Current time is before end time (next day)
            { endWorkingTime: { [db.Sequelize.Op.gte]: currentTime } },
          ],
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
