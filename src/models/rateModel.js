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
      lastUpdatedAt: {
        type: DataTypes.DATE,
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
    Rate.hasMany(models.RateCurrencyConfig, {
      foreignKey: 'rateId',
      as: 'currencyConfigs',
      onDelete: 'CASCADE',
    });

    Rate.hasOne(models.TelegramConfig, {
      foreignKey: 'rateId',
      as: 'telegramConfig',
      onDelete: 'CASCADE',
    });
  };

  return Rate;
};
