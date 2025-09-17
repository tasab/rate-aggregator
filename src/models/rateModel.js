export default (sequelize, DataTypes) => {
  const Rate = sequelize.define(
    'Rate',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rateSourceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      telegramBotToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      telegramChatId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      telegramMessageHeader: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      telegramMessageFooter: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      telegramSuccessConnection: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      telegramNotificationsEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      isPrivateRate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      startWorkingTime: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      endWorkingTime: {
        type: DataTypes.TIME,
        allowNull: true,
      },
    },
    {
      tableName: 'rates',
      timestamps: true,
      underscored: true,
    }
  );

  Rate.associate = (models) => {
    Rate.belongsTo(models.User, { foreignKey: 'userId' });
    Rate.belongsTo(models.RateSource, {
      foreignKey: 'rateSourceId',
      as: 'rateSource',
    });
    Rate.belongsToMany(models.Currency, {
      through: 'rate_currency',
      foreignKey: 'rateId',
      as: 'currencies',
      onDelete: 'CASCADE',
    });
    Rate.hasMany(models.CurrencyRateConfig, {
      foreignKey: 'rateId',
      as: 'currencyConfigs',
      onDelete: 'CASCADE',
    });
  };

  return Rate;
};
