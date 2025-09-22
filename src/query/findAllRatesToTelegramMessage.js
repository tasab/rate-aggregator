import db from '../models/index.js';

export const findAllRatesToTelegramMessage = () => {
  // Get current time in Europe/Kiev timezone
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Kiev',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const currentTime = formatter.format(now); // Returns "HH:MM:SS" format

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
        model: db.RateCurrencyConfig,
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
    order: [
      [{ model: db.RateCurrencyConfig, as: 'currencyConfigs' }, 'order', 'ASC'],
    ],
  });
};
